import { describe, expect, it } from "vitest";
import { absoluteUrl, buyPath, productPath, whatsappUrl } from "@/lib/links";

describe("links de compartilhamento", () => {
  it("monta o caminho do livro e da compra direta", () => {
    expect(productPath("animais-fofinhos")).toBe("/p/animais-fofinhos");
    expect(buyPath("animais-fofinhos")).toBe("/comprar/animais-fofinhos");
  });

  it("monta a URL absoluta a partir da origem", () => {
    expect(absoluteUrl("https://exemplo.com.br", "/p/x")).toBe("https://exemplo.com.br/p/x");
  });

  it("codifica o texto no link do WhatsApp", () => {
    const url = whatsappUrl("Livro & cia\nhttps://exemplo.com.br/p/x");
    expect(url.startsWith("https://wa.me/?text=")).toBe(true);
    expect(url).toContain("%26");
    expect(url).toContain("%0A");
  });
});
