import { verifySignature } from "./verify";

describe("Verify", () => {
  it("should be invalid", () => {
    const signature = "INVALID";
    const isValid = verifySignature("sha256=" + signature, "BODY", "SECRET");

    expect(isValid).toBe(false);
  });

  it("should be invalid because of no prefix, sha256=", () => {
    const signature =
      "66b8cd9d4814d2a7b6cf37d3231c1726ad945dbc0898ebf75e09201d0998d03a";
    const isValid = verifySignature(signature, "BODY", "SECRET");

    expect(isValid).toBe(false);
  });

  it("should be valid", () => {
    const signature =
      "66b8cd9d4814d2a7b6cf37d3231c1726ad945dbc0898ebf75e09201d0998d03a";
    const isValid = verifySignature("sha256=" + signature, "BODY", "SECRET");

    expect(isValid).toBe(true);
  });
});
