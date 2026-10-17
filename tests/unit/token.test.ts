import { describe, expect, it } from "vitest";
import { hashToken, newToken } from "@/auth/token";
import { hashPassword, verifyPassword } from "@/auth/password";

describe("token", () => {
  it("gera tokens distintos e o hash confere", () => {
    const a = newToken();
    const b = newToken();
    expect(a.token).not.toBe(b.token);
    expect(hashToken(a.token)).toBe(a.tokenHash);
    expect(a.tokenHash).not.toBe(a.token);
  });
});

describe("password", () => {
  it("verifica senha correta e rejeita incorreta", async () => {
    const h = await hashPassword("uma-senha-bem-longa");
    expect(await verifyPassword(h, "uma-senha-bem-longa")).toBe(true);
    expect(await verifyPassword(h, "outra-senha-qualquer")).toBe(false);
  });
});
