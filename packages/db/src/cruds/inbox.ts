import { desc, eq, inArray } from "drizzle-orm";
import { inboxesTable } from "../schemas";
import { InboxCreate } from "./types";
import { Client } from "../db";

export const createInbox = async (db: Client, inbox: InboxCreate) => {
  await db.insert(inboxesTable).values(inbox);
};

export const readInboxesByUserId = async (db: Client, userId: string) => {
  return await db.query.inboxesTable.findMany({
    orderBy: [desc(inboxesTable.timestamp)],
    where: eq(inboxesTable.userId, userId),
  });
};

export const readUnreplyUserIds = async (db: Client) => {
  return await db
    .selectDistinct({
      id: inboxesTable.userId,
    })
    .from(inboxesTable);
};

export const deleteInbox = async (db: Client, id: string) => {
  await db.delete(inboxesTable).where(eq(inboxesTable.id, id));
};

export const deleteInboxes = async (db: Client, ids: string[]) => {
  await db.delete(inboxesTable).where(inArray(inboxesTable.id, ids));
};

export const deleteInboxesByUserId = async (db: Client, userId: string) => {
  await db.delete(inboxesTable).where(eq(inboxesTable.userId, userId));
};
