import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../schemas";
import { UserCreate } from "./types";

export const createUser = async (init: UserCreate) => {
  await db.insert(usersTable).values(init);
};

export const readUser = async (id: string) => {
  return await db.query.usersTable.findFirst({
    where: eq(usersTable.id, id),
  });
};
