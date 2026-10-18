import type { CSSProperties } from "react";
import { categoryName, type Product } from "@/data/catalog";

type Variant = "default" | "big" | "mini";

/** Capa editorial feita só com CSS. Será trocada pela imagem real quando existir. */
export function Cover({ product, variant = "default" }: { product: Product; variant?: Variant }) {
  const { cover } = product;
  const style = { "--a": cover.a, "--b": cover.b, "--c": cover.c } as CSSProperties;
  const shortTitle = product.title.split(",")[0] ?? product.title;
  return (
    <div
      className={`cover ${variant === "default" ? "" : variant}`}
      data-shape={cover.shape}
      style={style}
      role="img"
      aria-label={`Capa de ${product.title}`}
    >
      <span className="k">{categoryName(product.category)}</span>
      <span className="art" />
      <strong>{shortTitle}</strong>
      <em>{product.subtitle}</em>
      <span className="pub">Meu Ebook Digital</span>
    </div>
  );
}
