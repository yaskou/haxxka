import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";

export const inboxesTable = sqliteTable(
  "inboxes",
  {
    id: text().primaryKey(),

    text: text().notNull(),
    timestamp: int().default(Date.now()),

    // relations
    userId: text("user_id").references(() => usersTable.id),
  },
  (table) => [index("inboxes_user_id_idx").on(table.userId)],
);

export const inboxesRelations = relations(inboxesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [inboxesTable.userId],
    references: [usersTable.id],
  }),
}));
