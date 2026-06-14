import { Body, Controller, Get, Post } from '@nestjs/common';
import { DecideApprovalDto } from '../dto/decide-approval.dto';
import { ApprovalsService } from '../services/approvals.service';

@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get()
  findAll() {
    return this.approvalsService.findAll();
  }

  @Post('decision')
  decide(@Body() payload: DecideApprovalDto) {
    return {
      message: 'Approval workflow scaffold endpoint ready.',
      payload,
    };
  }
}
