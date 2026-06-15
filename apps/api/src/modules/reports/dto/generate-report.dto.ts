import { IsDateString, IsUUID } from 'class-validator';

export class GenerateReportDto {
  @IsUUID()
  organizationId!: string;

  @IsDateString()
  periodStart!: string;

  @IsDateString()
  periodEnd!: string;
}
