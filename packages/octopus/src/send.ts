export const sendDM = async (
  igToken: string,
  userId: string,
  reply: string,
) => {
  const endpoint = "https://graph.instagram.com/v24.0/me/messages";
  const body = {
    recipient: {
      id: userId,
    },
    message: {
      text: reply,
    },
  };
  const init = {
    headers: {
      Authorization: "Bearer " + igToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    method: "POST",
  } satisfies RequestInit;
  await fetch(endpoint, init);
};
