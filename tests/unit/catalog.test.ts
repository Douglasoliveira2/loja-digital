import { describe, expect, it } from "vitest";
import { CATEGORIES, FEATURED_SLUG, PRODUCTS, filterProducts, findProduct, isCategorySlug } from "@/data/catalog";

describe("catálogo de vitrine", () => {
  it("tem slugs únicos e preços em centavos inteiros", () => {
    const slugs = PRODUCTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const p of PRODUCTS) {
      expect(Number.isInteger(p.priceCents)).toBe(true);
      expect(p.priceCents).toBeGreaterThan(0);
    }
  });

  it("todo produto pertence a uma categoria existente", () => {
    for (const p of PRODUCTS) expect(isCategorySlug(p.category)).toBe(true);
    expect(CATEGORIES.length).toBeGreaterThan(0);
  });

  it("o produto em destaque existe e é o único produto real", () => {
    const featured = findProduct(FEATURED_SLUG);
    expect(featured?.priceCents).toBe(990);
    expect(PRODUCTS.filter((p) => !p.isExample).map((p) => p.slug)).toEqual([FEATURED_SLUG]);
  });

  it("filtra por categoria", () => {
    const infantil = filterProducts({ category: "infantil" });
    expect(infantil.length).toBeGreaterThan(0);
    expect(infantil.every((p) => p.category === "infantil")).toBe(true);
  });

  it("busca sem diferenciar acento nem maiúscula", () => {
    expect(filterProducts({ query: "ORCAMENTO" }).map((p) => p.slug)).toContain("orcamento-em-casal");
    expect(filterProducts({ query: "bebê" }).map((p) => p.slug)).toContain("sono-do-bebe");
  });

  it("devolve vazio quando nada combina e ignora slug desconhecido", () => {
    expect(filterProducts({ query: "xyzxyz" })).toEqual([]);
    expect(findProduct("nao-existe")).toBeUndefined();
  });
});
