import { OpenRouter } from "@openrouter/sdk";
import { EventStream } from "@openrouter/sdk/lib/event-streams.js";
import type {
  ChatStreamingResponseChunkData,
  Message,
} from "@openrouter/sdk/models";
import type { readMessagesByUnreplyUser } from "db";

type MessagesByUnreplyUser = Awaited<
  ReturnType<typeof readMessagesByUnreplyUser>
>[number];

export class Haxxka {
  private openRouter: OpenRouter;

  constructor(apiKey: string) {
    this.openRouter = new OpenRouter({
      apiKey,
    });
  }

  async createReply(inputs: Message[], model: string) {
    let stream: EventStream<ChatStreamingResponseChunkData>;
    try {
      stream = await this.openRouter.chat.send({
        model,
        messages: [
          {
            role: "system",
            content:
              "あなたは、はるかという名前の女子高生です。敬語を使わずとても短い文で答えて。",
          },
          ...inputs,
        ],
        reasoning: {
          effort: "high",
        },
        stream: true,
      });
    } catch {
      console.log("ERROR: NO REPLY is available!");
      return null;
    }

    console.log("\nThinking:");

    let reply = "";
    for await (const chunk of stream) {
      const reasoning = chunk.choices?.[0]?.delta?.reasoning;
      const content = chunk.choices?.[0]?.delta.content;

      if (reasoning) {
        process.stdout.write(reasoning);
      }
      if (content) {
        reply += content;
      }
    }

    console.log("Answer:", reply);

    return reply;
  }

  makeInputs(messages: MessagesByUnreplyUser) {
    messages.messages.reverse(); // messagesはtimestampで降順

    const mergedMessages = [
      ...messages.messages,
      ...messages.inboxes.map((inbox) => ({
        isbot: false,
        ...inbox,
      })),
    ];

    const inputs = mergedMessages.reduce<Message[]>((prev, current) => {
      const role = current.isbot ? "assistant" : "user";

      const last = prev.at(-1);
      if (last?.role === role) {
        last.content += "\n" + current.text;
        return prev;
      }

      prev.push({
        role,
        content: current.text,
      });

      return prev;
    }, []);

    return inputs;
  }
}
