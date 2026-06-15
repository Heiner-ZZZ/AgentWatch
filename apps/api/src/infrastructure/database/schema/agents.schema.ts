import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { organizations } from './organizations.schema';

export const agents = pgTable('agents', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 180 }).notNull(),
  agentType: varchar('agent_type', { length: 80 }).notNull(),
  source: varchar('source', { length: 80 }),
  description: text('description'),
  status: varchar('status', { length: 40 }).notNull().default('active'),
  autonomyLevel: varchar('autonomy_level', { length: 40 })
    .notNull()
    .default('supervised'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
