"use client";
import { useRouter } from "next/navigation";

export default function CadastroVoluntario() {
  const router = useRouter();

  return (
    <section id="cadastro-voluntario">
      <div className="container">
        <div className="cadastro-inner">
          <div>
            <div className="section-eyebrow">Para a população</div>
            <h2 className="section-title">Crie seu perfil de voluntário</h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
              Preencha seus dados uma vez e fique disponível para ser encontrado por lares de acolhimento que precisam de ajuda.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { n: "1", title: "Crie sua conta", desc: "Dados básicos de contato e uma senha — pronto em menos de 2 minutos." },
                { n: "2", title: "Complete seu perfil", desc: "Informe habilidades, disponibilidade e interesses no seu painel." },
                { n: "3", title: "O lar entra em contato", desc: "Quando um lar encontrar seu perfil, ele te envia um convite direto pela plataforma." },
              ].map((s) => (
                <div key={s.n} style={{ display: "flex", gap: 14 }}>
                  <div style={{ width: 40, height: 40, background: "var(--coral)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "white", fontWeight: 700, fontFamily: "var(--font-display)" }}>{s.n}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--ink)", marginBottom: 2 }}>{s.title}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--ink-muted)" }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cadastro-form">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>
              Pronto para fazer parte?
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", marginBottom: "1.75rem", lineHeight: 1.6 }}>
              Seu cadastro é rápido e gratuito. Depois de criar a conta, você preenche seu perfil completo com habilidades, localidade e disponibilidade.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: "1.5rem" }}>
              {[
                { icon: "✓", text: "Perfil visível para lares verificados" },
                { icon: "✓", text: "Receba convites personalizados" },
                { icon: "✓", text: "Controle total de visibilidade" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 22, height: 22, background: "var(--coral-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--coral)" }}>{item.icon}</span>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "var(--ink)" }}>{item.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/cadastro")}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Criar meu perfil grátis →
            </button>
            <p style={{ fontSize: "0.72rem", color: "var(--ink-muted)", textAlign: "center", marginTop: "0.75rem" }}>
              Seus dados de contato só são exibidos para lares verificados pela equipe Laço.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
