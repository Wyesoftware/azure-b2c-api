import crypto from "crypto";
import base64url from "base64url";

export const generateChallangeCode = (codeVetifier: string) => {
  const base64Digest = crypto
    .createHash("sha256")
    .update(codeVetifier)
    .digest("base64");
  const code_challenge = base64url.fromBase64(base64Digest);
  return code_challenge;
};

export const scopeGen = (scopes: string[]) => {
  let result = "";
  for (let i = 0; i < scopes.length; i++) {
    if (i + 1 === scopes.length) {
      result = result + scopes[i];
    } else {
      result = result + scopes[i] + "%20";
    }
  }
  return result;
};
