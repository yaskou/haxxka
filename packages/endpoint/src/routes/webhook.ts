import type { Payload } from "../types";
import {
  createClient,
  createInbox,
  createMessage,
  createUser,
  deleteInbox,
  deleteMessage,
  readUser,
} from "db";
import { createHono } from "../createHono";

const webhook = createHono();

webhook.get("/", async (c) => {
  const challenge = c.req.query("hub.challenge");

  const verifyToken = c.req.query("hub.verify_token");
  if (verifyToken !== c.env.IG_VERIFY_TOKEN) {
    c.text("NOT Match!");
  }

  return c.text(challenge);
});

webhook.post("/", async (c) => {
  const payload = await c.req.json<Payload>().catch();

  const db = createClient(c.env.TURSO_DATABASE_URL, c.env.TURSO_AUTH_TOKEN);

  for (const messaging of payload.entry[0].messaging) {
    if (messaging.message.is_deleted) {
      await deleteMessage(db, messaging.message.mid);
      await deleteInbox(db, messaging.message.mid);
      return c.text("Message deleted");
    }

    const isbot = messaging.sender.id == c.env.MY_IG_ID;
    const userId = isbot ? messaging.recipient.id : messaging.sender.id;

    const user = await readUser(db, userId);
    if (!user) {
      await createUser(db, {
        id: userId,
      });
    }

    if (isbot) {
      await createMessage(db, {
        id: messaging.message.mid,
        text: messaging.message.text,
        timestamp: messaging.timestamp,
        userId,
        isbot,
      });
    } else {
      await createInbox(db, {
        id: messaging.message.mid,
        text: messaging.message.text,
        timestamp: messaging.timestamp,
        userId,
      });
    }
  }

  return c.text("ok");
});

export { webhook };
