import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  PAYMENT_PROVIDER: z.enum(["simulado", "pagarme"]).default("simulado"),
  PAGARME_SECRET_KEY: z.string().optional(),
  PAGARME_WEBHOOK_SECRET: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
});

export type Env = z.infer<typeof schema>;

/**
 * Valida o ambiente. Em produção, recusa configurações perigosas:
 * provedor de pagamento simulado e credenciais do Pagar.me ausentes.
 */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const env = schema.parse(source);

  if (env.NODE_ENV === "production") {
    if (env.PAYMENT_PROVIDER === "simulado") {
      throw new Error("PAYMENT_PROVIDER=simulado não é permitido em produção.");
    }
    if (env.PAYMENT_PROVIDER === "pagarme") {
      if (!env.PAGARME_SECRET_KEY || !env.PAGARME_WEBHOOK_SECRET) {
        throw new Error("Credenciais do Pagar.me ausentes em produção.");
      }
    }
    if (!env.APP_URL.startsWith("https://")) {
      throw new Error("APP_URL deve usar https em produção.");
    }
  }
  return env;
}

let cached: Env | undefined;
export function getEnv(): Env {
  cached ??= parseEnv(process.env);
  return cached;
}
