import type { inboxesTable, messagesTable, usersTable } from "../schemas";

// inbox table
export type InboxCreate = typeof inboxesTable.$inferInsert;

// message table
export type MessageCreate =
  | typeof messagesTable.$inferInsert
  | (typeof messagesTable.$inferInsert)[];

// user table
export type UserCreate = typeof usersTable.$inferInsert;
