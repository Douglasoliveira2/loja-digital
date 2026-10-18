import Link from "next/link";
import { Cover } from "@/components/Cover";
import { Icon } from "@/components/Icon";
import { findProduct, FEATURED_SLUG } from "@/data/catalog";
import { formatCents } from "@/lib/money";

export function Hero() {
  const product = findProduct(FEATURED_SLUG);
  if (!product) return null;
  return (
    <section className="hero">
      <div className="in">
        <div className="ht">
          <span className="eyebrow rise">Edição de outubro</span>
          <h1 className="rise d1">
            O prazer de um bom livro, <em>em PDF</em>.
          </h1>
          <p className="rise d2">
            Uma pequena editora digital de livros de atividades, rotinas e receitas para a família.
          </p>
          <div className="hb rise d3">
            <Link className="btn" href="/catalogo">
              Ler a vitrine <Icon name="arrow" size={18} />
            </Link>
            <Link className="lnk" href={`/p/${product.slug}`}>
              Conhecer o livro da edição
            </Link>
          </div>
          <dl className="meta rise d3">
            <div>
              <dt>Formato</dt>
              <dd>PDF em A4</dd>
            </div>
            <div>
              <dt>Entrega</dt>
              <dd>Na hora</dd>
            </div>
            <div>
              <dt>Compra</dt>
              <dd>Única</dd>
            </div>
          </dl>
        </div>
        <div className="hv">
          <span className="block" aria-hidden="true" />
          <div className="cv">
            <Cover product={product} variant="big" />
          </div>
          <span className="stamp">
            Lançamento
            <br />
            <b>{formatCents(product.priceCents)}</b>
          </span>
        </div>
      </div>
    </section>
  );
}
