import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";

export const messagesTable = sqliteTable(
  "messages",
  {
    id: text(),

    text: text().notNull(),
    timestamp: int().default(Date.now()),
    isbot: int({ mode: "boolean" }).notNull(),

    // relations
    userId: text("user_id").references(() => usersTable.id),
  },
  (table) => [primaryKey({ columns: [table.id, table.userId] })],
);

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [messagesTable.userId],
    references: [usersTable.id],
  }),
}));
