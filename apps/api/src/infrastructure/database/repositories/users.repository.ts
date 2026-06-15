import { Injectable } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { DatabaseService } from '../services/database.service';
import { organizationUsers, users } from '../schema';

@Injectable()
export class UsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.db.select().from(users);
  }

  async findAllByOrganizationIds(organizationIds: string[]) {
    if (organizationIds.length === 0) {
      return [];
    }

    return this.databaseService.db
      .selectDistinct({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .innerJoin(organizationUsers, eq(organizationUsers.userId, users.id))
      .where(inArray(organizationUsers.organizationId, organizationIds));
  }

  async findById(id: string) {
    const [user] = await this.databaseService.db.select().from(users).where(eq(users.id, id));
    return user ?? null;
  }

  async findByEmail(email: string) {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    return user ?? null;
  }

  async create(input: {
    email: string;
    fullName: string;
    passwordHash: string;
    status: 'active' | 'inactive';
  }) {
    const [user] = await this.databaseService.db
      .insert(users)
      .values({
        email: input.email.toLowerCase(),
        fullName: input.fullName,
        passwordHash: input.passwordHash,
        status: input.status,
      })
      .returning();

    return user;
  }
}
