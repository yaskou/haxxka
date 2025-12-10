import { Hono } from "hono";
import { html } from "hono/html";

const privacy = new Hono();

privacy.get("/", (c) => {
  return c.html(html`
    <h1>プライバシーポリシー</h1>
    <ol>
      <h2>
        <li>運営者</li>
      </h2>
      <p><a href="https://github.com/yaskou">yaskou(github)</a></p>
      <h2>
        <li>取得する情報</li>
      </h2>
      <p>自分のInstagramアカウントに対するメッセージ</p>
      <h2>
        <li>利用目的</li>
      </h2>
      <p>自動応答機能の実装及びテストのため</p>
      <h2>
        <li>生成AI使用について</li>
      </h2>
      <p>応答用にGoogle Gemini 2.5 Flash Liteを使用しています</p>
      <h2>
        <li>ポリシーの改定について</li>
      </h2>
      <p>本ポリシーを改定する場合があります</p>
    </ol>
  `);
});

export { privacy };
