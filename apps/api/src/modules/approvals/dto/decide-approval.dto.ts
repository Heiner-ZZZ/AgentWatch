import { IsIn } from 'class-validator';

export class DecideApprovalDto {
  @IsIn(['approve', 'reject'])
  decision!: 'approve' | 'reject';
}
