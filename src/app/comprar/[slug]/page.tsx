import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cover } from "@/components/Cover";
import { findProduct, PRODUCTS } from "@/data/catalog";
import { productPath } from "@/lib/links";
import { formatCents } from "@/lib/money";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  return { title: product ? `Comprar ${product.title}` : "E-book não encontrado", robots: { index: false } };
}

/** Link de compra direta: abre já com o produto escolhido. O pagamento entra na Fase 5. */
export default async function BuyPage({ params }: Props) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  return (
    <section className="sec">
      <div className="in buy">
        <div className="buy-cover">
          <Cover product={product} variant="mini" />
        </div>
        <div className="buy-info">
          <span className="eyebrow">Compra direta</span>
          <h1>{product.title}</h1>
          <p className="pd-sum">{product.summary}</p>
          <dl className="buy-lines">
            <div>
              <dt>Produto digital em PDF</dt>
              <dd>{formatCents(product.priceCents)}</dd>
            </div>
            <div className="total">
              <dt>Total</dt>
              <dd>{formatCents(product.priceCents)}</dd>
            </div>
          </dl>
          <button type="button" className="btn" disabled>
            Pagamento em breve
          </button>
          <p className="pix">O pagamento por Pix e cartão será ativado na próxima etapa do projeto.</p>
          <Link className="lnk" href={productPath(product.slug)}>
            Ver detalhes do livro
          </Link>
        </div>
      </div>
    </section>
  );
}
