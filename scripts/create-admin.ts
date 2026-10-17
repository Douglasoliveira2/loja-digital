import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/auth/password";
import { passwordSchema } from "../src/validation/auth";
import { z } from "zod";

/**
 * Cria o primeiro administrador. A senha vem de ADMIN_PASSWORD ou é pedida no terminal.
 * Nunca fica gravada em arquivo. Uso: ADMIN_EMAIL=... ADMIN_NAME=... npm run admin:create
 */
async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida.");
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const email = z.string().email().parse(process.env.ADMIN_EMAIL ?? (await rl.question("E-mail: ")));
  const name = process.env.ADMIN_NAME ?? (await rl.question("Nome: "));
  const password = passwordSchema.parse(process.env.ADMIN_PASSWORD ?? (await rl.question("Senha (aparece na tela): ")));
  rl.close();

  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) throw new Error("Já existe um usuário com esse e-mail.");

  const user = await db.user.create({
    data: { email: email.toLowerCase(), name, role: "ADMIN", passwordHash: await hashPassword(password) },
  });
  await db.auditLog.create({ data: { actorUserId: null, action: "admin.created", entity: "User", entityId: user.id } });
  console.log(`Administrador criado: ${user.email}`);
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
