import { randomBytes, createHmac } from "node:crypto";

export const hashPassword = (password, salt = undefined) => {
  const saltToUse = salt ?? randomBytes(256).toString("hex");
  const hashedPassword = createHmac("sha256", saltToUse)
    .update(password)
    .digest("hex");
  return { salt: saltToUse, hashedPassword };
};
