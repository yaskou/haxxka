import { OpenRouter } from "@openrouter/sdk";
import { EventStream } from "@openrouter/sdk/lib/event-streams.js";
import { readMessagesByUnreplyUser } from "db";
import type {
  ChatStreamingResponseChunkData,
  Message,
} from "@openrouter/sdk/models";

type MessagesByUnreplyUser = Awaited<
  ReturnType<typeof readMessagesByUnreplyUser>
>[0];

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
    const inputs = messages.messages.reduce<Message[]>((prev, current) => {
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

    inputs.push({
      role: "user",
      content: messages.inboxes.reduce(
        (prev, current) => prev + (prev ? "\n" : "") + current.text,
        "",
      ),
    });

    return inputs;
  }
}
