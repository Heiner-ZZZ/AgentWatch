import { and, desc, eq, inArray } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { agents, approvals, events, users } from '../schema';

@Injectable()
export class ApprovalsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: typeof approvals.$inferInsert) {
    const [approval] = await this.databaseService.db
      .insert(approvals)
      .values(input)
      .returning();

    return approval;
  }

  async findPendingByEventId(eventId: string) {
    const [approval] = await this.databaseService.db
      .select()
      .from(approvals)
      .where(and(eq(approvals.eventId, eventId), eq(approvals.status, 'pending')));

    return approval ?? null;
  }

  findAll(filters: {
    organizationIds: string[];
    organizationId?: string;
    status?: string;
  }) {
    const conditions = [inArray(approvals.organizationId, filters.organizationIds)];

    if (filters.organizationId) {
      conditions.push(eq(approvals.organizationId, filters.organizationId));
    }

    if (filters.status) {
      conditions.push(eq(approvals.status, filters.status));
    }

    return this.databaseService.db
      .select({
        id: approvals.id,
        organizationId: approvals.organizationId,
        eventId: approvals.eventId,
        status: approvals.status,
        decision: approvals.decision,
        requestedReason: approvals.requestedReason,
        decisionComment: approvals.decisionComment,
        requestedAt: approvals.requestedAt,
        decidedAt: approvals.decidedAt,
        decidedByUserId: approvals.decidedByUserId,
        decidedByUserName: users.fullName,
        isBlocking: approvals.isBlocking,
        resolutionMetadata: approvals.resolutionMetadata,
        eventType: events.eventType,
        riskLevel: events.riskLevel,
        eventStatus: events.status,
        businessSummary: events.businessSummary,
        technicalSummary: events.technicalSummary,
        agentId: events.agentId,
        agentName: agents.name,
      })
      .from(approvals)
      .innerJoin(events, eq(approvals.eventId, events.id))
      .innerJoin(agents, eq(events.agentId, agents.id))
      .leftJoin(users, eq(approvals.decidedByUserId, users.id))
      .where(and(...conditions))
      .orderBy(desc(approvals.requestedAt), desc(approvals.createdAt));
  }

  async findByIdForOrganizations(approvalId: string, organizationIds: string[]) {
    const [approval] = await this.databaseService.db
      .select({
        id: approvals.id,
        organizationId: approvals.organizationId,
        eventId: approvals.eventId,
        status: approvals.status,
        decision: approvals.decision,
        requestedReason: approvals.requestedReason,
        decisionComment: approvals.decisionComment,
        requestedAt: approvals.requestedAt,
        decidedAt: approvals.decidedAt,
        decidedByUserId: approvals.decidedByUserId,
        decidedByUserName: users.fullName,
        isBlocking: approvals.isBlocking,
        resolutionMetadata: approvals.resolutionMetadata,
        eventType: events.eventType,
        riskLevel: events.riskLevel,
        eventStatus: events.status,
        businessSummary: events.businessSummary,
        technicalSummary: events.technicalSummary,
        agentId: events.agentId,
        agentName: agents.name,
      })
      .from(approvals)
      .innerJoin(events, eq(approvals.eventId, events.id))
      .innerJoin(agents, eq(events.agentId, agents.id))
      .leftJoin(users, eq(approvals.decidedByUserId, users.id))
      .where(and(eq(approvals.id, approvalId), inArray(approvals.organizationId, organizationIds)));

    return approval ?? null;
  }

  async decide(input: {
    approvalId: string;
    decision: 'approve' | 'reject';
    decisionComment?: string | null;
    decidedByUserId: string;
    resolutionMetadata?: Record<string, unknown>;
  }) {
    const [approval] = await this.databaseService.db
      .update(approvals)
      .set({
        status: input.decision === 'approve' ? 'approved' : 'rejected',
        decision: input.decision,
        decisionComment: input.decisionComment ?? null,
        decidedByUserId: input.decidedByUserId,
        decidedAt: new Date(),
        resolutionMetadata: input.resolutionMetadata ?? {},
        updatedAt: new Date(),
      })
      .where(eq(approvals.id, input.approvalId))
      .returning();

    return approval ?? null;
  }

  findByEventIds(eventIds: string[]) {
    if (eventIds.length === 0) {
      return Promise.resolve([]);
    }

    return this.databaseService.db
      .select({
        id: approvals.id,
        organizationId: approvals.organizationId,
        eventId: approvals.eventId,
        status: approvals.status,
        decision: approvals.decision,
        requestedReason: approvals.requestedReason,
        decisionComment: approvals.decisionComment,
        requestedAt: approvals.requestedAt,
        decidedAt: approvals.decidedAt,
        decidedByUserId: approvals.decidedByUserId,
        decidedByUserName: users.fullName,
        isBlocking: approvals.isBlocking,
        resolutionMetadata: approvals.resolutionMetadata,
      })
      .from(approvals)
      .leftJoin(users, eq(approvals.decidedByUserId, users.id))
      .where(inArray(approvals.eventId, eventIds))
      .orderBy(desc(approvals.requestedAt), desc(approvals.createdAt));
  }
}
