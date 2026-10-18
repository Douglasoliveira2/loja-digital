/** Caminhos públicos de cada produto: página do livro e compra direta. */
export const productPath = (slug: string) => `/p/${slug}`;
export const buyPath = (slug: string) => `/comprar/${slug}`;

export function absoluteUrl(origin: string, path: string): string {
  return new URL(path, origin).toString();
}

export function whatsappUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
