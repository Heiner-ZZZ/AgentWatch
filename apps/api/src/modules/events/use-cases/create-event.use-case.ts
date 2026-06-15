import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AgentsRepository } from '../../../infrastructure/database/repositories/agents.repository';
import { EventsRepository } from '../../../infrastructure/database/repositories/events.repository';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventModel } from '../models/event.model';
import { TimelineEventModel } from '../models/timeline-event.model';
import { BusinessSummaryService } from '../services/business-summary.service';
import { RiskClassificationService } from '../services/risk-classification.service';

@Injectable()
export class CreateEventUseCase {
  constructor(
    private readonly agentsRepository: AgentsRepository,
    private readonly eventsRepository: EventsRepository,
    private readonly businessSummaryService: BusinessSummaryService,
    private readonly riskClassificationService: RiskClassificationService,
  ) {}

  async execute(
    payload: CreateEventDto,
    agentKeyContext: { agentId: string; organizationId: string },
  ): Promise<TimelineEventModel> {
    if (payload.agentId !== agentKeyContext.agentId) {
      throw new ConflictException('agentId does not match the provided API key.');
    }

    const agent = await this.agentsRepository.findById(payload.agentId);

    if (!agent) {
      throw new NotFoundException('Agent not found.');
    }

    const existing = await this.eventsRepository.findByOrganizationAndIdempotencyKey(
      agentKeyContext.organizationId,
      payload.idempotencyKey,
    );

    if (existing) {
      return this.mapEvent(existing);
    }

    const normalized = this.normalize(payload);
    const riskDecision = this.riskClassificationService.classify({
      eventType: normalized.eventType,
      category: normalized.category,
      metadata: payload.metadata ?? {},
      sensitiveFlags: payload.sensitiveFlags ?? [],
    });
    const businessSummary = this.businessSummaryService.generate({
      eventType: normalized.eventType,
      source: normalized.source,
      sourceApp: normalized.sourceApp ?? null,
      technicalSummary: payload.technicalSummary ?? null,
      metadata: payload.metadata ?? {},
    });

    const event = await this.eventsRepository.create({
      organizationId: agentKeyContext.organizationId,
      agentId: payload.agentId,
      sessionId: payload.sessionId ?? null,
      eventType: normalized.eventType,
      category: normalized.category,
      source: normalized.source,
      sourceApp: normalized.sourceApp ?? null,
      occurredAt: new Date(payload.occurredAt),
      riskLevel: riskDecision.riskLevel,
      status: riskDecision.status,
      businessSummary,
      technicalSummary: payload.technicalSummary ?? null,
      metadata: payload.metadata ?? {},
      sensitiveFlags: payload.sensitiveFlags ?? [],
      requiresApproval: riskDecision.requiresApproval,
      idempotencyKey: payload.idempotencyKey,
    });

    return this.mapEvent(event);
  }

  private normalize(payload: CreateEventDto) {
    return {
      eventType: payload.eventType.trim().toLowerCase(),
      category: payload.category.trim().toLowerCase(),
      source: payload.source.trim().toLowerCase(),
      sourceApp: payload.sourceApp?.trim().toLowerCase(),
    };
  }

  mapEvent(event: {
    id: string;
    organizationId: string;
    agentId: string;
    agentName?: string | null;
    sessionId: string | null;
    eventType: string;
    category: string;
    source: string;
    sourceApp: string | null;
    occurredAt: Date;
    receivedAt: Date;
    riskLevel: string;
    status: string;
    technicalSummary: string | null;
    businessSummary: string | null;
    metadata: unknown;
    sensitiveFlags: unknown;
    requiresApproval: boolean;
    idempotencyKey: string;
  }): TimelineEventModel {
    return {
      id: event.id,
      organizationId: event.organizationId,
      agentId: event.agentId,
      agentName: event.agentName ?? null,
      sessionId: event.sessionId,
      eventType: event.eventType,
      category: event.category,
      source: event.source,
      sourceApp: event.sourceApp,
      occurredAt: event.occurredAt.toISOString(),
      receivedAt: event.receivedAt.toISOString(),
      riskLevel: event.riskLevel as EventModel['riskLevel'],
      status: event.status as EventModel['status'],
      technicalSummary: event.technicalSummary,
      businessSummary: event.businessSummary,
      metadata: (event.metadata ?? {}) as Record<string, unknown>,
      sensitiveFlags: ((event.sensitiveFlags ?? []) as string[]),
      requiresApproval: event.requiresApproval,
      idempotencyKey: event.idempotencyKey,
      displaySummary: event.businessSummary ?? this.buildFallbackSummary(event.eventType, event.sourceApp, event.source),
    };
  }

  private buildFallbackSummary(eventType: string, sourceApp: string | null, source: string) {
    const action = eventType.replace(/[_-]+/g, ' ').trim().toLowerCase();
    const channel = (sourceApp ?? source).replace(/[_-]+/g, ' ').trim().toLowerCase();

    return `El agente registro ${action} en ${channel}.`;
  }
}
