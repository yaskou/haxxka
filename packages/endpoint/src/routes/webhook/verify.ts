import { createHmac, timingSafeEqual } from "crypto";

export const verifySignature = (
  signature: string,
  rawBody: string,
  secret: string,
) => {
  const hash = createHmac("sha256", secret).update(rawBody).digest("hex");
  const expected = "sha256=" + hash;

  // タイミング攻撃対策
  const isValid =
    signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  return isValid;
};
