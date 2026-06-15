import { jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { organizations } from './organizations.schema';
import { users } from './users.schema';

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id, {
    onDelete: 'set null',
  }),
  actorUserId: uuid('actor_user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  action: varchar('action', { length: 120 }).notNull(),
  targetType: varchar('target_type', { length: 80 }),
  targetId: uuid('target_id'),
  beforeState: jsonb('before_state'),
  afterState: jsonb('after_state'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
