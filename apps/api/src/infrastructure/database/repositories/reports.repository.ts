import { and, desc, eq, inArray } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { organizations, reports, users } from '../schema';

@Injectable()
export class ReportsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: typeof reports.$inferInsert) {
    const [report] = await this.databaseService.db.insert(reports).values(input).returning();
    return report;
  }

  findAllForOrganizations(organizationIds: string[]) {
    return this.databaseService.db
      .select({
        id: reports.id,
        organizationId: reports.organizationId,
        organizationName: organizations.name,
        generatedByUserId: reports.generatedByUserId,
        generatedByUserName: users.fullName,
        periodStart: reports.periodStart,
        periodEnd: reports.periodEnd,
        fileName: reports.fileName,
        mimeType: reports.mimeType,
        executiveSummary: reports.executiveSummary,
        reportPayload: reports.reportPayload,
        createdAt: reports.createdAt,
      })
      .from(reports)
      .innerJoin(organizations, eq(reports.organizationId, organizations.id))
      .innerJoin(users, eq(reports.generatedByUserId, users.id))
      .where(inArray(reports.organizationId, organizationIds))
      .orderBy(desc(reports.createdAt));
  }

  async findByIdForOrganizations(reportId: string, organizationIds: string[]) {
    const [report] = await this.databaseService.db
      .select({
        id: reports.id,
        organizationId: reports.organizationId,
        organizationName: organizations.name,
        generatedByUserId: reports.generatedByUserId,
        generatedByUserName: users.fullName,
        periodStart: reports.periodStart,
        periodEnd: reports.periodEnd,
        fileName: reports.fileName,
        mimeType: reports.mimeType,
        executiveSummary: reports.executiveSummary,
        reportPayload: reports.reportPayload,
        contentBase64: reports.contentBase64,
        createdAt: reports.createdAt,
      })
      .from(reports)
      .innerJoin(organizations, eq(reports.organizationId, organizations.id))
      .innerJoin(users, eq(reports.generatedByUserId, users.id))
      .where(and(eq(reports.id, reportId), inArray(reports.organizationId, organizationIds)));

    return report ?? null;
  }
}
