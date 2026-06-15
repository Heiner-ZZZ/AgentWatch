import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { agents } from './agents.schema';
import { organizations } from './organizations.schema';

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  agentId: uuid('agent_id')
    .notNull()
    .references(() => agents.id, { onDelete: 'cascade' }),
  keyPrefix: varchar('key_prefix', { length: 32 }).notNull(),
  keyHash: varchar('key_hash', { length: 255 }).notNull(),
  status: varchar('status', { length: 40 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  rotatedAt: timestamp('rotated_at', { withTimezone: true }),
});
