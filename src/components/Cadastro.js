export default function Cadastro() {
  return (
    <section id="cadastro">
      <div className="container">
        <div className="cadastro-inner">
          <div>
            <div className="section-eyebrow">Para lares</div>
            <h2 className="section-title">Cadastre seu lar na plataforma</h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
              Lares de acolhimento verificados ganham visibilidade, recebem doações direcionadas
              e facilitam o processo de adoção das crianças acolhidas.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { n: "1", title: "Preencha o formulário", desc: "Dados do lar, responsável e chave PIX para doações." },
                { n: "2", title: "Análise em até 48h", desc: "Nossa equipe verifica os dados e a documentação." },
                { n: "3", title: "Apareça no mapa", desc: "Seu lar fica visível para doadores e adotantes em todo o Brasil." },
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
            <div className="form-grid">
              <div className="field"><label>Nome do lar</label><input type="text" placeholder="Ex: Lar Esperança" /></div>
              <div className="field"><label>CNPJ</label><input type="text" placeholder="00.000.000/0001-00" /></div>
            </div>
            <div className="field"><label>Endereço completo</label><input type="text" placeholder="Rua, número, bairro, cidade, UF" /></div>
            <div className="form-grid">
              <div className="field"><label>Telefone</label><input type="tel" placeholder="(81) 99999-9999" /></div>
              <div className="field"><label>E-mail responsável</label><input type="email" placeholder="contato@lar.org.br" /></div>
            </div>
            <div className="field">
              <label>Perfis de crianças atendidas</label>
              <select>
                <option>Deficiência física</option>
                <option>Deficiência intelectual</option>
                <option>Deficiência auditiva</option>
                <option>TEA</option>
                <option>Múltiplas deficiências</option>
              </select>
            </div>
            <div className="field"><label>Chave PIX para receber doações</label><input type="text" placeholder="CPF, CNPJ, e-mail ou chave aleatória" /></div>
            <div className="field">
              <label>Sobre o lar</label>
              <textarea rows={3} placeholder="Conte a história, missão e necessidades do seu lar..." />
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Enviar cadastro</button>
            <p style={{ fontSize: "0.72rem", color: "var(--ink-muted)", textAlign: "center", marginTop: "0.75rem" }}>
              Todos os dados devem estar em conformidade com o ECA (Lei 8.069/1990).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
