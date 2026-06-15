import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../../audit/services/audit.service';
import { AccessControlService } from '../../auth/services/access-control.service';
import { ApprovalsRepository } from '../../../infrastructure/database/repositories/approvals.repository';
import { EventsRepository } from '../../../infrastructure/database/repositories/events.repository';
import { ReportsRepository } from '../../../infrastructure/database/repositories/reports.repository';
import { GenerateReportDto } from '../dto/generate-report.dto';
import { ListReportsQueryDto } from '../dto/list-reports-query.dto';
import { ReportModel } from '../models/report.model';
import { ReportPdfService } from './report-pdf.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly eventsRepository: EventsRepository,
    private readonly approvalsRepository: ApprovalsRepository,
    private readonly accessControlService: AccessControlService,
    private readonly auditService: AuditService,
    private readonly reportPdfService: ReportPdfService,
  ) {}

  async findAll(query: ListReportsQueryDto, userId: string): Promise<ReportModel[]> {
    const organizationIds = await this.resolveAccessibleOrganizationIds(
      userId,
      query.organizationId,
    );

    if (organizationIds.length === 0) {
      return [];
    }

    const reports = await this.reportsRepository.findAllForOrganizations(organizationIds);
    return reports.map((report) => this.mapReport(report));
  }

  async generate(payload: GenerateReportDto, userId: string) {
    await this.accessControlService.requireOrganizationRole(payload.organizationId, userId, [
      'owner',
      'admin',
      'auditor',
      'operator',
    ]);

    const periodStart = new Date(payload.periodStart);
    const periodEnd = new Date(payload.periodEnd);

    if (Number.isNaN(periodStart.getTime()) || Number.isNaN(periodEnd.getTime())) {
      throw new BadRequestException('Invalid report period.');
    }

    if (periodEnd < periodStart) {
      throw new BadRequestException('Report period end must be after period start.');
    }

    const events = await this.eventsRepository.findForReport({
      organizationId: payload.organizationId,
      periodStart,
      periodEnd,
    });
    const approvals = await this.approvalsRepository.findByEventIds(events.map((event) => event.id));
    const reportPayload = this.buildPayload(events, approvals);
    const executiveSummary = this.buildExecutiveSummary(reportPayload);
    const fileName = this.buildFileName(periodStart, periodEnd);
    const pdfBuffer = this.reportPdfService.buildPdf(
      this.buildPdfLines({
        executiveSummary,
        reportPayload,
      }),
    );

    const report = await this.reportsRepository.create({
      organizationId: payload.organizationId,
      generatedByUserId: userId,
      periodStart,
      periodEnd,
      fileName,
      mimeType: 'application/pdf',
      executiveSummary,
      reportPayload,
      contentBase64: pdfBuffer.toString('base64'),
    });

    await this.auditService.record({
      organizationId: payload.organizationId,
      actorUserId: userId,
      action: 'report.generated',
      targetType: 'report',
      targetId: report.id,
      afterState: {
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
        fileName,
        eventCount: reportPayload.totals.eventCount,
      },
    });

    const savedReport = await this.findOne(report.id, userId);

    return {
      ...savedReport,
      downloadPath: `/api/v1/reports/${report.id}/download`,
    };
  }

  async findOne(reportId: string, userId: string) {
    const organizationIds = await this.accessControlService.getOrganizationIdsForUser(userId);
    const report = await this.reportsRepository.findByIdForOrganizations(reportId, organizationIds);

    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    return this.mapReport(report);
  }

  async download(reportId: string, userId: string) {
    const organizationIds = await this.accessControlService.getOrganizationIdsForUser(userId);
    const report = await this.reportsRepository.findByIdForOrganizations(reportId, organizationIds);

    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    return {
      fileName: report.fileName,
      mimeType: report.mimeType,
      content: Buffer.from(report.contentBase64, 'base64'),
    };
  }

  private async resolveAccessibleOrganizationIds(userId: string, requestedOrganizationId?: string) {
    const organizationIds = await this.accessControlService.getOrganizationIdsForUser(userId);

    if (!requestedOrganizationId) {
      return organizationIds;
    }

    return organizationIds.includes(requestedOrganizationId) ? [requestedOrganizationId] : [];
  }

  private buildPayload(
    events: Array<{
      id: string;
      eventType: string;
      riskLevel: string;
      status: string;
      businessSummary: string | null;
      agentName: string | null;
      occurredAt: Date;
    }>,
    approvals: Array<{
      eventId: string;
      status: string;
      decision: string | null;
      decisionComment: string | null;
      decidedByUserName: string | null;
    }>,
  ) {
    const highRiskCount = events.filter(
      (event) => event.riskLevel === 'high' || event.riskLevel === 'critical',
    ).length;
    const failedCount = events.filter((event) => event.status === 'failed').length;
    const approvalsByStatus = {
      pending: approvals.filter((approval) => approval.status === 'pending').length,
      approved: approvals.filter((approval) => approval.status === 'approved').length,
      rejected: approvals.filter((approval) => approval.status === 'rejected').length,
    };

    return {
      totals: {
        eventCount: events.length,
        highRiskCount,
        failedCount,
        approvalCount: approvals.length,
      },
      approvals: approvalsByStatus,
      eventTypes: this.countBy(events.map((event) => event.eventType)),
      highlights: events.slice(0, 5).map((event) => ({
        eventId: event.id,
        agentName: event.agentName,
        riskLevel: event.riskLevel,
        occurredAt: event.occurredAt.toISOString(),
        businessSummary: event.businessSummary,
      })),
      approvalsDetail: approvals.slice(0, 10),
    };
  }

  private buildExecutiveSummary(reportPayload: {
    totals: { eventCount: number; highRiskCount: number; failedCount: number; approvalCount: number };
    approvals: { pending: number; approved: number; rejected: number };
  }) {
    return `Periodo con ${reportPayload.totals.eventCount} eventos, ${reportPayload.totals.highRiskCount} de riesgo alto o critico, ${reportPayload.approvals.pending} aprobaciones pendientes y ${reportPayload.approvals.approved} aprobadas.`;
  }

  private buildPdfLines(input: {
    executiveSummary: string;
    reportPayload: {
      totals: { eventCount: number; highRiskCount: number; failedCount: number; approvalCount: number };
      approvals: { pending: number; approved: number; rejected: number };
      eventTypes?: Array<{ label: string; count: number }>;
      highlights: Array<{
        agentName: string | null;
        riskLevel: string;
        businessSummary: string | null;
      }>;
    };
  }) {
    return [
      'AgentWatch - Reporte operativo',
      input.executiveSummary,
      `Eventos totales: ${input.reportPayload.totals.eventCount}`,
      `Riesgo alto/critico: ${input.reportPayload.totals.highRiskCount}`,
      `Errores/fallos: ${input.reportPayload.totals.failedCount}`,
      `Aprobaciones registradas: ${input.reportPayload.totals.approvalCount}`,
      `Pendientes: ${input.reportPayload.approvals.pending}`,
      `Aprobadas: ${input.reportPayload.approvals.approved}`,
      `Rechazadas: ${input.reportPayload.approvals.rejected}`,
      ...((input.reportPayload.eventTypes ?? []).slice(0, 3).map(
        (item, index) => `Tipo ${index + 1}: ${item.label} (${item.count})`,
      )),
      ...input.reportPayload.highlights.map(
        (highlight, index) =>
          `#${index + 1} ${highlight.agentName ?? 'Agente'} ${highlight.riskLevel}: ${highlight.businessSummary ?? 'Sin resumen.'}`,
      ),
    ];
  }

  private countBy(values: string[]) {
    const counters = new Map<string, number>();

    for (const value of values) {
      counters.set(value, (counters.get(value) ?? 0) + 1);
    }

    return [...counters.entries()]
      .sort((left, right) => right[1] - left[1])
      .map(([label, count]) => ({
        label,
        count,
      }));
  }

  private buildFileName(periodStart: Date, periodEnd: Date) {
    const start = periodStart.toISOString().slice(0, 10);
    const end = periodEnd.toISOString().slice(0, 10);
    return `agentwatch-report-${start}-to-${end}.pdf`;
  }

  private mapReport(report: {
    id: string;
    organizationId: string;
    organizationName: string;
    generatedByUserId: string;
    generatedByUserName: string;
    periodStart: Date;
    periodEnd: Date;
    fileName: string;
    mimeType: string;
    executiveSummary: string;
    reportPayload: unknown;
    createdAt: Date;
  }): ReportModel {
    return {
      id: report.id,
      organizationId: report.organizationId,
      organizationName: report.organizationName,
      generatedByUserId: report.generatedByUserId,
      generatedByUserName: report.generatedByUserName,
      periodStart: report.periodStart.toISOString(),
      periodEnd: report.periodEnd.toISOString(),
      fileName: report.fileName,
      mimeType: report.mimeType,
      executiveSummary: report.executiveSummary,
      reportPayload: (report.reportPayload ?? {}) as Record<string, unknown>,
      createdAt: report.createdAt.toISOString(),
    };
  }
}
