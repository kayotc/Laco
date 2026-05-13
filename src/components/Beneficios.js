"use client";
import { useState } from "react";

const tabs = [
  {
    id: "criancas",
    label: "🧒 Crianças",
    items: [
      { title: "Melhor preparação para a vida em família", desc: "Graças ao trabalho voluntário que melhora a qualidade do cuidado institucional." },
      { title: "Desenvolvimento emocional e social mais saudável", desc: "Com mais atenção individualizada e acompanhamento estruturado." },
      { title: "Maior visibilidade para adoção", desc: "Instituições bem estruturadas facilitam os processos e aumentam as chances de adoção." },
      { title: "Experiências enriquecedoras", desc: "Oficinas, atividades e acompanhamento psicológico trazidos pelos voluntários." },
    ],
  },
  {
    id: "adotantes",
    label: "👨‍👩‍👧 Adotantes",
    items: [
      { title: "Crianças com acompanhamento robusto", desc: "Recebem crianças com histórico bem documentado e suporte contínuo." },
      { title: "Suporte pós-adoção", desc: "Acesso a psicólogos, assistentes sociais e outros profissionais voluntários." },
      { title: "Processo mais transparente", desc: "Instituições fortalecidas têm melhor organização e comunicação com adotantes." },
      { title: "Maior confiança no sistema", desc: "Sabendo que a criança foi bem cuidada e acompanhada durante todo o processo." },
    ],
  },
  {
    id: "governo",
    label: "🏛️ Governo",
    items: [
      { title: "Redução de custos operacionais", desc: "O voluntariado complementa serviços que o Estado teria que financiar integralmente." },
      { title: "Cumprimento do ECA com mais eficiência", desc: "Obrigações legais de proteção à infância cumpridas com apoio da sociedade civil." },
      { title: "Diminuição de pressão sobre o sistema", desc: "Menos carga sobre assistência social e judiciário com institucionalização mais curta." },
      { title: "Parceria estratégica com a sociedade civil", desc: "Indicadores sociais melhores e legitimidade para políticas públicas de infância." },
    ],
  },
];

export default function Beneficios() {
  const [active, setActive] = useState("criancas");
  const current = tabs.find((t) => t.id === active);

  return (
    <section id="beneficios">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">Para quem é o Laço</div>
          <h2 className="section-title">Benefícios para cada ator</h2>
          <p className="section-desc">A plataforma foi desenhada para gerar valor real para todos os envolvidos no ecossistema de adoção.</p>
        </div>
        <div className="beneficios-tabs">
          {tabs.map((t) => (
            <button key={t.id} className={`tab-btn ${active === t.id ? "active" : ""}`} onClick={() => setActive(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="tab-panel active">
          {current.items.map((item) => (
            <div key={item.title} className="beneficio-item">
              <div className="beneficio-dot"></div>
              <div className="beneficio-text">
                <strong>{item.title}</strong>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
