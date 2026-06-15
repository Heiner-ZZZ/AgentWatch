import { and, desc, eq, gte, inArray, lte } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { agents, events } from '../schema';

@Injectable()
export class EventsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findTimeline(filters: {
    organizationIds: string[];
    organizationId?: string;
    agentId?: string;
    eventType?: string;
    riskLevel?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    const conditions = [inArray(events.organizationId, filters.organizationIds)];

    if (filters.organizationId) {
      conditions.push(eq(events.organizationId, filters.organizationId));
    }

    if (filters.agentId) {
      conditions.push(eq(events.agentId, filters.agentId));
    }

    if (filters.eventType) {
      conditions.push(eq(events.eventType, filters.eventType));
    }

    if (filters.riskLevel) {
      conditions.push(eq(events.riskLevel, filters.riskLevel));
    }

    if (filters.status) {
      conditions.push(eq(events.status, filters.status));
    }

    if (filters.dateFrom) {
      conditions.push(gte(events.occurredAt, filters.dateFrom));
    }

    if (filters.dateTo) {
      conditions.push(lte(events.occurredAt, filters.dateTo));
    }

    return this.databaseService.db
      .select({
        id: events.id,
        organizationId: events.organizationId,
        agentId: events.agentId,
        agentName: agents.name,
        sessionId: events.sessionId,
        eventType: events.eventType,
        category: events.category,
        source: events.source,
        sourceApp: events.sourceApp,
        occurredAt: events.occurredAt,
        receivedAt: events.receivedAt,
        riskLevel: events.riskLevel,
        status: events.status,
        technicalSummary: events.technicalSummary,
        businessSummary: events.businessSummary,
        metadata: events.metadata,
        sensitiveFlags: events.sensitiveFlags,
        requiresApproval: events.requiresApproval,
        idempotencyKey: events.idempotencyKey,
      })
      .from(events)
      .innerJoin(agents, eq(events.agentId, agents.id))
      .where(and(...conditions))
      .orderBy(desc(events.occurredAt), desc(events.receivedAt));
  }

  async findByIdForOrganizations(eventId: string, organizationIds: string[]) {
    const [event] = await this.databaseService.db
      .select({
        id: events.id,
        organizationId: events.organizationId,
        agentId: events.agentId,
        agentName: agents.name,
        sessionId: events.sessionId,
        eventType: events.eventType,
        category: events.category,
        source: events.source,
        sourceApp: events.sourceApp,
        occurredAt: events.occurredAt,
        receivedAt: events.receivedAt,
        riskLevel: events.riskLevel,
        status: events.status,
        technicalSummary: events.technicalSummary,
        businessSummary: events.businessSummary,
        metadata: events.metadata,
        sensitiveFlags: events.sensitiveFlags,
        requiresApproval: events.requiresApproval,
        idempotencyKey: events.idempotencyKey,
      })
      .from(events)
      .innerJoin(agents, eq(events.agentId, agents.id))
      .where(and(eq(events.id, eventId), inArray(events.organizationId, organizationIds)));

    return event ?? null;
  }

  async findByOrganizationAndIdempotencyKey(organizationId: string, idempotencyKey: string) {
    const [event] = await this.databaseService.db
      .select()
      .from(events)
      .where(
        and(
          eq(events.organizationId, organizationId),
          eq(events.idempotencyKey, idempotencyKey),
        ),
      );

    return event ?? null;
  }

  async create(input: typeof events.$inferInsert) {
    const [event] = await this.databaseService.db.insert(events).values(input).returning();
    return event;
  }
}
