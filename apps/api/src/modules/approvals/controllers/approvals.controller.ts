import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../common/auth/decorators/current-user.decorator';
import { SessionAuthGuard } from '../../../common/auth/guards/session-auth.guard';
import { apiResponse } from '../../../common/http/presenters/api-response.presenter';
import { DecideApprovalDto } from '../dto/decide-approval.dto';
import { ListApprovalsQueryDto } from '../dto/list-approvals-query.dto';
import { ApprovalsService } from '../services/approvals.service';

@Controller('approvals')
@UseGuards(SessionAuthGuard)
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get()
  async findAll(
    @Query() query: ListApprovalsQueryDto,
    @CurrentUser() user: { id: string },
  ) {
    return apiResponse(await this.approvalsService.findAll(query, user.id));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return apiResponse(await this.approvalsService.findOne(id, user.id));
  }

  @Post(':id/decision')
  async decide(
    @Param('id') id: string,
    @Body() payload: DecideApprovalDto,
    @CurrentUser() user: { id: string },
  ) {
    return apiResponse(
      await this.approvalsService.decide(id, payload, user),
      'Approval decision recorded.',
    );
  }
}
