import Link from "next/link";
import { Icon } from "./Icon";

const NAV = [
  { href: "/catalogo", label: "Novidades" },
  { href: "/#categorias", label: "Categorias" },
  { href: "/catalogo", label: "Mais vendidos" },
  { href: "/#suporte", label: "Suporte" },
];

export function SiteHeader() {
  return (
    <header className="top">
      <div className="in">
        <Link className="logo" href="/">
          <span className="mk" aria-hidden="true" />
          <span className="nm">Meu Ebook Digital</span>
        </Link>
        <nav className="nav" aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <form className="search" action="/catalogo" role="search">
          <Icon name="search" size={18} />
          <input type="search" name="q" placeholder="Buscar e-books" aria-label="Buscar e-books" />
        </form>
        <Link className="cart" href="/carrinho" aria-label="Carrinho">
          <Icon name="cart" />
        </Link>
        <details className="menu">
          <summary aria-label="Abrir menu">
            <Icon name="menu" size={24} />
          </summary>
          <div className="sheet">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href}>
                {n.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
