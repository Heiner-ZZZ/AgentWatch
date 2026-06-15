import { boolean, jsonb, pgTable, text, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { events } from './events.schema';
import { organizations } from './organizations.schema';
import { users } from './users.schema';

export const approvals = pgTable(
  'approvals',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 40 }).notNull().default('pending'),
    decision: varchar('decision', { length: 20 }),
    requestedReason: text('requested_reason'),
    decisionComment: text('decision_comment'),
    requestedAt: timestamp('requested_at', { withTimezone: true }).defaultNow().notNull(),
    decidedAt: timestamp('decided_at', { withTimezone: true }),
    decidedByUserId: uuid('decided_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    resolutionMetadata: jsonb('resolution_metadata').notNull().default({}),
    isBlocking: boolean('is_blocking').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    uniqueEventApproval: unique().on(table.eventId),
  }),
);
