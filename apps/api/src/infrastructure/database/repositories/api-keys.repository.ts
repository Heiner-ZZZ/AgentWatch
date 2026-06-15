import { and, eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { apiKeys } from '../schema';

@Injectable()
export class ApiKeysRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: {
    organizationId: string;
    agentId: string;
    keyPrefix: string;
    keyHash: string;
  }) {
    const [apiKey] = await this.databaseService.db
      .insert(apiKeys)
      .values({
        ...input,
        status: 'active',
      })
      .returning();

    return apiKey;
  }

  async deactivateActiveKeyForAgent(agentId: string) {
    await this.databaseService.db
      .update(apiKeys)
      .set({
        status: 'inactive',
        rotatedAt: new Date(),
      })
      .where(and(eq(apiKeys.agentId, agentId), eq(apiKeys.status, 'active')));
  }

  async findActiveByPrefixAndHash(keyPrefix: string, keyHash: string) {
    const [apiKey] = await this.databaseService.db
      .select()
      .from(apiKeys)
      .where(
        and(
          eq(apiKeys.keyPrefix, keyPrefix),
          eq(apiKeys.keyHash, keyHash),
          eq(apiKeys.status, 'active'),
        ),
      );

    return apiKey ?? null;
  }
}
