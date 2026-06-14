import { IsIn, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 180)
  name!: string;

  @IsString()
  @Length(2, 2)
  countryCode = 'EC';

  @IsString()
  timezone = 'America/Guayaquil';

  @IsString()
  plan = 'starter';

  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive' = 'active';
}
