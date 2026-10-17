import { createHash, randomBytes } from "node:crypto";

/** Token aleatório de 256 bits. O valor puro vai ao cliente, só o hash vai ao banco. */
export function newToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
