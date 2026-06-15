import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DatabaseService } from '../services/database.service';
import { organizationUsers } from '../schema';

@Injectable()
export class OrganizationUsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createMembership(input: {
    organizationId: string;
    userId: string;
    role: 'owner' | 'admin' | 'operator' | 'auditor' | 'viewer' | 'integrator';
  }) {
    const [membership] = await this.databaseService.db
      .insert(organizationUsers)
      .values(input)
      .returning();

    return membership;
  }

  async findOrganizationIdsByUserId(userId: string) {
    const memberships = await this.databaseService.db
      .select({ organizationId: organizationUsers.organizationId })
      .from(organizationUsers)
      .where(eq(organizationUsers.userId, userId));

    return memberships.map((membership) => membership.organizationId);
  }

  async findMembership(organizationId: string, userId: string) {
    const [membership] = await this.databaseService.db
      .select()
      .from(organizationUsers)
      .where(
        and(
          eq(organizationUsers.organizationId, organizationId),
          eq(organizationUsers.userId, userId),
        ),
      );

    return membership ?? null;
  }

  async findMembershipsByUserId(userId: string) {
    return this.databaseService.db
      .select()
      .from(organizationUsers)
      .where(eq(organizationUsers.userId, userId));
  }
}
