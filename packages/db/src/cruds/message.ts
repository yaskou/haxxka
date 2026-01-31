import { desc, eq } from "drizzle-orm";
import { messagesTable } from "../schemas/message";
import { MessageCreate } from "./types";
import type { Client } from "../db";

export const createMessage = async (db: Client, messages: MessageCreate) => {
  await db.insert(messagesTable).values(messages);
};

export const readMessages = async (db: Client, userId: string, limit = 1) => {
  return await db.query.messagesTable.findMany({
    limit,
    orderBy: [desc(messagesTable.timestamp)],
    where: eq(messagesTable.userId, userId),
  });
};

export const deleteMessage = async (db: Client, userId: string) => {
  await db.delete(messagesTable).where(eq(messagesTable.id, userId));
};
