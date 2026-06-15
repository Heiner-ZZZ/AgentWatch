import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  organizationId!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @MinLength(4)
  password!: string;

  @IsIn(['owner', 'admin', 'operator', 'auditor', 'viewer', 'integrator'])
  role:
    | 'owner'
    | 'admin'
    | 'operator'
    | 'auditor'
    | 'viewer'
    | 'integrator' = 'viewer';

  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive' = 'active';
}
