import { requireUser } from "@/auth/guards";

export const dynamic = "force-dynamic";

export default async function Conta() {
  const user = await requireUser();
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Minha conta</h1>
      <p className="mt-2">Olá, {user.name}.</p>
    </main>
  );
}
