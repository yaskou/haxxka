import { Hono } from "hono";

export type Bindings = {
  IG_APP_ID: string;
  IG_APP_SECRET: string;
  IG_VERIFY_TOKEN: string;
  MY_IG_ID: string;
  TURSO_AUTH_TOKEN?: string;
  TURSO_DATABASE_URL: string;
};

export const createHono = () => {
  const app = new Hono<{ Bindings: Bindings }>();
  return app;
};
