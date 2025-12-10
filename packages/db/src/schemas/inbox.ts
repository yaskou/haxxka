import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";

export const inboxesTable = sqliteTable(
  "inboxes",
  {
    id: text(),

    text: text().notNull(),
    timestamp: int().default(Date.now()),

    // relations
    userId: text("user_id").references(() => usersTable.id),
  },
  (table) => [primaryKey({ columns: [table.id, table.userId] })],
);

export const inboxesRelations = relations(inboxesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [inboxesTable.userId],
    references: [usersTable.id],
  }),
}));
