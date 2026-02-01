import { eq, inArray } from "drizzle-orm";
import { inboxesTable } from "../schemas";
import { InboxCreate } from "./types";
import { Client } from "../db";

export const createInbox = async (db: Client, inbox: InboxCreate) => {
  await db.insert(inboxesTable).values(inbox);
};

export const deleteInbox = async (db: Client, id: string) => {
  await db.delete(inboxesTable).where(eq(inboxesTable.id, id));
};

export const deleteInboxes = async (db: Client, ids: string[]) => {
  await db.delete(inboxesTable).where(inArray(inboxesTable.id, ids));
};
