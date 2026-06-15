import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../common/auth/decorators/current-user.decorator';
import { CurrentAgentKey } from '../../../common/auth/decorators/current-agent-key.decorator';
import { AgentApiKeyGuard } from '../../../common/auth/guards/agent-api-key.guard';
import { SessionAuthGuard } from '../../../common/auth/guards/session-auth.guard';
import { apiResponse } from '../../../common/http/presenters/api-response.presenter';
import { CreateEventDto } from '../dto/create-event.dto';
import { ListEventsQueryDto } from '../dto/list-events-query.dto';
import { EventsService } from '../services/events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseGuards(SessionAuthGuard)
  async findAll(
    @Query() query: ListEventsQueryDto,
    @CurrentUser() user: { id: string },
  ) {
    return apiResponse(await this.eventsService.findAll(query, user.id));
  }

  @Get(':id')
  @UseGuards(SessionAuthGuard)
  async findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return apiResponse(await this.eventsService.findOne(id, user.id));
  }

  @Post()
  @UseGuards(AgentApiKeyGuard)
  async create(
    @Body() payload: CreateEventDto,
    @CurrentAgentKey() agentKeyContext: { agentId: string; organizationId: string },
  ) {
    const event = await this.eventsService.create(payload, agentKeyContext);
    return apiResponse(event, 'Event recorded.');
  }
}
