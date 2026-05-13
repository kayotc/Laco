export default function ComoAjudar() {
  return (
    <section id="ajudar" style={{ background: "white" }}>
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">População → Lares</div>
          <h2 className="section-title">Como você pode ajudar</h2>
          <p className="section-desc">
            A população é o ator direto que sustenta os lares. Existem três formas de contribuir — cada uma com impacto real na vida das crianças acolhidas.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>

          {/* DOAÇÃO */}
          <div className="ajudar-card" style={{ background: "var(--warm)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", transition: "all 0.2s" }}>
            <div style={{ height: 8, background: "var(--coral)" }}></div>
            <div style={{ padding: "1.75rem 1.5rem" }}>
              <div style={{ width: 52, height: 52, background: "var(--coral-light)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.5rem" }}>Doações</div>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                Contribuições financeiras via PIX que vão direto para o lar escolhido — pagam alimentação, medicamentos, materiais educativos e infraestrutura para as crianças.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.5rem" }}>
                {["100% direcionado ao lar escolhido", "Rastreável e verificado via PIX", "Qualquer valor faz diferença"].map(t => (
                  <div key={t} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div style={{ width: 6, height: 6, background: "var(--coral)", borderRadius: "50%", marginTop: 6, flexShrink: 0 }}></div>
                    <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>{t}</span>
                  </div>
                ))}
              </div>
              <a href="#doacao" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}>Fazer uma doação</a>
            </div>
          </div>

          {/* VOLUNTARIADO */}
          <div className="ajudar-card" style={{ background: "var(--warm)", borderRadius: 20, border: "2px solid var(--coral)", overflow: "hidden", transition: "all 0.2s", position: "relative" }}>
            <div style={{ position: "absolute", top: 14, right: 14, background: "var(--coral)", color: "white", fontSize: "0.65rem", fontWeight: 500, padding: "3px 10px", borderRadius: 100, letterSpacing: "0.05em" }}>MAIS NECESSÁRIO</div>
            <div style={{ height: 8, background: "var(--coral)" }}></div>
            <div style={{ padding: "1.75rem 1.5rem" }}>
              <div style={{ width: 52, height: 52, background: "var(--coral-light)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.5rem" }}>Voluntariado</div>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                Ofereça seu tempo e habilidades. Psicólogos, professores, fisioterapeutas, cuidadores e qualquer pessoa disposta a fazer a diferença são bem-vindos nos lares.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.5rem" }}>
                {["Atendimento psicológico e social", "Oficinas educativas e recreativas", "Suporte a crianças com deficiência"].map(t => (
                  <div key={t} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div style={{ width: 6, height: 6, background: "var(--coral)", borderRadius: "50%", marginTop: 6, flexShrink: 0 }}></div>
                    <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>{t}</span>
                  </div>
                ))}
              </div>
              <a href="#cadastro" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}>
                Quero ser voluntário
              </a>
            </div>
          </div>

          {/* VISITA / ADOÇÃO */}
          <div className="ajudar-card" style={{ background: "var(--warm)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", transition: "all 0.2s" }}>
            <div style={{ height: 8, background: "#0F6E56" }}></div>
            <div style={{ padding: "1.75rem 1.5rem" }}>
              <div style={{ width: 52, height: 52, background: "#E1F5EE", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.5rem" }}>Visita e adoção</div>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                Agende uma visita presencial ao lar, conheça as crianças e construa um vínculo real. Famílias adotantes encontram aqui suporte desde o primeiro contato até o pós-adoção.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.5rem" }}>
                {["Visitas agendadas e acompanhadas", "Suporte antes e após a adoção", "Processo transparente e seguro"].map(t => (
                  <div key={t} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div style={{ width: 6, height: 6, background: "#0F6E56", borderRadius: "50%", marginTop: 6, flexShrink: 0 }}></div>
                    <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>{t}</span>
                  </div>
                ))}
              </div>
              <a href="#visita" className="btn btn-outline" style={{ width: "100%", justifyContent: "center", textDecoration: "none", borderColor: "#0F6E56", color: "#0F6E56" }}>
                Agendar uma visita
              </a>
            </div>
          </div>

        </div>

        {/* FLUXO VISUAL */}
        <div style={{ marginTop: "3rem", background: "var(--warm)", borderRadius: 16, padding: "1.5rem 2rem", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, background: "white", borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>👥</div>
            <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)" }}>População</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 200 }}>
            <div style={{ flex: 1, height: 2, background: "var(--coral)", borderRadius: 2, position: "relative" }}>
              <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", fontSize: "0.7rem", color: "var(--coral)", fontWeight: 500, whiteSpace: "nowrap" }}>doa · voluntaria · visita</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--coral)"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, background: "var(--coral-light)", borderRadius: "50%", border: "1px solid rgba(216,90,48,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>🏠</div>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)" }}>Lares de acolhimento</div>
              <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>recursos · cuidado · visibilidade</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 200 }}>
            <div style={{ flex: 1, height: 2, background: "var(--teal)", borderRadius: 2, position: "relative" }}>
              <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", fontSize: "0.7rem", color: "var(--teal)", fontWeight: 500, whiteSpace: "nowrap" }}>acolhe · cuida · prepara</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--teal)"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, background: "#E1F5EE", borderRadius: "50%", border: "1px solid rgba(15,110,86,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>🧒</div>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)" }}>Crianças</div>
              <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>desenvolvimento · adoção</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
