import { integer, timestamp } from 'drizzle-orm/pg-core';

export const baseSchema = {
  id: integer('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .notNull()
};
