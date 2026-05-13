const ods = [
  { icon: "🏥", num: "ODS 3", title: "Saúde e Bem-Estar" },
  { icon: "⚖️", num: "ODS 10", title: "Redução das Desigualdades" },
  { icon: "🏛️", num: "ODS 16", title: "Paz, Justiça e Instituições" },
];

export default function ODS() {
  return (
    <section style={{ background: "var(--ink)", padding: "4rem 2rem" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>
          Alinhamento estratégico
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "white", marginBottom: "0.75rem" }}>
          Objetivos de Desenvolvimento Sustentável
        </h2>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", marginBottom: "2.5rem" }}>Em conformidade com a Agenda 2030 da ONU</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          {ods.map((o) => (
            <div key={o.num} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "1.5rem 2rem", minWidth: 160 }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{o.icon}</div>
              <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{o.num}</div>
              <div style={{ fontSize: "0.9rem", color: "white", fontWeight: 500 }}>{o.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
