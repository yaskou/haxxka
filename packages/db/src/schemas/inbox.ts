import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./user.js";

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
