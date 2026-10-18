import Link from "next/link";
import { categoryName, type Product } from "@/data/catalog";
import { formatCents } from "@/lib/money";
import { Cover } from "./Cover";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="prod">
      <Link className="pc" href={`/p/${product.slug}`} aria-label={`Ver ${product.title}`}>
        <Cover product={product} />
      </Link>
      <div className="pb">
        <span className="tg">{categoryName(product.category)}</span>
        <h3>
          <Link href={`/p/${product.slug}`}>{product.title}</Link>
        </h3>
        <div className="pr">
          <span className="price">{formatCents(product.priceCents)}</span>
          <Link className="btn sm" href={`/comprar/${product.slug}`}>
            Comprar
          </Link>
        </div>
      </div>
    </article>
  );
}
