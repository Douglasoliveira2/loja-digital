"use client";

import { useEffect, useState } from "react";
import { absoluteUrl, buyPath, productPath, whatsappUrl } from "@/lib/links";
import { Icon } from "./Icon";

type Copied = "livro" | "compra" | null;

export function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<Copied>(null);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
    setCanShare(typeof navigator.share === "function");
  }, []);

  const bookUrl = origin ? absoluteUrl(origin, productPath(slug)) : productPath(slug);
  const buyUrl = origin ? absoluteUrl(origin, buyPath(slug)) : buyPath(slug);

  async function copy(kind: Exclude<Copied, null>, url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2200);
    } catch {
      window.prompt("Copie o link:", url);
    }
  }

  return (
    <div className="share">
      <span className="share-title">Compartilhar</span>
      <div className="share-row">
        <button type="button" className="chip" onClick={() => copy("livro", bookUrl)}>
          <Icon name="link" size={16} />
          {copied === "livro" ? "Link copiado" : "Copiar link do livro"}
        </button>
        <button type="button" className="chip" onClick={() => copy("compra", buyUrl)}>
          <Icon name="link" size={16} />
          {copied === "compra" ? "Link copiado" : "Copiar link de compra"}
        </button>
        <a
          className="chip"
          href={whatsappUrl(`${title}\n${bookUrl}`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
        {canShare && (
          <button
            type="button"
            className="chip"
            onClick={() => navigator.share({ title, url: bookUrl }).catch(() => undefined)}
          >
            <Icon name="share" size={16} />
            Outros apps
          </button>
        )}
      </div>
      <span className="visually-hidden" role="status" aria-live="polite">
        {copied ? "Link copiado para a área de transferência" : ""}
      </span>
    </div>
  );
}
