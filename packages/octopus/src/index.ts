import { wait } from "./utils";
import { createReply } from "./ai";
import { sendDM } from "./send";
import {
  createMessage,
  deleteInboxesByUserId,
  readInboxesByUserId,
  readUnreplyUserIds,
} from "db";

const main = async () => {
  const sleep_time_ms = 30 * 1000; // 30s

  while (true) {
    const users = await readUnreplyUserIds();

    for (const user of users) {
      const reply = await createReply(user.id);
      await sendDM(user.id, reply);

      const inboxes = await readInboxesByUserId(user.id);
      await createMessage(inboxes.map((inbox) => ({ ...inbox, isbot: false })));
      await deleteInboxesByUserId(user.id);
    }

    await wait(sleep_time_ms);
  }
};

main();
