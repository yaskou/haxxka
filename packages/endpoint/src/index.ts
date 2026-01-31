import { createHono } from "./createHono.ts";
import { index } from "./routes/index.ts";
import { privacy } from "./routes/privacy.ts";
import { webhook } from "./routes/webhook.ts";

const app = createHono();
app.route("/", index);
app.route("/privacy", privacy);
app.route("/webhook", webhook);

export default app;
