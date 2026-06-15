import { Injectable } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { DatabaseService } from '../services/database.service';
import { organizations } from '../schema';

@Injectable()
export class OrganizationsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.db.select().from(organizations);
  }

  findAllByIds(ids: string[]) {
    if (ids.length === 0) {
      return [];
    }

    return this.databaseService.db
      .select()
      .from(organizations)
      .where(inArray(organizations.id, ids));
  }

  async findById(id: string) {
    const [organization] = await this.databaseService.db
      .select()
      .from(organizations)
      .where(eq(organizations.id, id));

    return organization ?? null;
  }

  async create(input: {
    name: string;
    countryCode: string;
    timezone: string;
    plan: string;
    status: 'active' | 'inactive';
  }) {
    const [organization] = await this.databaseService.db
      .insert(organizations)
      .values(input)
      .returning();

    return organization;
  }

  async update(
    id: string,
    input: Partial<{
      name: string;
      countryCode: string;
      timezone: string;
      plan: string;
      status: 'active' | 'inactive';
    }>,
  ) {
    const [organization] = await this.databaseService.db
      .update(organizations)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, id))
      .returning();

    return organization ?? null;
  }
}
