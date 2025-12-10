import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { privacy } from "./routes/privacy.ts";
import { webhook } from "./routes/webhook.ts";
import { index } from "./routes/index.ts";
import { oauth } from "./routes/oauth.ts";

const app = new Hono();
app.route("/", index);
app.route("/oauth", oauth);
app.route("/privacy", privacy);
app.route("/webhook", webhook);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
