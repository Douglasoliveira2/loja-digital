"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-sm">E-mail</span>
        <input name="email" type="email" required autoComplete="email" className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm">Senha</span>
        <input name="password" type="password" required autoComplete="current-password" className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      {state.error ? <p role="alert" className="text-sm text-red-700">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="w-full rounded bg-[var(--destaque)] px-4 py-2 font-medium text-white disabled:opacity-60">
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
