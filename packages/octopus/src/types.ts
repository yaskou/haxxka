export type Part = {
  text: string;
};

export type History = {
  role: "model" | "user";
  parts: Part[];
};
