import "dotenv/config";
import { wait } from "./utils";
import { createReply } from "./ai";
import { sendDM } from "./send";
import {
  createClient,
  createMessage,
  deleteInboxesByUserId,
  readInboxesByUserId,
  readUnreplyUserIds,
} from "db";

const main = async () => {
  const sleep_time_ms = 30 * 1000; // 30s

  while (true) {
    const db = createClient(
      process.env.TURSO_DATABASE_URL!,
      process.env.TURSO_AUTH_TOKEN,
    );

    const users = await readUnreplyUserIds(db);

    for (const user of users) {
      const reply = await createReply(
        db,
        process.env.OPENROUTER_API_KEY,
        process.env.OPENROUTER_MODEL,
        user.id,
      );

      if (!reply) {
        // 返信が生成できなかったら抜ける
        console.log("ERROR: NO REPLY is available!");
        break;
      }

      await sendDM(process.env.IG_TOKEN, user.id, reply);

      const inboxes = await readInboxesByUserId(db, user.id);
      await createMessage(
        db,
        inboxes.map((inbox) => ({ ...inbox, isbot: false })),
      );
      await deleteInboxesByUserId(db, user.id);
    }

    await wait(sleep_time_ms);
  }
};

main();
