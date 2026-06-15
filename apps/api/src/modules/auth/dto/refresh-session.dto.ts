import { IsString, Matches } from 'class-validator';

export class RefreshSessionDto {
  @IsString()
  @Matches(/^aw_session_/)
  refreshToken!: string;
}
