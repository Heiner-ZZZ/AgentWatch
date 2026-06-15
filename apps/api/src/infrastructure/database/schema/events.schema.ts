import { boolean, jsonb, pgTable, text, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { agents } from './agents.schema';
import { organizations } from './organizations.schema';

export const events = pgTable(
  'events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    agentId: uuid('agent_id')
      .notNull()
      .references(() => agents.id, { onDelete: 'cascade' }),
    sessionId: varchar('session_id', { length: 120 }),
    eventType: varchar('event_type', { length: 100 }).notNull(),
    category: varchar('category', { length: 80 }).notNull(),
    source: varchar('source', { length: 80 }).notNull(),
    sourceApp: varchar('source_app', { length: 80 }),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
    receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
    riskLevel: varchar('risk_level', { length: 40 }).notNull().default('low'),
    status: varchar('status', { length: 40 }).notNull().default('received'),
    businessSummary: text('business_summary'),
    technicalSummary: text('technical_summary'),
    metadata: jsonb('metadata').notNull().default({}),
    sensitiveFlags: jsonb('sensitive_flags').notNull().default([]),
    requiresApproval: boolean('requires_approval').notNull().default(false),
    idempotencyKey: text('idempotency_key').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    organizationIdempotencyUnique: unique().on(table.organizationId, table.idempotencyKey),
  }),
);
