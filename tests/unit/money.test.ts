import { describe, expect, it } from "vitest";
import { formatCents } from "@/lib/money";

describe("formatCents", () => {
  it("formata em reais", () => {
    expect(formatCents(990).replace(/\s/g, " ")).toBe("R$ 9,90");
  });
  it("recusa valor não inteiro", () => {
    expect(() => formatCents(9.9)).toThrow();
  });
});
