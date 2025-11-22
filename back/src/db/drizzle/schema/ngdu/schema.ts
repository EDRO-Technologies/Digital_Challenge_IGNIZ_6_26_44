import { index, integer, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { baseSchema } from '../base.schema';

export const alarmSeverityEnum = pgEnum('alarm_severity', ['low', 'medium', 'high', 'critical']);
export const alarmStatusEnum = pgEnum('alarm_status', ['active', 'acknowledged', 'resolved']);

export const ngdu = pgTable('ngdu', {
  ...baseSchema,
  name: varchar('name', { length: 255 }).notNull()
});

export const mest = pgTable('mest', {
  ...baseSchema,
  ngduId: integer('ngdu_id')
    .references(() => ngdu.id)
    .notNull(),
  name: varchar('name', { length: 255 }).notNull()
});

export const cdng = pgTable('cdng', {
  ...baseSchema,
  ngduId: integer('ngdu_id')
    .references(() => ngdu.id)
    .notNull(),
  name: varchar('name', { length: 255 }).notNull()
});

export const obj = pgTable('obj', {
  ...baseSchema,
  mestId: integer('mest_id')
    .references(() => mest.id)
    .notNull(),
  name: varchar('name', { length: 255 }).notNull()
});

export const kust = pgTable('kust', {
  ...baseSchema,
  cdngId: integer('cdng_id')
    .references(() => cdng.id)
    .notNull(),
  name: varchar('name', { length: 255 }).notNull()
});

export const plast = pgTable('plast', {
  ...baseSchema,
  objId: integer('obj_id')
    .references(() => obj.id)
    .notNull(),
  name: varchar('name', { length: 255 }).notNull()
});

export const well = pgTable('well', {
  ...baseSchema,
  kustId: integer('kust_id')
    .references(() => kust.id)
    .notNull(),
  plastId: integer('plast_id')
    .references(() => plast.id)
    .notNull(),
  name: varchar('name', { length: 255 }).notNull()
});

export const alarm = pgTable(
  'alarm',
  {
    ...baseSchema,
    alarmableType: varchar('alarmable_type', { length: 50 }).notNull(),
    alarmableId: integer('alarmable_id').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    severity: alarmSeverityEnum('severity').notNull(),
    status: alarmStatusEnum('status').notNull().default('active'),
    resolvedAt: timestamp('resolved_at')
  },
  (table) => ({
    alarmableIdx: index('idx_alarmable').on(table.alarmableType, table.alarmableId),
    statusIdx: index('idx_status').on(table.status),
    severityIdx: index('idx_severity').on(table.severity)
  })
);

export type InsertNgdu = typeof ngdu.$inferInsert;
export type SelectNgdu = typeof ngdu.$inferSelect;

export type InsertCdng = typeof cdng.$inferInsert;
export type SelectCdng = typeof cdng.$inferSelect;

export type InsertKust = typeof kust.$inferInsert;
export type SelectKust = typeof kust.$inferSelect;

export type InsertWell = typeof well.$inferInsert;
export type SelectWell = typeof well.$inferSelect;

export type InsertMest = typeof mest.$inferInsert;
export type SelectMest = typeof mest.$inferSelect;

export type InsertObj = typeof obj.$inferInsert;
export type SelectObj = typeof obj.$inferSelect;

export type InsertPlast = typeof plast.$inferInsert;
export type SelectPlast = typeof plast.$inferSelect;

export type InsertAlarm = typeof alarm.$inferInsert;
export type SelectAlarm = typeof alarm.$inferSelect;

export type AlarmSeverity = (typeof alarmSeverityEnum.enumValues)[number];
export type AlarmStatus = (typeof alarmStatusEnum.enumValues)[number];
