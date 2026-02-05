import { createClient } from "db";
import { createHono } from "../../createHono";
import { verifySignature } from "./verify";
import { handleMessagings } from "./handleMessaging";
import type { Payload } from "./types";

const webhook = createHono();

webhook.get("/", async (c) => {
  const challenge = c.req.query("hub.challenge");
  if (!challenge) {
    return c.text("Missing verify token!", 403);
  }

  const verifyToken = c.req.query("hub.verify_token");
  if (verifyToken !== c.env.IG_VERIFY_TOKEN) {
    return c.text("Invalid verify token!", 403);
  }

  return c.text(challenge);
});

webhook.post("/", async (c) => {
  const signature = c.req.header("X-Hub-Signature-256");
  if (!signature) {
    return c.text("Missing signature!", 403);
  }

  const rawBody = await c.req.text();
  const isValid = verifySignature(signature, rawBody, c.env.IG_APP_SECRET);
  if (!isValid) {
    return c.text("Invalid signature!", 403);
  }

  const db = createClient(c.env.TURSO_DATABASE_URL, c.env.TURSO_AUTH_TOKEN);
  const payload = await c.req.json<Payload>();
  await handleMessagings(db, payload, c.env);

  return c.text("ok");
});

export { webhook };
