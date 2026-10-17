import { describe, expect, it } from "vitest";
import { parseEnv } from "@/config/env";

const base = { APP_URL: "https://loja.example", DATABASE_URL: "postgresql://u:p@h/db" };

describe("parseEnv", () => {
  it("aceita provedor simulado em desenvolvimento", () => {
    expect(parseEnv({ ...base, NODE_ENV: "development", PAYMENT_PROVIDER: "simulado" }).PAYMENT_PROVIDER).toBe("simulado");
  });

  it("recusa provedor simulado em produção", () => {
    expect(() => parseEnv({ ...base, NODE_ENV: "production", PAYMENT_PROVIDER: "simulado" })).toThrow(/simulado/);
  });

  it("recusa Pagar.me sem credenciais em produção", () => {
    expect(() => parseEnv({ ...base, NODE_ENV: "production", PAYMENT_PROVIDER: "pagarme" })).toThrow(/Pagar\.me/);
  });

  it("aceita Pagar.me com credenciais em produção", () => {
    const env = parseEnv({
      ...base,
      NODE_ENV: "production",
      PAYMENT_PROVIDER: "pagarme",
      PAGARME_SECRET_KEY: "x",
      PAGARME_WEBHOOK_SECRET: "y",
    });
    expect(env.PAYMENT_PROVIDER).toBe("pagarme");
  });

  it("recusa APP_URL sem https em produção", () => {
    expect(() =>
      parseEnv({ ...base, APP_URL: "http://loja.example", NODE_ENV: "production", PAYMENT_PROVIDER: "pagarme", PAGARME_SECRET_KEY: "x", PAGARME_WEBHOOK_SECRET: "y" }),
    ).toThrow(/https/);
  });
});
