import { createHono } from "./createHono";
import { index } from "./routes/index";
import { privacy } from "./routes/privacy";
import { webhook } from "./routes/webhook";

const app = createHono();
app.route("/", index);
app.route("/privacy", privacy);
app.route("/webhook", webhook);

export default app;
