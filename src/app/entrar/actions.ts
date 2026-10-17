"use server";

import { redirect } from "next/navigation";
import { db } from "@/infra/db/client";
import { hashPassword, verifyPassword } from "@/auth/password";
import { createSession } from "@/auth/session";
import { loginSchema } from "@/validation/auth";

export type LoginState = { error?: string };

// Hash real calculado uma vez, usado para gastar o mesmo tempo quando o e-mail não existe.
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= hashPassword("senha-para-igualar-tempo"));

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  const ok = await verifyPassword(user?.passwordHash ?? (await getDummyHash()), parsed.data.password);
  if (!user || !ok || user.anonymizedAt) return { error: "E-mail ou senha incorretos." };

  await createSession(user.id);
  redirect(user.role === "ADMIN" ? "/admin" : "/conta");
}
