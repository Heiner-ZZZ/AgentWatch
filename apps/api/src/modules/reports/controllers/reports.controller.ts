import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from '../../../common/auth/decorators/current-user.decorator';
import { SessionAuthGuard } from '../../../common/auth/guards/session-auth.guard';
import { apiResponse } from '../../../common/http/presenters/api-response.presenter';
import { GenerateReportDto } from '../dto/generate-report.dto';
import { ListReportsQueryDto } from '../dto/list-reports-query.dto';
import { ReportsService } from '../services/reports.service';

@Controller('reports')
@UseGuards(SessionAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async findAll(
    @Query() query: ListReportsQueryDto,
    @CurrentUser() user: { id: string },
  ) {
    return apiResponse(await this.reportsService.findAll(query, user.id));
  }

  @Post('generate')
  async generate(@Body() payload: GenerateReportDto, @CurrentUser() user: { id: string }) {
    return apiResponse(await this.reportsService.generate(payload, user.id), 'Report generated.');
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return apiResponse(await this.reportsService.findOne(id, user.id));
  }

  @Get(':id/download')
  async download(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Res() response: Response,
  ) {
    const file = await this.reportsService.download(id, user.id);

    response.setHeader('Content-Type', file.mimeType);
    response.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
    response.send(file.content);
  }
}
