import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { inboxesTable } from "../schemas";
import { InboxCreate } from "./types";

export const createInbox = async (inbox: InboxCreate) => {
  await db.insert(inboxesTable).values(inbox);
};

export const readInboxesByUserId = async (userId: string) => {
  return await db.query.inboxesTable.findMany({
    orderBy: [desc(inboxesTable.timestamp)],
    where: eq(inboxesTable.userId, userId),
  });
};

export const readUnreplyUserIds = async () => {
  return await db
    .selectDistinct({
      id: inboxesTable.userId,
    })
    .from(inboxesTable);
};

export const deleteInbox = async (id: string) => {
  await db.delete(inboxesTable).where(eq(inboxesTable.id, id));
};

export const deleteInboxesByUserId = async (userId: string) => {
  await db.delete(inboxesTable).where(eq(inboxesTable.userId, userId));
};
