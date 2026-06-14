import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 180 }).notNull(),
  countryCode: varchar('country_code', { length: 2 }).notNull(),
  timezone: varchar('timezone', { length: 80 }).notNull(),
  plan: varchar('plan', { length: 40 }).notNull(),
  status: varchar('status', { length: 40 }).notNull(),
  metadata: text('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
