const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Converte centavos inteiros em texto no padrão brasileiro. */
export function formatCents(cents: number): string {
  if (!Number.isInteger(cents)) throw new Error("Valor monetário deve ser inteiro em centavos.");
  return brl.format(cents / 100);
}
