/**
 * Catálogo de vitrine. Fonte temporária até a Fase 4 (catálogo no banco).
 * Apenas "animais-fofinhos" é produto real; os demais são exemplos de vitrine
 * e devem ser removidos quando o catálogo vier do banco.
 */
export type CoverShape = "circle" | "stripes" | "half" | "dots" | "arc";

export type Product = {
  slug: string;
  title: string;
  subtitle: string;
  category: CategorySlug;
  priceCents: number;
  summary: string;
  highlights: string[];
  cover: { a: string; b: string; c: string; shape: CoverShape };
  isExample: boolean;
};

export const CATEGORIES = [
  { slug: "infantil", name: "Infantil e pintura", icon: "pencil" },
  { slug: "educacao", name: "Educação", icon: "cap" },
  { slug: "casa", name: "Casa e rotina", icon: "home" },
  { slug: "receitas", name: "Receitas", icon: "fork" },
  { slug: "financas", name: "Finanças", icon: "coin" },
  { slug: "maternidade", name: "Maternidade", icon: "heart" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const PRODUCTS: readonly Product[] = [
  {
    slug: "animais-fofinhos",
    title: "Animais Fofinhos, Meu Primeiro Livro de Pintura",
    subtitle: "Meu primeiro livro de pintura",
    category: "infantil",
    priceCents: 990,
    summary:
      "20 desenhos originais e 5 atividades bônus, para crianças de 3 a 5 anos. PDF pronto para imprimir em A4.",
    highlights: ["20 desenhos para pintar", "5 atividades bônus", "Para crianças de 3 a 5 anos", "PDF para imprimir em A4"],
    cover: { a: "#fff1c9", b: "#82d8d0", c: "#1b2b28", shape: "circle" },
    isExample: false,
  },
  {
    slug: "rotina-leve",
    title: "Rotina Leve, Planner para a Família",
    subtitle: "Planner para a família",
    category: "casa",
    priceCents: 1990,
    summary: "Planner semanal para organizar a casa, as tarefas e os horários da família.",
    highlights: ["Planner semanal", "Lista de tarefas da casa", "PDF para imprimir"],
    cover: { a: "#1f4d46", b: "#82d8d0", c: "#f3fbf9", shape: "stripes" },
    isExample: true,
  },
  {
    slug: "cardapio-da-semana",
    title: "Cardápio da Semana",
    subtitle: "Receitas e lista de compras",
    category: "receitas",
    priceCents: 1490,
    summary: "Receitas simples para a semana, com lista de compras pronta para imprimir.",
    highlights: ["Receitas simples", "Lista de compras", "PDF para imprimir"],
    cover: { a: "#ffd9c7", b: "#ff8f6b", c: "#3a1d12", shape: "half" },
    isExample: true,
  },
  {
    slug: "primeiras-letras",
    title: "Primeiras Letras",
    subtitle: "Alfabetização em atividades",
    category: "educacao",
    priceCents: 1290,
    summary: "Atividades para apresentar as letras às crianças de forma leve.",
    highlights: ["Atividades por letra", "Folhas para imprimir", "PDF em A4"],
    cover: { a: "#dfe6ff", b: "#6d83ff", c: "#16204f", shape: "dots" },
    isExample: true,
  },
  {
    slug: "orcamento-em-casal",
    title: "Orçamento em Casal",
    subtitle: "Finanças a dois, passo a passo",
    category: "financas",
    priceCents: 2490,
    summary: "Um roteiro para organizar as contas a dois e combinar metas.",
    highlights: ["Roteiro passo a passo", "Planilhas para imprimir", "PDF em A4"],
    cover: { a: "#e8f5d8", b: "#86b84a", c: "#1d3010", shape: "arc" },
    isExample: true,
  },
  {
    slug: "sono-do-bebe",
    title: "Sono do Bebê",
    subtitle: "Rotinas para noites tranquilas",
    category: "maternidade",
    priceCents: 1790,
    summary: "Sugestões de rotina para as noites do bebê, em linguagem direta.",
    highlights: ["Rotinas por idade", "Registro do sono", "PDF para imprimir"],
    cover: { a: "#2a2f57", b: "#b9c2ff", c: "#f2f3ff", shape: "circle" },
    isExample: true,
  },
  {
    slug: "contos-de-bolso",
    title: "Contos de Bolso",
    subtitle: "Histórias curtas para dormir",
    category: "infantil",
    priceCents: 990,
    summary: "Histórias curtas para ler em voz alta na hora de dormir.",
    highlights: ["Histórias curtas", "Leitura em voz alta", "PDF para ler ou imprimir"],
    cover: { a: "#ffe0ea", b: "#ff7fa6", c: "#4a1126", shape: "dots" },
    isExample: true,
  },
  {
    slug: "maos-a-horta",
    title: "Mãos à Horta",
    subtitle: "Horta em casa para crianças",
    category: "educacao",
    priceCents: 1290,
    summary: "Atividades para montar uma pequena horta em casa com as crianças.",
    highlights: ["Passo a passo ilustrado", "Calendário de plantio", "PDF em A4"],
    cover: { a: "#cdeee9", b: "#0f6f65", c: "#0b2a26", shape: "half" },
    isExample: true,
  },
];

export const FEATURED_SLUG = "animais-fofinhos";

export function findProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function categoryName(slug: CategorySlug): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function isCategorySlug(value: string | undefined): value is CategorySlug {
  return CATEGORIES.some((c) => c.slug === value);
}

function normalize(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export type CatalogFilter = { category?: CategorySlug; query?: string };

export function filterProducts({ category, query }: CatalogFilter = {}): Product[] {
  const q = query ? normalize(query.trim()) : "";
  return PRODUCTS.filter((p) => {
    if (category && p.category !== category) return false;
    if (!q) return true;
    return normalize(`${p.title} ${p.subtitle} ${categoryName(p.category)}`).includes(q);
  });
}
