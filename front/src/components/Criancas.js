export default function Criancas() {
  return (
    <section id="criancas">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">Crianças para adoção</div>
          <h2 className="section-title">Perfis disponíveis</h2>
          <p className="section-desc">Perfis exibidos de forma segura e anonimizada, em conformidade integral com o ECA.</p>
        </div>
        <div className="criancas-grid">
          <div className="crianca-card">
            <div className="crianca-avatar" style={{ background: "#FAECE7", color: "#993C1D" }}>MS</div>
            <div className="crianca-name">Maria S.</div>
            <div className="crianca-age">7 anos</div>
            <div className="crianca-tags"><span className="lar-tag lar-tag-orange">Def. física</span></div>
          </div>
          <div className="crianca-card">
            <div className="crianca-avatar" style={{ background: "#E6F1FB", color: "#185FA5" }}>JP</div>
            <div className="crianca-name">João P.</div>
            <div className="crianca-age">10 anos</div>
            <div className="crianca-tags"><span className="lar-tag lar-tag-blue">TEA leve</span></div>
          </div>
          <div className="crianca-card">
            <div className="crianca-avatar" style={{ background: "#EAF3DE", color: "#3B6D11" }}>LC</div>
            <div className="crianca-name">Larissa C.</div>
            <div className="crianca-age">5 anos</div>
            <div className="crianca-tags"><span className="lar-tag lar-tag-orange">Def. auditiva</span></div>
          </div>
          <div className="crianca-card">
            <div className="crianca-avatar" style={{ background: "#EEEDFE", color: "#534AB7" }}>RT</div>
            <div className="crianca-name">Rafael T.</div>
            <div className="crianca-age">12 anos</div>
            <div className="crianca-tags"><span className="lar-tag lar-tag-orange">Def. intelectual</span></div>
          </div>
        </div>
        <div className="eca-notice">
          <div className="eca-icon">🛡️</div>
          <div className="eca-text">
            <strong>Conformidade com o ECA (Lei 8.069/1990)</strong>{" "}
            Dados completos das crianças são acessíveis apenas por usuários verificados e cadastrados.
            Nomes completos, fotos e informações sigilosas são protegidos. O agendamento de visita
            requer validação de CPF e análise pela equipe do lar.
          </div>
        </div>
      </div>
    </section>
  );
}
