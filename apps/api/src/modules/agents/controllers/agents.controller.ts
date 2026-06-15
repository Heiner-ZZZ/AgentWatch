import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../common/auth/decorators/current-user.decorator';
import { SessionAuthGuard } from '../../../common/auth/guards/session-auth.guard';
import { apiResponse } from '../../../common/http/presenters/api-response.presenter';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { UpdateAgentDto } from '../dto/update-agent.dto';
import { AgentsService } from '../services/agents.service';

@Controller('agents')
@UseGuards(SessionAuthGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  async findAll(@CurrentUser() user: { id: string }) {
    return apiResponse(await this.agentsService.findAll(user.id));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return apiResponse(await this.agentsService.findOne(id, user.id));
  }

  @Post()
  async create(@Body() payload: CreateAgentDto, @CurrentUser() user: { id: string }) {
    return apiResponse(await this.agentsService.create(payload, user.id), 'Agent created.');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateAgentDto,
    @CurrentUser() user: { id: string },
  ) {
    return apiResponse(await this.agentsService.update(id, payload, user.id), 'Agent updated.');
  }

  @Post(':id/rotate-key')
  async rotateKey(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return apiResponse(await this.agentsService.rotateKey(id, user.id), 'Agent key rotated.');
  }
}
