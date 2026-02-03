import "dotenv/config";
import { wait } from "./utils";
import { Haxxka } from "./ai";
import { sendDM } from "./send";
import {
  createClient,
  createMessage,
  deleteInboxes,
  readMessagesByUnreplyUser,
} from "db";

const main = async () => {
  const sleep_time_ms = 30 * 1000; // 30s

  const haxxka = new Haxxka(process.env.OPENROUTER_API_KEY!);

  if (!process.env.TURSO_DATABASE_URL) {
    console.log("Missing TURSO_DATABASE_URL in env.");
    return;
  }

  if (!process.env.OPENROUTER_MODEL) {
    console.log("Missing OPENROUTER_MODEL in env.");
    return;
  }

  if (!process.env.IG_TOKEN) {
    console.log("Missing IG_TOKEN in env.");
    return;
  }

  while (true) {
    const db = createClient(
      process.env.TURSO_DATABASE_URL,
      process.env.TURSO_AUTH_TOKEN,
    );

    const messagesList = await readMessagesByUnreplyUser(db);

    for (const messages of messagesList) {
      const inputs = haxxka.makeInputs(messages);
      const reply = await haxxka.createReply(
        inputs,
        process.env.OPENROUTER_MODEL,
      );

      if (!reply) {
        // 返信が生成できなかったら抜ける
        break;
      }

      await sendDM(process.env.IG_TOKEN, messages.id, reply);

      const inboxes = messages.inboxes.map((inbox) => ({
        isbot: false,
        ...inbox,
      }));
      await createMessage(db, inboxes);

      const mids = messages.inboxes.map((inbox) => inbox.id);
      await deleteInboxes(db, mids);
    }

    await wait(sleep_time_ms);
  }
};

main();
