import { ForbiddenException, Injectable } from '@nestjs/common';
import { OrganizationUsersRepository } from '../../../infrastructure/database/repositories/organization-users.repository';

type MembershipRole = 'owner' | 'admin' | 'operator' | 'auditor' | 'viewer' | 'integrator';

@Injectable()
export class AccessControlService {
  constructor(
    private readonly organizationUsersRepository: OrganizationUsersRepository,
  ) {}

  async getOrganizationIdsForUser(userId: string) {
    return this.organizationUsersRepository.findOrganizationIdsByUserId(userId);
  }

  async requireOrganizationMembership(organizationId: string, userId: string) {
    const membership = await this.organizationUsersRepository.findMembership(
      organizationId,
      userId,
    );

    if (!membership) {
      throw new ForbiddenException('You do not have access to this organization.');
    }

    return membership;
  }

  async requireOrganizationRole(
    organizationId: string,
    userId: string,
    allowedRoles: MembershipRole[],
  ) {
    const membership = await this.requireOrganizationMembership(organizationId, userId);

    if (!allowedRoles.includes(membership.role as MembershipRole)) {
      throw new ForbiddenException('Your role does not allow this action.');
    }

    return membership;
  }
}
