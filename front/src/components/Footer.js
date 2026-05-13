const links = [
  { href: "#como", label: "Como funciona" },
  { href: "#lares", label: "Lares" },
  { href: "#criancas", label: "Crianças" },
  { href: "#doacao", label: "Doação" },
  { href: "#visita", label: "Visita" },
  { href: "#cadastro", label: "Cadastrar lar" },
];

export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">Laço</div>
      <div className="footer-sub">Lares de Acolhimento Conectados Online · AKWtech · UNINASSAU 2026</div>
      <div className="footer-links">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="footer-link">{l.label}</a>
        ))}
      </div>
      <div className="footer-copy">© 2026 AKWtech — Ana Vitória, Kayo Vinicius, Wendell de Santana · Prof. André Caetano · UNINASSAU</div>
    </footer>
  );
}
