import { Icon, type IconName } from "@/components/Icon";

const BENEFITS: { icon: IconName; title: string; text: string }[] = [
  { icon: "bolt", title: "Entrega na hora", text: "O link do PDF chega assim que o pagamento é confirmado." },
  { icon: "shield", title: "Pagamento seguro", text: "Pix e cartão, com confirmação automática." },
  { icon: "down", title: "Seu para sempre", text: "Compra única. Baixe e imprima quantas vezes quiser." },
  { icon: "chat", title: "Suporte de verdade", text: "Fale com uma pessoa se algo não chegar." },
];

export function Benefits() {
  return (
    <section className="sec benwrap">
      <div className="in">
        <div className="sh">
          <div>
            <span className="eyebrow">A casa editora</span>
            <h2>O que você leva com cada livro</h2>
          </div>
        </div>
        <div className="bens">
          {BENEFITS.map((b) => (
            <div key={b.title} className="ben">
              <span className="bi">
                <Icon name={b.icon} size={26} />
              </span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
