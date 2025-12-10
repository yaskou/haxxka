import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { messagesTable } from "./message";
import { inboxesTable } from "./inbox";

export const usersTable = sqliteTable("users", {
  id: text().primaryKey(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  inboxes: many(inboxesTable),
  messages: many(messagesTable),
}));
