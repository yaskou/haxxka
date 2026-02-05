import {
  deleteInbox,
  deleteMessage,
  readUser,
  createUser,
  createMessage,
  createInbox,
  type Client,
} from "db";
import type { Messaging, Payload } from "./types";

type Env = {
  MY_IG_ID: string;
};

export const handleMessagings = async (
  db: Client,
  payload: Payload,
  env: Env,
) => {
  for (const messaging of payload.entry[0].messaging) {
    await handleMessaging(db, messaging, env);
  }
};

export const handleMessaging = async (
  db: Client,
  messaging: Messaging,
  env: Env,
) => {
  if (messaging.message.is_deleted) {
    await deleteMessage(db, messaging.message.mid);
    await deleteInbox(db, messaging.message.mid);
    return;
  }

  if (!messaging.message.text) return;

  const isbot = messaging.sender.id == env.MY_IG_ID;
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
    return;
  }

  await createInbox(db, {
    id: messaging.message.mid,
    text: messaging.message.text,
    timestamp: messaging.timestamp,
    userId,
  });
};
