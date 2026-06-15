import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../../audit/services/audit.service';
import { AccessControlService } from '../../auth/services/access-control.service';
import { ApprovalsRepository } from '../../../infrastructure/database/repositories/approvals.repository';
import { EventsRepository } from '../../../infrastructure/database/repositories/events.repository';
import { ListApprovalsQueryDto } from '../dto/list-approvals-query.dto';
import { ApprovalModel } from '../models/approval.model';

@Injectable()
export class ApprovalsService {
  constructor(
    private readonly approvalsRepository: ApprovalsRepository,
    private readonly eventsRepository: EventsRepository,
    private readonly accessControlService: AccessControlService,
    private readonly auditService: AuditService,
  ) {}

  async createForEvent(input: {
    organizationId: string;
    eventId: string;
    riskLevel: 'high' | 'critical';
    businessSummary: string | null;
  }) {
    const existing = await this.approvalsRepository.findPendingByEventId(input.eventId);

    if (existing) {
      return existing;
    }

    const approval = await this.approvalsRepository.create({
      organizationId: input.organizationId,
      eventId: input.eventId,
      status: 'pending',
      requestedReason:
        input.businessSummary ??
        `El evento fue clasificado como ${input.riskLevel} y requiere validacion humana.`,
      isBlocking: input.riskLevel === 'critical',
      resolutionMetadata: {
        riskLevel: input.riskLevel,
      },
    });

    await this.auditService.record({
      organizationId: input.organizationId,
      action: 'approval.created',
      targetType: 'approval',
      targetId: approval.id,
      afterState: {
        eventId: input.eventId,
        riskLevel: input.riskLevel,
        status: approval.status,
        requestedReason: approval.requestedReason,
      },
    });

    return approval;
  }

  async findAll(query: ListApprovalsQueryDto, userId: string): Promise<ApprovalModel[]> {
    const organizationIds = await this.resolveAccessibleOrganizationIds(
      userId,
      query.organizationId,
    );

    if (organizationIds.length === 0) {
      return [];
    }

    const approvals = await this.approvalsRepository.findAll({
      organizationIds,
      organizationId: query.organizationId,
      status: query.status ?? 'pending',
    });

    return approvals.map((approval) => this.mapApproval(approval));
  }

  async findOne(id: string, userId: string): Promise<ApprovalModel> {
    const organizationIds = await this.accessControlService.getOrganizationIdsForUser(userId);

    if (organizationIds.length === 0) {
      throw new NotFoundException('Approval not found.');
    }

    const approval = await this.approvalsRepository.findByIdForOrganizations(id, organizationIds);

    if (!approval) {
      throw new NotFoundException('Approval not found.');
    }

    return this.mapApproval(approval);
  }

  async decide(
    approvalId: string,
    payload: { decision: 'approve' | 'reject'; comment?: string },
    user: { id: string },
  ) {
    const current = await this.findOne(approvalId, user.id);

    await this.accessControlService.requireOrganizationRole(current.organizationId, user.id, [
      'owner',
      'admin',
      'operator',
    ]);

    if (current.status !== 'pending') {
      throw new ForbiddenException('This approval has already been decided.');
    }

    const updatedApproval = await this.approvalsRepository.decide({
      approvalId,
      decision: payload.decision,
      decisionComment: payload.comment ?? null,
      decidedByUserId: user.id,
      resolutionMetadata: {
        previousStatus: current.status,
        eventRiskLevel: current.riskLevel,
      },
    });

    if (!updatedApproval) {
      throw new NotFoundException('Approval not found.');
    }

    await this.eventsRepository.updateStatus(
      current.eventId,
      payload.decision === 'approve' ? 'approved' : 'rejected',
    );

    await this.auditService.record({
      organizationId: current.organizationId,
      actorUserId: user.id,
      action: payload.decision === 'approve' ? 'approval.approved' : 'approval.rejected',
      targetType: 'approval',
      targetId: approvalId,
      beforeState: {
        status: current.status,
        decision: current.decision,
      },
      afterState: {
        status: updatedApproval.status,
        decision: updatedApproval.decision,
        decisionComment: updatedApproval.decisionComment,
      },
    });

    return this.findOne(approvalId, user.id);
  }

  private async resolveAccessibleOrganizationIds(userId: string, requestedOrganizationId?: string) {
    const organizationIds = await this.accessControlService.getOrganizationIdsForUser(userId);

    if (!requestedOrganizationId) {
      return organizationIds;
    }

    return organizationIds.includes(requestedOrganizationId) ? [requestedOrganizationId] : [];
  }

  private mapApproval(approval: {
    id: string;
    organizationId: string;
    eventId: string;
    status: string;
    decision: string | null;
    requestedReason: string | null;
    decisionComment: string | null;
    requestedAt: Date;
    decidedAt: Date | null;
    decidedByUserId: string | null;
    decidedByUserName: string | null;
    isBlocking: boolean;
    resolutionMetadata: unknown;
    eventType: string;
    riskLevel: string;
    eventStatus: string;
    businessSummary: string | null;
    technicalSummary: string | null;
    agentId: string;
    agentName: string | null;
  }): ApprovalModel {
    return {
      id: approval.id,
      organizationId: approval.organizationId,
      eventId: approval.eventId,
      status: approval.status as ApprovalModel['status'],
      decision: approval.decision as ApprovalModel['decision'],
      requestedReason: approval.requestedReason,
      decisionComment: approval.decisionComment,
      requestedAt: approval.requestedAt.toISOString(),
      decidedAt: approval.decidedAt?.toISOString() ?? null,
      decidedByUserId: approval.decidedByUserId,
      decidedByUserName: approval.decidedByUserName,
      isBlocking: approval.isBlocking,
      resolutionMetadata: (approval.resolutionMetadata ?? {}) as Record<string, unknown>,
      eventType: approval.eventType,
      riskLevel: approval.riskLevel as ApprovalModel['riskLevel'],
      eventStatus: approval.eventStatus,
      businessSummary: approval.businessSummary,
      technicalSummary: approval.technicalSummary,
      agentId: approval.agentId,
      agentName: approval.agentName,
    };
  }
}
