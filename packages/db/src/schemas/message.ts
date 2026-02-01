import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";

export const messagesTable = sqliteTable(
  "messages",
  {
    id: text().primaryKey(),

    text: text().notNull(),
    timestamp: int().default(Date.now()),
    isbot: int({ mode: "boolean" }).notNull(),

    // relations
    userId: text("user_id").references(() => usersTable.id),
  },
  (table) => [index("messages_user_id_idx").on(table.userId)],
);

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [messagesTable.userId],
    references: [usersTable.id],
  }),
}));
