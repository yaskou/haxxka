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

  const db = createClient(
    process.env.TURSO_DATABASE_URL!,
    process.env.TURSO_AUTH_URL,
  );

  while (true) {
    const users = await readUnreplyUserIds(db);

    for (const user of users) {
      const reply = await createReply(db, user.id);
      await sendDM(user.id, reply);

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
