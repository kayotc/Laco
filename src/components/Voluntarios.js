export default function Voluntarios() {
  const perfis = [
    { ini: "AS", nome: "Ana S.", profissao: "Psicóloga", cidade: "Recife, PE", tipos: ["Voluntária"], cor: "#FAECE7", tc: "#993C1D" },
    { ini: "MR", nome: "Marcos R.", profissao: "Professor", cidade: "Olinda, PE", tipos: ["Doador", "Voluntário"], cor: "#E6F1FB", tc: "#185FA5" },
    { ini: "LC", nome: "Larissa C.", profissao: "Fisioterapeuta", cidade: "Recife, PE", tipos: ["Visitante", "Voluntária"], cor: "#E1F5EE", tc: "#085041" },
    { ini: "PT", nome: "Pedro T.", profissao: "Assistente Social", cidade: "Caruaru, PE", tipos: ["Voluntário"], cor: "#EEEDFE", tc: "#534AB7" },
    { ini: "JF", nome: "Juliana F.", profissao: "Médica", cidade: "Recife, PE", tipos: ["Doadora", "Voluntária"], cor: "#FEF3E2", tc: "#8A5A0A" },
    { ini: "RB", nome: "Roberto B.", profissao: "Educador Físico", cidade: "Paulista, PE", tipos: ["Visitante"], cor: "#FAECE7", tc: "#993C1D" },
  ];

  return (
    <section id="voluntarios" style={{ background: "var(--warm)" }}>
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">Base de voluntários</div>
          <h2 className="section-title">Pessoas prontas para ajudar</h2>
          <p className="section-desc">
            Lares cadastrados têm acesso completo aos perfis — com contato, habilidades e disponibilidade de cada voluntário.
          </p>
        </div>

        <div className="lares-grid">
          {perfis.map((p) => (
            <div key={p.nome} className="lar-card">
              <div className="lar-card-img" style={{ background: `linear-gradient(135deg, ${p.cor}, ${p.cor}cc)` }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.3rem", color: p.tc, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
                  {p.ini}
                </div>
              </div>
              <div className="lar-card-body">
                <div style={{ marginBottom: "0.5rem" }}>
                  {p.tipos.map((t) => (
                    <span key={t} className="lar-tag lar-tag-orange" style={{ marginRight: 4 }}>{t}</span>
                  ))}
                </div>
                <div className="lar-name">{p.nome}</div>
                <div className="lar-loc">💼 {p.profissao}</div>
                <div className="lar-loc">📍 {p.cidade}</div>
                <div className="lar-footer">
                  <div className="lar-count">Disponível para contato</div>
                  <button className="lar-btn">Ver perfil</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", marginBottom: "1rem" }}>
            Acesso completo aos contatos disponível apenas para lares cadastrados e verificados.
          </p>
          <a href="#lares" className="btn btn-outline">Cadastrar meu lar para buscar voluntários</a>
        </div>
      </div>
    </section>
  );
}
