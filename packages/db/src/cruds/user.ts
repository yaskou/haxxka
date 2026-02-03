import { eq } from "drizzle-orm";
import { inboxesTable, usersTable } from "../schemas/index.js";
import type { Client } from "../db.js";

export type UserCreate = typeof usersTable.$inferInsert;

export const createUser = async (db: Client, init: UserCreate) => {
  await db.insert(usersTable).values(init);
};

export const readUser = async (db: Client, id: string) => {
  return await db.query.usersTable.findFirst({
    where: eq(usersTable.id, id),
  });
};

export const readMessagesByUnreplyUser = async (db: Client) => {
  const limit = 20;

  return await db.query.usersTable.findMany({
    where: (users, { eq, exists }) =>
      exists(
        db.select().from(inboxesTable).where(eq(inboxesTable.userId, users.id)),
      ),
    with: {
      inboxes: true,
      messages: {
        limit,
        orderBy: (messages, { desc }) => [desc(messages.timestamp)],
      },
    },
  });
};
