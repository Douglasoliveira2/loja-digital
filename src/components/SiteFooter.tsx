import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="foot" id="suporte">
      <div className="in">
        <div className="fb">
          <Link className="logo" href="/">
            <span className="mk" aria-hidden="true" />
            <span className="nm">Meu Ebook Digital</span>
          </Link>
          <p>Livros digitais para ler, imprimir e guardar.</p>
        </div>
        <div className="fc">
          <b>Loja</b>
          <Link href="/catalogo">Todos os e-books</Link>
          <Link href="/#categorias">Categorias</Link>
        </div>
        <div className="fc">
          <b>Sua conta</b>
          <Link href="/entrar">Entrar</Link>
          <Link href="/conta">Meus downloads</Link>
        </div>
        <div className="fc">
          <b>Suporte</b>
          <span>Canal de atendimento a definir antes do lançamento.</span>
        </div>
        <p className="legal">
          Vitrine de exemplo. Os títulos além de Animais Fofinhos e os preços são ilustrativos.
        </p>
      </div>
    </footer>
  );
}
