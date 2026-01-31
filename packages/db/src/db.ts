import { drizzle } from "drizzle-orm/libsql/web";
import { createClient as createLibsqlClient } from "@libsql/client/web";
import * as schema from "./schemas";

export type Client = ReturnType<typeof createClient>;

export const createClient = (url: string, authToken?: string) => {
  const client = createLibsqlClient({
    authToken,
    url,
  });

  const db = drizzle(client, { schema });

  return db;
};
