import { and, eq, isNull, sql } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { authSessions } from '../schema';

@Injectable()
export class AuthSessionsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: { userId: string; tokenHash: string; expiresAt: Date }) {
    const [session] = await this.databaseService.db
      .insert(authSessions)
      .values(input)
      .returning();

    return session;
  }

  async findByTokenHash(tokenHash: string) {
    const [session] = await this.databaseService.db
      .select()
      .from(authSessions)
      .where(
        and(
          eq(authSessions.tokenHash, tokenHash),
          isNull(authSessions.revokedAt),
          sql`${authSessions.expiresAt} > now()`,
        ),
      );

    return session ?? null;
  }

  async revokeByTokenHash(tokenHash: string) {
    const [session] = await this.databaseService.db
      .update(authSessions)
      .set({
        revokedAt: new Date(),
      })
      .where(and(eq(authSessions.tokenHash, tokenHash), isNull(authSessions.revokedAt)))
      .returning();

    return session ?? null;
  }
}
