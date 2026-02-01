import { OpenRouter } from "@openrouter/sdk";
import { Client, readInboxesByUserId, readMessages } from "db";
import type { Message } from "@openrouter/sdk/models";

const createHistory = async (db: Client, userId: string, r = 10) => {
  const messages = await readMessages(db, userId, r);
  const history = messages.reduce<Message[]>((prev, current) => {
    const role = current.isbot ? "assistant" : "user";
    const lastIndex = prev.length - 1;
    if (lastIndex >= 0 && prev[lastIndex].role === role) {
      prev[lastIndex].content += "\n" + current.text;
    } else {
      prev.push({
        role,
        content: current.text,
      });
    }
    return prev;
  }, []);

  return history;
};

const createText = async (db: Client, userId: string) => {
  const inboxes = await readInboxesByUserId(db, userId);

  const text = inboxes.reduce((prev, current) => {
    return (prev ? "\n" : "") + current.text;
  }, "");

  return text;
};

export const createReply = async (
  db: Client,
  apiKey: string,
  model: string,
  userId: string,
) => {
  const history = await createHistory(db, userId);
  const text = await createText(db, userId);

  const openRouter = new OpenRouter({
    apiKey,
  });

  const stream = await openRouter.chat.send({
    model,
    messages: [
      {
        role: "system",
        content:
          "あなたは、はるかという名前の女子高生です。句読点と敬語を使わずとても短い文で答えて。",
      },
      ...history,
      { role: "user", content: text },
    ],
    reasoning: {
      effort: "high",
    },
    stream: true,
  });

  console.log(`\n${userId}: ${text}`);

  let reply = "";
  for await (const chunk of stream) {
    const reasoning = chunk.choices?.[0]?.delta?.reasoning;
    const content = chunk.choices?.[0]?.delta.content;

    if (reasoning) {
      process.stdout.write(reasoning);
    }
    if (content) {
      reply += content;
      process.stdout.write(content);
    }
  }

  return reply;
};
