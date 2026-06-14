import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @IsNotEmpty()
  organizationId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  agentType!: string;

  @IsString()
  source = 'manual';

  @IsString()
  description = '';

  @IsString()
  autonomyLevel: 'read_only' | 'supervised' | 'limited_write' | 'autonomous' =
    'supervised';

  @IsString()
  status: 'active' | 'inactive' = 'active';
}
