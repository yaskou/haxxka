import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { messagesTable } from "../schemas/message";
import { MessageCreate } from "./types";

export const createMessage = async (messages: MessageCreate[]) => {
  await db.insert(messagesTable).values(messages);
};

export const readMessages = async (userId: string, limit = 1) => {
  return await db.query.messagesTable.findMany({
    limit,
    orderBy: [desc(messagesTable.timestamp)],
    where: eq(messagesTable.userId, userId),
  });
};

export const deleteMessage = async (userId: string) => {
  await db.delete(messagesTable).where(eq(messagesTable.id, userId));
};
