import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
  findAll() {
    return apiResponse(this.agentsService.findAll());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return apiResponse(this.agentsService.findOne(id));
  }

  @Post()
  create(@Body() payload: CreateAgentDto) {
    return apiResponse(this.agentsService.create(payload), 'Agent created.');
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateAgentDto) {
    return apiResponse(this.agentsService.update(id, payload), 'Agent updated.');
  }

  @Post(':id/rotate-key')
  rotateKey(@Param('id') id: string) {
    return apiResponse(this.agentsService.rotateKey(id), 'Agent key rotated.');
  }
}
