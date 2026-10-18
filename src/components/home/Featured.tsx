import Link from "next/link";
import { Cover } from "@/components/Cover";
import { Icon } from "@/components/Icon";
import { categoryName, findProduct, FEATURED_SLUG, PRODUCTS } from "@/data/catalog";
import { formatCents } from "@/lib/money";

const SIDE_SLUGS = ["rotina-leve", "cardapio-da-semana"];

export function Featured() {
  const main = findProduct(FEATURED_SLUG);
  if (!main) return null;
  const side = PRODUCTS.filter((p) => SIDE_SLUGS.includes(p.slug));
  return (
    <section className="sec featwrap">
      <div className="in">
        <div className="sh">
          <div>
            <span className="eyebrow">Destaque</span>
            <h2>Livro da edição</h2>
          </div>
        </div>
        <div className="feat">
          <div className="fmain">
            <div className="fcov">
              <Cover product={main} variant="big" />
            </div>
            <div className="ftxt">
              <span className="tg">Destaque da semana</span>
              <h3>{main.title}</h3>
              <p>{main.summary}</p>
              <ul className="fl">
                {main.highlights.slice(0, 3).map((h) => (
                  <li key={h}>
                    <Icon name="check" size={18} />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="pr">
                <span className="price big">{formatCents(main.priceCents)}</span>
                <Link className="btn" href={`/comprar/${main.slug}`}>
                  Comprar agora <Icon name="arrow" size={18} />
                </Link>
              </div>
              <span className="pix">À vista no Pix</span>
            </div>
          </div>
          <div className="fside">
            {side.map((p) => (
              <Link key={p.slug} className="fs" href={`/p/${p.slug}`}>
                <Cover product={p} variant="mini" />
                <span>
                  <span className="tg">{categoryName(p.category)}</span>
                  <b>{p.title}</b>
                  <span className="price">{formatCents(p.priceCents)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
