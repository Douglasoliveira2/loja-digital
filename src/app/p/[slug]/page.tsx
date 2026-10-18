import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cover } from "@/components/Cover";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { ShareButtons } from "@/components/ShareButtons";
import { categoryName, findProduct, PRODUCTS } from "@/data/catalog";
import { formatCents } from "@/lib/money";
import { buyPath } from "@/lib/links";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) return { title: "E-book não encontrado" };
  return { title: product.title, description: product.summary };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  const related = PRODUCTS.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 4);
  const others = related.length > 0 ? related : PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <>
      <section className="sec pd">
        <div className="in pd-grid">
          <div className="pd-stage">
            <div className="pd-cover">
              <Cover product={product} variant="big" />
            </div>
          </div>
          <div className="pd-info">
            <nav className="crumbs" aria-label="Você está em">
              <Link href="/catalogo">E-books</Link>
              <span aria-hidden="true">/</span>
              <Link href={`/catalogo?categoria=${product.category}`}>{categoryName(product.category)}</Link>
            </nav>
            <h1>{product.title}</h1>
            <p className="pd-sum">{product.summary}</p>
            <ul className="fl">
              {product.highlights.map((h) => (
                <li key={h}>
                  <Icon name="check" size={18} />
                  {h}
                </li>
              ))}
            </ul>
            <div className="pd-buy">
              <span className="price big">{formatCents(product.priceCents)}</span>
              <span className="pix">À vista no Pix</span>
              <Link className="btn" href={buyPath(product.slug)}>
                Comprar agora <Icon name="arrow" size={18} />
              </Link>
            </div>
            <ShareButtons slug={product.slug} title={product.title} />
          </div>
        </div>
      </section>

      <section className="sec shelf">
        <div className="in">
          <div className="sh">
            <div>
              <span className="eyebrow">Continue folheando</span>
              <h2>Outros e-books</h2>
            </div>
          </div>
          <div className="prods">
            {others.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
