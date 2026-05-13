export default function CadastroLar() {
  return (
    <section id="lares" style={{ background: "var(--warm)" }}>
      <div className="container">
        <div className="cadastro-inner">
          <div>
            <div className="section-eyebrow">Para os lares</div>
            <h2 className="section-title">Cadastre seu lar e encontre voluntários</h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
              Lares verificados têm acesso completo à base de voluntários — com contato, habilidades
              e localização de cada pessoa disponível para ajudar.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { n: "1", title: "Cadastre a instituição", desc: "CNPJ, responsável e dados de contato do lar." },
                { n: "2", title: "Verificação em até 48h", desc: "Nossa equipe valida os dados antes de liberar o acesso." },
                { n: "3", title: "Acesse a base de voluntários", desc: "Filtre por habilidade, cidade e tipo de ajuda. Contate diretamente quem precisar." },
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
            <div className="form-grid">
              <div className="field"><label>Nome do lar</label><input type="text" placeholder="Ex: Lar Esperança" /></div>
              <div className="field"><label>CNPJ</label><input type="text" placeholder="00.000.000/0001-00" /></div>
            </div>
            <div className="field"><label>Endereço completo</label><input type="text" placeholder="Rua, número, bairro, cidade, UF" /></div>
            <div className="form-grid">
              <div className="field"><label>Responsável</label><input type="text" placeholder="Nome do responsável" /></div>
              <div className="field"><label>Telefone / WhatsApp</label><input type="tel" placeholder="(81) 99999-9999" /></div>
            </div>
            <div className="field"><label>E-mail institucional</label><input type="email" placeholder="contato@lar.org.br" /></div>
            <div className="field">
              <label>Que tipo de voluntário vocês mais precisam?</label>
              <select>
                <option>Psicólogos / Assistentes Sociais</option>
                <option>Professores / Educadores</option>
                <option>Profissionais de saúde</option>
                <option>Doadores financeiros</option>
                <option>Visitantes / Companhia</option>
                <option>Qualquer tipo de ajuda</option>
              </select>
            </div>
            <div className="field">
              <label>Sobre o lar</label>
              <textarea rows={3} placeholder="Conte sobre a história, missão e as crianças que vocês acolhem..." />
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", background: "#0F6E56", borderColor: "#0F6E56" }}>
              Enviar cadastro
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
