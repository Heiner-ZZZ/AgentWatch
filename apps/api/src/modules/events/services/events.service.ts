import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationUsersRepository } from '../../../infrastructure/database/repositories/organization-users.repository';
import { EventsRepository } from '../../../infrastructure/database/repositories/events.repository';
import { CreateEventDto } from '../dto/create-event.dto';
import { ListEventsQueryDto } from '../dto/list-events-query.dto';
import { CreateEventUseCase } from '../use-cases/create-event.use-case';

@Injectable()
export class EventsService {
  constructor(
    private readonly organizationUsersRepository: OrganizationUsersRepository,
    private readonly eventsRepository: EventsRepository,
    private readonly createEventUseCase: CreateEventUseCase,
  ) {}

  async findAll(query: ListEventsQueryDto, userId: string) {
    const organizationIds = await this.resolveAccessibleOrganizationIds(
      userId,
      query.organizationId,
    );

    if (organizationIds.length === 0) {
      return [];
    }

    const events = await this.eventsRepository.findTimeline({
      organizationIds,
      organizationId: query.organizationId,
      agentId: query.agentId,
      eventType: query.eventType?.trim().toLowerCase(),
      riskLevel: query.riskLevel,
      status: query.status,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    });

    return events.map((event) => this.createEventUseCase.mapEvent(event));
  }

  async findOne(id: string, userId: string) {
    const organizationIds =
      await this.organizationUsersRepository.findOrganizationIdsByUserId(userId);

    if (organizationIds.length === 0) {
      throw new NotFoundException('Event not found.');
    }

    const event = await this.eventsRepository.findByIdForOrganizations(id, organizationIds);

    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    return this.createEventUseCase.mapEvent(event);
  }

  create(payload: CreateEventDto, agentKeyContext: { agentId: string; organizationId: string }) {
    return this.createEventUseCase.execute(payload, agentKeyContext);
  }

  private async resolveAccessibleOrganizationIds(userId: string, requestedOrganizationId?: string) {
    const organizationIds =
      await this.organizationUsersRepository.findOrganizationIdsByUserId(userId);

    if (!requestedOrganizationId) {
      return organizationIds;
    }

    return organizationIds.includes(requestedOrganizationId) ? [requestedOrganizationId] : [];
  }
}
