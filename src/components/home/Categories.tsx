import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CATEGORIES } from "@/data/catalog";

export function Categories() {
  return (
    <section className="sec" id="categorias">
      <div className="in">
        <div className="sh">
          <div>
            <span className="eyebrow">Índice</span>
            <h2>Navegue por assunto</h2>
          </div>
          <Link className="lnk" href="/catalogo">
            Ver tudo <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="cats">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} className="cat" href={`/catalogo?categoria=${c.slug}`}>
              <span className="ci">
                <Icon name={c.icon} size={24} />
              </span>
              <span className="cn">{c.name}</span>
              <span className="go">
                <Icon name="arrow" size={18} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
