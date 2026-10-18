import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Meu Ebook Digital", template: "%s | Meu Ebook Digital" },
  description: "Livros de pintura e materiais digitais para imprimir.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
