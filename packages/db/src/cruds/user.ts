import { eq } from "drizzle-orm";
import { usersTable } from "../schemas";
import { UserCreate } from "./types";
import { Client } from "../db";

export const createUser = async (db: Client, init: UserCreate) => {
  await db.insert(usersTable).values(init);
};

export const readUser = async (db: Client, id: string) => {
  return await db.query.usersTable.findFirst({
    where: eq(usersTable.id, id),
  });
};
