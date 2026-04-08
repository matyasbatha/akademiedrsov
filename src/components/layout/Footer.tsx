import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-bold text-xl">
                Akademie <span className="text-gold">Drsov</span>
              </span>
            </div>
            <p className="text-navy-200 text-sm leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              Profesionální vzdělávání v oboru kosmetiky a masáží. Více než 20 let zkušeností ve studiu Body Factory.
            </p>
            <div className="mt-4 space-y-1">
              <a href="mailto:info@drsov.cz" className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@drsov.cz
              </a>
              <a href="tel:+420775603126" className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +420 775 603 126
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gold mb-4">Platforma</h3>
            <ul className="space-y-2">
              {[
                { href: "/clenstvi", label: "Členství" },
                { href: "/kurzy", label: "Kurzy" },
                { href: "/prihlaseni", label: "Přihlásit se" },
                { href: "/dashboard", label: "Dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-gold transition-colors"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gold mb-4">Adresa</h3>
            <address className="not-italic text-sm space-y-1" style={{ color: "rgba(255,255,255,0.7)" }}>
              <p>Salón v Praze</p>
              <p>Táborská 16/24</p>
              <p>130 00 Praha 3</p>
            </address>
            <div className="mt-4">
              <a
                href="https://www.drsov.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gold hover:text-gold-light transition-colors"
              >
                www.drsov.cz →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            © {new Date().getFullYear()} Akademie Drsov. Všechna práva vyhrazena.
          </p>
          <div className="flex gap-4">
            <Link href="/ochrana-udaju" className="text-xs hover:text-gold transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
              Ochrana osobních údajů
            </Link>
            <Link href="/obchodni-podminky" className="text-xs hover:text-gold transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
              Obchodní podmínky
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
