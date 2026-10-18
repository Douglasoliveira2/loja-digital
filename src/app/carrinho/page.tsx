import Link from "next/link";

export const metadata = { title: "Carrinho" };

export default function CartPage() {
  return (
    <section className="sec">
      <div className="in empty-page">
        <h1>Seu carrinho está vazio</h1>
        <p>O carrinho e o pagamento chegam na próxima etapa do projeto. Por enquanto, explore os e-books.</p>
        <Link className="btn" href="/catalogo">
          Ver os e-books
        </Link>
      </div>
    </section>
  );
}
