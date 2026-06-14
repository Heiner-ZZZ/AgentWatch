import {
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  agentId!: string;

  @IsString()
  @IsNotEmpty()
  eventType!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsDateString()
  occurredAt!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
