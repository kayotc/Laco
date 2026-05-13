export default function ComoFunciona() {
  return (
    <section id="como">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">Como funciona</div>
          <h2 className="section-title">Simples para os dois lados</h2>
          <p className="section-desc">A população se cadastra. Os lares buscam. A conexão acontece.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>

          {/* LADO POPULAÇÃO */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--coral-light)", color: "var(--coral-dark)", fontSize: "0.75rem", fontWeight: 600, padding: "4px 14px", borderRadius: 100, marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              👥 Para a população
            </div>
            <div className="steps" style={{ gridTemplateColumns: "1fr", gap: "1.25rem" }}>
              {[
                { n: "01", icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></>, title: "Crie seu perfil", desc: "Informe suas habilidades, localização, contato e como prefere ajudar: doação, visita ou voluntariado." },
                { n: "02", icon: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></>, title: "Aguarde o contato", desc: "Os lares navegam pelos perfis cadastrados e entram em contato diretamente com você quando precisarem." },
                { n: "03", icon: <><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></>, title: "Faça a diferença", desc: "Atenda ao chamado do lar e contribua do jeito que escolheu — presencialmente ou com doações." },
              ].map((s) => (
                <div key={s.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0 }}>
                    <div className="step-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="1.8" strokeLinecap="round">{s.icon}</svg>
                    </div>
                  </div>
                  <div>
                    <div className="step-title">{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <a href="#cadastro-voluntario" className="btn btn-primary">Quero me cadastrar</a>
            </div>
          </div>

          {/* LADO LARES */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#E1F5EE", color: "#085041", fontSize: "0.75rem", fontWeight: 600, padding: "4px 14px", borderRadius: 100, marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              🏠 Para os lares
            </div>
            <div className="steps" style={{ gridTemplateColumns: "1fr", gap: "1.25rem" }}>
              {[
                { icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>, title: "Cadastre seu lar", desc: "Informe os dados da instituição, CNPJ, responsável e o que tipo de ajuda mais precisa no momento." },
                { icon: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>, title: "Busque voluntários", desc: "Navegue pelos perfis cadastrados filtrando por habilidade, localização e tipo de contribuição disponível." },
                { icon: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></>, title: "Entre em contato", desc: "Acesse os dados de contato do voluntário diretamente e combine como e quando a ajuda vai acontecer." },
              ].map((s) => (
                <div key={s.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0 }}>
                    <div className="step-icon" style={{ background: "#E1F5EE" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="1.8" strokeLinecap="round">{s.icon}</svg>
                    </div>
                  </div>
                  <div>
                    <div className="step-title">{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <a href="#lares" className="btn btn-outline" style={{ borderColor: "#0F6E56", color: "#0F6E56" }}>Cadastrar meu lar</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
