export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg-circle c1"></div>
      <div className="hero-bg-circle c2"></div>
      <div className="hero-inner">
        <div>
          <div className="hero-eyebrow fade-up">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" />
            </svg>
            AKWtech · UNINASSAU 2026
          </div>
          <h1 className="hero-title fade-up delay-1">
            Voluntários prontos<br />para <em>fazer a diferença</em>
          </h1>
          <p className="hero-desc fade-up delay-2">
            Lares de acolhimento encontram aqui pessoas dispostas a ajudar —
            voluntários, doadores e visitantes cadastrados e prontos para serem chamados.
          </p>
          <div className="hero-actions fade-up delay-3">
            <a href="#cadastro-voluntario" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              Quero me cadastrar
            </a>
            <a href="#lares" className="btn btn-outline">Sou um lar</a>
          </div>
          <div className="hero-stats fade-up delay-4">
            <div>
              <div className="hero-stat-num">312</div>
              <div className="hero-stat-label">Voluntários cadastrados</div>
            </div>
            <div>
              <div className="hero-stat-num">48</div>
              <div className="hero-stat-label">Lares conectados</div>
            </div>
            <div>
              <div className="hero-stat-num">R$24k</div>
              <div className="hero-stat-label">Em doações/mês</div>
            </div>
          </div>
        </div>

        {/* MOCKUP DE BUSCA DE VOLUNTÁRIOS */}
        <div className="map-card fade-up delay-2">
          <div className="map-topbar">
            <div className="map-search">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Buscar voluntários por habilidade ou região...
            </div>
          </div>
          {/* LISTA DE PERFIS MOCK */}
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { ini: "AS", nome: "Ana S.", tipo: "Psicóloga", cidade: "Recife, PE", tag: "Voluntária", cor: "#FAECE7", tc: "#993C1D" },
              { ini: "MR", nome: "Marcos R.", tipo: "Professor", cidade: "Olinda, PE", tag: "Doador", cor: "#E6F1FB", tc: "#185FA5" },
              { ini: "LC", nome: "Larissa C.", tipo: "Fisioterapeuta", cidade: "Recife, PE", tag: "Visitante", cor: "#E1F5EE", tc: "#085041" },
            ].map((v) => (
              <div key={v.nome} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--warm)", borderRadius: 10, padding: "10px 12px", border: "1px solid var(--border)" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: v.cor, color: v.tc, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>{v.ini}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--ink)" }}>{v.nome} <span style={{ fontSize: "0.72rem", color: "var(--ink-muted)", fontWeight: 400 }}>· {v.tipo}</span></div>
                  <div style={{ fontSize: "0.72rem", color: "var(--ink-muted)" }}>📍 {v.cidade}</div>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 500, padding: "3px 9px", borderRadius: 100, background: v.cor, color: v.tc }}>{v.tag}</span>
              </div>
            ))}
          </div>
          <div className="map-panel">
            <div style={{ fontSize: "0.78rem", color: "var(--ink-muted)", flex: 1 }}>
              <strong style={{ color: "var(--ink)" }}>312 voluntários</strong> disponíveis na sua região
            </div>
            <button className="lar-btn">Ver todos</button>
          </div>
        </div>
      </div>
    </section>
  );
}
