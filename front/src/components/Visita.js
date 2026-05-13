"use client";
import { useState } from "react";

const slots = [
  { time: "09:00 — 11:00", day: "Sábado, 10 de maio", badge: "Disponível", type: "green" },
  { time: "14:00 — 16:00", day: "Sábado, 10 de maio", badge: "Disponível", type: "green" },
  { time: "10:00 — 12:00", day: "Domingo, 11 de maio", badge: "3 vagas", type: "gray" },
  { time: "09:00 — 11:00", day: "Sábado, 17 de maio", badge: "Disponível", type: "green" },
];

export default function Visita() {
  const [selSlot, setSelSlot] = useState(0);

  return (
    <section id="visita">
      <div className="container">
        <div className="visita-inner">
          <div>
            <div className="section-eyebrow">Agendamento</div>
            <h2 className="section-title">Agende uma visita</h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
              Conheça as crianças e o lar pessoalmente. As visitas são coordenadas
              pela equipe do lar e acontecem nos horários disponíveis abaixo.
            </p>
            <div className="doacao-form" style={{ background: "var(--white)" }}>
              <div className="field"><label>Nome completo</label><input type="text" placeholder="Seu nome" /></div>
              <div className="field"><label>CPF</label><input type="text" placeholder="000.000.000-00" /></div>
              <div className="field"><label>E-mail</label><input type="email" placeholder="seu@email.com" /></div>
              <div className="field">
                <label>Lar de interesse</label>
                <select>
                  <option>Lar Esperança — Recife, PE</option>
                  <option>Casa Amor e Cuidado</option>
                  <option>Lar São José</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
              Horários disponíveis — Maio 2026
            </div>
            <div className="slots">
              {slots.map((s, i) => (
                <div key={i} className={`slot ${selSlot === i ? "sel" : ""}`} onClick={() => setSelSlot(i)}>
                  <div>
                    <div className="slot-time">{s.time}</div>
                    <div className="slot-day">{s.day}</div>
                  </div>
                  <span className={`slot-badge badge-${s.type}`}>{s.badge}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1.25rem" }}>
              Confirmar agendamento
            </button>
            <p style={{ fontSize: "0.75rem", color: "var(--ink-muted)", textAlign: "center", marginTop: "0.75rem" }}>
              Você receberá um e-mail de confirmação com as instruções do lar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
