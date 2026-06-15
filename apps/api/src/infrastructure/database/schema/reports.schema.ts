import { jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { organizations } from './organizations.schema';
import { users } from './users.schema';

export const reports = pgTable('reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  generatedByUserId: uuid('generated_by_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
  periodEnd: timestamp('period_end', { withTimezone: true }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 80 }).notNull().default('application/pdf'),
  executiveSummary: text('executive_summary').notNull(),
  reportPayload: jsonb('report_payload').notNull().default({}),
  contentBase64: text('content_base64').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
