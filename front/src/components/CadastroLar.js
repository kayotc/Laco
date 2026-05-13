"use client";
import { useRouter } from "next/navigation";

export default function CadastroLar() {
  const router = useRouter();

  return (
    <section id="lares" style={{ background: "var(--warm)" }}>
      <div className="container">
        <div className="cadastro-inner">
          <div>
            <div className="section-eyebrow">Para os lares</div>
            <h2 className="section-title">Cadastre seu lar e encontre voluntários</h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
              Lares verificados têm acesso completo à base de voluntários — com contato, habilidades e localização de cada pessoa disponível para ajudar.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { n: "1", title: "Crie a conta da instituição", desc: "Dados básicos do lar para iniciar o cadastro." },
                { n: "2", title: "Complete o perfil do lar", desc: "CNPJ, responsável, endereço e área de atuação no seu painel." },
                { n: "3", title: "Acesse a base de voluntários", desc: "Filtre por habilidade, cidade e disponibilidade. Convide diretamente." },
              ].map((s) => (
                <div key={s.n} style={{ display: "flex", gap: 14 }}>
                  <div style={{ width: 40, height: 40, background: "#0F6E56", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
              Sua instituição merece apoio
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", marginBottom: "1.75rem", lineHeight: 1.6 }}>
              Cadastre o lar e, após verificação em até 48h, você terá acesso a voluntários dispostos a ajudar com o que vocês mais precisam.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: "1.5rem" }}>
              {[
                { icon: "✓", text: "Busca por habilidade, cidade e disponibilidade" },
                { icon: "✓", text: "Envio de convites diretos para voluntários" },
                { icon: "✓", text: "Perfil do lar público para atrair interesse" },
                { icon: "✓", text: "Verificação para garantir segurança de todos" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 22, height: 22, background: "var(--teal-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--teal)" }}>{item.icon}</span>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "var(--ink)" }}>{item.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/cadastro")}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", background: "#0F6E56", borderColor: "#0F6E56" }}
            >
              Cadastrar meu lar →
            </button>
            <p style={{ fontSize: "0.72rem", color: "var(--ink-muted)", textAlign: "center", marginTop: "0.75rem" }}>
              Após verificação, você terá acesso completo à base de voluntários cadastrados.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
