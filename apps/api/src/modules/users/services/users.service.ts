import { ConflictException, Injectable } from '@nestjs/common';
import { AccessControlService } from '../../auth/services/access-control.service';
import { AuditService } from '../../audit/services/audit.service';
import { CredentialService } from '../../../common/security/services/credential.service';
import { OrganizationUsersRepository } from '../../../infrastructure/database/repositories/organization-users.repository';
import { UsersRepository } from '../../../infrastructure/database/repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserModel } from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(
    private readonly accessControlService: AccessControlService,
    private readonly auditService: AuditService,
    private readonly organizationUsersRepository: OrganizationUsersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly credentialService: CredentialService,
  ) {}

  async findAll(userId: string, organizationId?: string): Promise<UserModel[]> {
    const targetOrganizationId = organizationId
      ? (
          await this.accessControlService.requireOrganizationMembership(organizationId, userId)
        ).organizationId
      : null;
    const memberships = await this.organizationUsersRepository.findMembershipsByUserId(userId);
    const organizationIds = targetOrganizationId
      ? [targetOrganizationId]
      : memberships.map((membership) => membership.organizationId);
    const users = await this.usersRepository.findAllByOrganizationIds(organizationIds);

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status as 'active' | 'inactive',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));
  }

  async create(payload: CreateUserDto, actorUserId: string): Promise<UserModel> {
    await this.accessControlService.requireOrganizationRole(payload.organizationId, actorUserId, [
      'owner',
      'admin',
    ]);
    const exists = await this.usersRepository.findByEmail(payload.email);

    if (exists) {
      throw new ConflictException('Email already exists.');
    }

    const user = await this.usersRepository.create({
      email: payload.email,
      fullName: payload.fullName,
      passwordHash: this.credentialService.hashValue(payload.password),
      status: payload.status,
    });

    await this.organizationUsersRepository.createMembership({
      organizationId: payload.organizationId,
      userId: user.id,
      role: payload.role,
    });

    await this.auditService.record({
      organizationId: payload.organizationId,
      actorUserId,
      action: 'user.created',
      targetType: 'user',
      targetId: user.id,
      afterState: {
        email: user.email,
        fullName: user.fullName,
        status: user.status,
        role: payload.role,
      },
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status as 'active' | 'inactive',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
