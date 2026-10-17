import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
});

export const passwordSchema = z
  .string()
  .min(10, "A senha precisa ter ao menos 10 caracteres.")
  .max(200, "Senha longa demais.");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(120),
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  password: passwordSchema,
});
