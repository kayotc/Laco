"use client";
import { useState } from "react";

const tiposAjuda = ["Voluntariado presencial", "Doação financeira", "Visita"];
const habilidades = ["Psicologia", "Educação", "Saúde / Medicina", "Fisioterapia", "Assistência Social", "Esporte / Recreação", "Artes / Cultura", "Outro"];

export default function CadastroVoluntario() {
  const [tiposSel, setTiposSel] = useState([]);
  const [habilSel, setHabilSel] = useState([]);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  return (
    <section id="cadastro-voluntario">
      <div className="container">
        <div className="cadastro-inner">
          <div>
            <div className="section-eyebrow">Para a população</div>
            <h2 className="section-title">Crie seu perfil de voluntário</h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
              Preencha seus dados uma vez e fique disponível para ser encontrado por lares de acolhimento que precisam de ajuda.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { n: "1", title: "Preencha o formulário", desc: "Dados de contato, habilidades e como prefere ajudar." },
                { n: "2", title: "Perfil ativo na plataforma", desc: "Seu perfil fica visível para lares cadastrados e verificados." },
                { n: "3", title: "O lar entra em contato", desc: "Quando um lar precisar de alguém com o seu perfil, ele te contacta diretamente." },
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
              <div className="field"><label>Nome completo</label><input type="text" placeholder="Seu nome" /></div>
              <div className="field"><label>CPF</label><input type="text" placeholder="000.000.000-00" /></div>
            </div>
            <div className="form-grid">
              <div className="field"><label>E-mail</label><input type="email" placeholder="seu@email.com" /></div>
              <div className="field"><label>Telefone / WhatsApp</label><input type="tel" placeholder="(81) 99999-9999" /></div>
            </div>
            <div className="field"><label>Cidade e estado</label><input type="text" placeholder="Ex: Recife, PE" /></div>

            <div className="field">
              <label>Como você quer ajudar?</label>
              <div className="valor-grid" style={{ marginTop: 6 }}>
                {tiposAjuda.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`valor-btn ${tiposSel.includes(t) ? "sel" : ""}`}
                    onClick={() => toggle(tiposSel, setTiposSel, t)}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Habilidades / área de atuação</label>
              <div className="valor-grid" style={{ marginTop: 6 }}>
                {habilidades.map((h) => (
                  <button
                    key={h}
                    type="button"
                    className={`valor-btn ${habilSel.includes(h) ? "sel" : ""}`}
                    onClick={() => toggle(habilSel, setHabilSel, h)}
                  >{h}</button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Sobre você (opcional)</label>
              <textarea rows={3} placeholder="Conte um pouco sobre sua experiência e motivação..." />
            </div>

            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Criar meu perfil
            </button>
            <p style={{ fontSize: "0.72rem", color: "var(--ink-muted)", textAlign: "center", marginTop: "0.75rem" }}>
              Seus dados de contato só serão exibidos para lares verificados pela equipe Laço.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
