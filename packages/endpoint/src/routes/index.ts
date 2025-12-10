import { Hono } from "hono";

const index = new Hono();

index.get("/", (c) => {
  return c.text("Hello Hono!");
});

export { index };
