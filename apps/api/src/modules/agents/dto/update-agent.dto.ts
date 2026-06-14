import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateAgentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['read_only', 'supervised', 'limited_write', 'autonomous'])
  autonomyLevel?: 'read_only' | 'supervised' | 'limited_write' | 'autonomous';

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
