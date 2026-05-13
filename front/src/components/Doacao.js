"use client";
import { useState } from "react";

const valores = ["R$ 20", "R$ 50", "R$ 100", "R$ 200"];

export default function Doacao() {
  const [sel, setSel] = useState("R$ 20");

  return (
    <section id="doacao">
      <div className="container">
        <div className="doacao-inner">
          <div>
            <div className="section-eyebrow">Faça a diferença</div>
            <h2 className="section-title">Doe para um lar</h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
              Sua doação vai diretamente para o lar escolhido, via PIX rastreável e verificado.
              Cada real contribui para o cuidado das crianças mais vulneráveis do Brasil.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["PIX verificado e rastreável", "100% direcionado ao lar escolhido", "Confirmação por e-mail imediata"].map((t) => (
                <div key={t} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, background: "var(--coral-light)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "0.875rem", color: "var(--ink-muted)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="doacao-form">
            <div className="field">
              <label>Lar beneficiado</label>
              <select>
                <option>Lar Esperança — Recife, PE</option>
                <option>Casa Amor e Cuidado — Olinda, PE</option>
                <option>Lar São José — Caruaru, PE</option>
              </select>
            </div>
            <div className="field">
              <label>Valor da doação</label>
              <div className="valor-grid">
                {valores.map((v) => (
                  <button key={v} className={`valor-btn ${sel === v ? "sel" : ""}`} onClick={() => setSel(v)}>{v}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Seu nome</label>
              <input type="text" placeholder="Nome completo" />
            </div>
            <div className="field">
              <label>Mensagem (opcional)</label>
              <textarea rows={2} style={{ resize: "none" }} placeholder="Uma mensagem de carinho..." />
            </div>
            <div className="pix-box">
              <div className="pix-qr">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--ink-muted)" strokeWidth="1.2">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="3" height="3" />
                  <rect x="18" y="14" width="3" height="3" /><rect x="14" y="18" width="3" height="3" />
                  <rect x="18" y="18" width="3" height="3" />
                </svg>
              </div>
              <div className="pix-key">Chave PIX: <strong>laco@acolhimento.org.br</strong></div>
              <p style={{ fontSize: "0.72rem", color: "var(--ink-muted)", marginTop: 4 }}>Pagamento seguro · sem taxas</p>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
              Confirmar doação
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
