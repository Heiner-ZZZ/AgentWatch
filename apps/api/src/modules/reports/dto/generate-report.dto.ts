import { IsDateString } from 'class-validator';

export class GenerateReportDto {
  @IsDateString()
  periodStart!: string;

  @IsDateString()
  periodEnd!: string;
}
