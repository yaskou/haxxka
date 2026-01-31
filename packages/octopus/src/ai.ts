import { GoogleGenAI } from "@google/genai";
import { Client, readInboxesByUserId, readMessages } from "db";
import { History } from "./types";

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // No Credits, No Stress

const createHistory = async (db: Client, userId: string, r = 10) => {
  const messages = await readMessages(db, userId, r);
  const history = messages.reduce<History[]>((prev, current) => {
    const role = current.isbot ? "model" : "user";
    const lastIndex = prev.length - 1;
    if (lastIndex >= 0 && prev[lastIndex].role === role) {
      prev[lastIndex].parts[0].text += "\n" + current.text;
    } else {
      prev.push({
        role,
        parts: [{ text: current.text }],
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

export const createReply = async (db: Client, userId: string) => {
  const history = await createHistory(db, userId);
  const text = await createText(db, userId);

  const chat = gemini.chats.create({
    model: "gemini-2.5-flash-lite",
    history,
  });

  const response = await chat.sendMessage({
    message: text,
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
      systemInstruction:
        "あなたの名前ははるか 女子高生のように短文で句読点なしで回答",
    },
  });

  return response.text;
};
