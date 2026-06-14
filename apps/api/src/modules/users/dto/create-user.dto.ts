import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @MinLength(4)
  password!: string;

  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive' = 'active';
}
