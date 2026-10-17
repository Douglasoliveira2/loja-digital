import { requireAdmin } from "@/auth/guards";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const user = await requireAdmin();
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Painel administrativo</h1>
      <p className="mt-2">Logado como {user.email}.</p>
    </main>
  );
}
