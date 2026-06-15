import { IsDateString, IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

const riskLevels = ['low', 'medium', 'high', 'critical'] as const;
const eventStatuses = [
  'received',
  'normalized',
  'classified',
  'recorded',
  'pending_approval',
  'approved',
  'rejected',
  'failed',
  'ignored',
] as const;

export class ListEventsQueryDto {
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @IsOptional()
  @IsUUID()
  agentId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  eventType?: string;

  @IsOptional()
  @IsIn(riskLevels)
  riskLevel?: (typeof riskLevels)[number];

  @IsOptional()
  @IsIn(eventStatuses)
  status?: (typeof eventStatuses)[number];

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
