import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, categoryName, filterProducts, isCategorySlug } from "@/data/catalog";

export const metadata = { title: "E-books" };

type Props = { searchParams: Promise<{ categoria?: string; q?: string }> };

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = isCategorySlug(params.categoria) ? params.categoria : undefined;
  const query = params.q?.slice(0, 80);
  const products = filterProducts({ category, query });

  const heading = category ? categoryName(category) : "Todos os e-books";

  return (
    <section className="sec">
      <div className="in">
        <div className="sh">
          <div>
            <span className="eyebrow">Catálogo</span>
            <h1 className="page-title">{heading}</h1>
            {query ? <p>Resultados para &quot;{query}&quot;</p> : null}
          </div>
        </div>

        <nav className="filters" aria-label="Filtrar por assunto">
          <Link className={`chip ${category ? "" : "on"}`} href="/catalogo" aria-current={category ? undefined : "page"}>
            Todos
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              className={`chip ${category === c.slug ? "on" : ""}`}
              href={`/catalogo?categoria=${c.slug}`}
              aria-current={category === c.slug ? "page" : undefined}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        {products.length > 0 ? (
          <div className="prods">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-page">
            <h2>Nenhum e-book encontrado</h2>
            <p>Tente outro termo ou volte para a lista completa.</p>
            <Link className="btn" href="/catalogo">
              Ver todos
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
