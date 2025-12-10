import { Hono } from "hono";

const oauth = new Hono();

const getAccessToken = async (code: string) => {
  const formData = new FormData();
  formData.append("client_id", process.env.APP_ID);
  formData.append("client_secret", process.env.APP_SECRET);
  formData.append("grant_type", "authorization_code");
  formData.append("redirect_uri", process.env.ORIGIN_URL + "/oauth/redirect");
  formData.append("code", code);

  const endpoint = "https://api.instagram.com/oauth/access_token";
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });
  const json = await response.json();
  const access_token = json["access_token"] as string;

  return access_token;
};

const exchangeAccessToken = async (access_token: string) => {
  const endpoint = "https://graph.instagram.com/access_token";
  const url = new URL(endpoint);
  url.searchParams.append("grant_type", "ig_exchange_token");
  url.searchParams.append("client_secret", process.env.APP_SECRET);
  url.searchParams.append("access_token", access_token);
  const response = await fetch(url);
  const json = await response.json();
  const exchanged_access_token = json["access_token"] as string;
  return exchanged_access_token;
};

oauth.get("/redirect", async (c) => {
  const code = c.req.query("code")!;
  getAccessToken(code).then(exchangeAccessToken).then(console.log);
  return c.text("ok");
});

export { oauth };
