import { Injectable } from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { DatabaseService } from '../services/database.service';
import { agents } from '../schema';

@Injectable()
export class AgentsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.db.select().from(agents);
  }

  findAllByOrganizationIds(organizationIds: string[]) {
    if (organizationIds.length === 0) {
      return [];
    }

    return this.databaseService.db
      .select()
      .from(agents)
      .where(inArray(agents.organizationId, organizationIds));
  }

  async findById(id: string) {
    const [agent] = await this.databaseService.db.select().from(agents).where(eq(agents.id, id));
    return agent ?? null;
  }

  async findByIdForOrganizationIds(id: string, organizationIds: string[]) {
    if (organizationIds.length === 0) {
      return null;
    }

    const [agent] = await this.databaseService.db
      .select()
      .from(agents)
      .where(and(eq(agents.id, id), inArray(agents.organizationId, organizationIds)));

    return agent ?? null;
  }

  async create(input: {
    organizationId: string;
    name: string;
    agentType: string;
    source: string;
    description: string;
    autonomyLevel: 'read_only' | 'supervised' | 'limited_write' | 'autonomous';
    status: 'active' | 'inactive';
  }) {
    const [agent] = await this.databaseService.db.insert(agents).values(input).returning();
    return agent;
  }

  async update(
    id: string,
    input: Partial<{
      name: string;
      source: string;
      description: string;
      autonomyLevel: 'read_only' | 'supervised' | 'limited_write' | 'autonomous';
      status: 'active' | 'inactive';
    }>,
  ) {
    const [agent] = await this.databaseService.db
      .update(agents)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(agents.id, id))
      .returning();

    return agent ?? null;
  }
}
