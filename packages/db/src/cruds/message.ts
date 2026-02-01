import { eq } from "drizzle-orm";
import { messagesTable } from "../schemas/message";
import type { Client } from "../db";

export type MessageCreate =
  | typeof messagesTable.$inferInsert
  | (typeof messagesTable.$inferInsert)[];

export const createMessage = async (db: Client, messages: MessageCreate) => {
  await db
    .insert(messagesTable)
    .values(Array.isArray(messages) ? messages : [messages]);
};

export const deleteMessage = async (db: Client, id: string) => {
  await db.delete(messagesTable).where(eq(messagesTable.id, id));
};
