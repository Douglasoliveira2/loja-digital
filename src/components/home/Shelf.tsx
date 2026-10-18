import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/data/catalog";

export function Shelf() {
  return (
    <section className="sec shelf">
      <div className="in">
        <div className="sh">
          <div>
            <span className="eyebrow">Catálogo</span>
            <h2>Em cartaz nesta edição</h2>
            <p>Cada livro com capa própria, amostra e entrega imediata.</p>
          </div>
          <Link className="lnk" href="/catalogo">
            Ver todos os e-books <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="prods">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
