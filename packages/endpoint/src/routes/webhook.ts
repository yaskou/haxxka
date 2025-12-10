import { Hono } from "hono";
import { Messaging, Payload } from "../types";
import {
  createInbox,
  createMessage,
  createUser,
  deleteInbox,
  deleteMessage,
  readUser,
} from "db";

const createFn = async (messaging: Messaging) => {
  const isbot = messaging.sender.id == process.env.MY_IG_ID;
  const userId = isbot ? messaging.recipient.id : messaging.sender.id;

  const user = await readUser(userId);
  if (!user) {
    await createUser({
      id: userId,
    });
  }

  if (isbot) {
    await createMessage([
      {
        id: messaging.message.mid,
        text: messaging.message.text,
        timestamp: messaging.timestamp,
        userId,
        isbot,
      },
    ]);
    return;
  }

  await createInbox({
    id: messaging.message.mid,
    text: messaging.message.text,
    timestamp: messaging.timestamp,
    userId,
  });
};

const deleteFn = async (messaging: Messaging) => {
  await deleteMessage(messaging.message.mid);
  await deleteInbox(messaging.message.mid);
};

const webhook = new Hono();

webhook.post("/", async (c) => {
  const payload = await c.req.json<Payload>().catch();

  for (const messaging of payload.entry[0].messaging) {
    if (messaging.message.is_deleted) {
      deleteFn(messaging);
    } else {
      createFn(messaging);
    }
  }

  return c.text("ok");
});

export { webhook };
