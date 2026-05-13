"use client";

export default function Lares() {
  return (
    <section id="lares">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">Lares cadastrados</div>
          <h2 className="section-title">Instituições verificadas</h2>
          <p className="section-desc">Cada lar é verificado pela equipe Laço antes de aparecer na plataforma.</p>
        </div>
        <div className="lares-grid">
          <div className="lar-card">
            <div className="lar-card-img" style={{ background: "linear-gradient(135deg,#FAECE7,#F5C4B3)" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D85A30" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="lar-card-body">
              <span className="lar-tag lar-tag-orange">Deficiência física</span>
              <span className="lar-tag lar-tag-green">Recebe visitas</span>
              <div className="lar-name">Lar Esperança</div>
              <div className="lar-loc">📍 Recife, Pernambuco</div>
              <div className="lar-footer">
                <div className="lar-count"><strong>12</strong> crianças acolhidas</div>
                <button className="lar-btn" onClick={() => document.getElementById("criancas").scrollIntoView({ behavior: "smooth" })}>
                  Ver crianças
                </button>
              </div>
            </div>
          </div>

          <div className="lar-card">
            <div className="lar-card-img" style={{ background: "linear-gradient(135deg,#E1F5EE,#9FE1CB)" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="lar-card-body">
              <span className="lar-tag lar-tag-blue">TEA</span>
              <span className="lar-tag lar-tag-orange">Def. auditiva</span>
              <div className="lar-name">Casa Amor e Cuidado</div>
              <div className="lar-loc">📍 Olinda, Pernambuco</div>
              <div className="lar-footer">
                <div className="lar-count"><strong>8</strong> crianças acolhidas</div>
                <button className="lar-btn">Ver crianças</button>
              </div>
            </div>
          </div>

          <div className="lar-card">
            <div className="lar-card-img" style={{ background: "linear-gradient(135deg,#E6F1FB,#B5D4F4)" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="lar-card-body">
              <span className="lar-tag lar-tag-orange">Def. intelectual</span>
              <span className="lar-tag" style={{ background: "#F1EFE8", color: "#5F5E5A" }}>Convênio municipal</span>
              <div className="lar-name">Lar São José</div>
              <div className="lar-loc">📍 Caruaru, Pernambuco</div>
              <div className="lar-footer">
                <div className="lar-count"><strong>21</strong> crianças acolhidas</div>
                <button className="lar-btn">Ver crianças</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
