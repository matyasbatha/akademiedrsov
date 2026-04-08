import Link from "next/link";
import CheckoutButton from "@/components/member/CheckoutButton";

const benefits = [
  {
    icon: "🎬",
    title: "Video kurzy",
    desc: "Stovky hodin profesionálních video lekcí s výkladem krok za krokem",
  },
  {
    icon: "📄",
    title: "Skripta a PDF",
    desc: "Kompletní studijní materiály ke stažení pro každý kurz",
  },
  {
    icon: "🏆",
    title: "Certifikáty",
    desc: "Získejte mezinárodně uznávané certifikáty po absolvování kurzů",
  },
  {
    icon: "♾️",
    title: "Neomezený přístup",
    desc: "Sledujte obsah kdykoliv a odkudkoliv, bez limitu přehrávání",
  },
  {
    icon: "🔬",
    title: "Odborné know-how",
    desc: "20+ let zkušeností kondenzovaných do praktických postupů",
  },
  {
    icon: "💎",
    title: "Prémiový obsah",
    desc: "Nový obsah přibývá pravidelně – vždy máte přístup k nejnovějšímu",
  },
];

const faqs = [
  {
    q: "Jak funguje členství?",
    a: "Po zakoupení členství získáte okamžitý přístup ke všem publikovaným kurzům, lekcím a materiálům. Přístup trvá po dobu aktivního předplatného.",
  },
  {
    q: "Mohu členství kdykoliv zrušit?",
    a: "Ano, členství můžete zrušit kdykoliv přes správu předplatného. Přístup zachováte do konce zaplacené doby.",
  },
  {
    q: "Jsou kurzy k dispozici okamžitě?",
    a: "Ano, po úspěšné platbě se váš účet aktivuje a máte okamžitý přístup ke všemu obsahu.",
  },
  {
    q: "Existuje zkušební verze zdarma?",
    a: "Ano! Dva vybrané kurzy jsou dostupné zdarma po registraci – bez jakékoli platby. Stačí si vytvořit účet.",
  },
  {
    q: "Na jakých zařízeních kurzy fungují?",
    a: "Platforma funguje na všech moderních zařízeních – počítač, tablet i mobilní telefon.",
  },
  {
    q: "Dostanu fakturu?",
    a: "Ano, po každé platbě vám Stripe automaticky zašle daňový doklad na váš e-mail.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-navy overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, #c9a84c 0%, transparent 60%), radial-gradient(circle at 80% 20%, #4a6fa5 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              Profesionální vzdělávání v kosmetice
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Staňte se expertem <br />
              <span className="text-gold">na moderní kosmetiku</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
              Přístup ke všem video kurzům, skriptům a certifikátům Akademie Drsov.
              Profesionální know-how přímo od odborníků s 20+ lety praxe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/clenstvi"
                className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl"
              >
                Začít členství za 999 Kč/měsíc
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/registrace"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
              >
                2 kurzy zdarma →
              </Link>
            </div>
            <p className="text-white/50 text-sm mt-4">
              Bez závazků · Zrušit kdykoliv · Okamžitý přístup
            </p>
          </div>
        </div>
      </section>

      {/* Co získáte */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Co členství zahrnuje
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Jeden poplatek, neomezený přístup ke všemu. Žádné skryté poplatky.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all group"
              >
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-navy text-lg mb-2 group-hover:text-gold transition-colors">
                  {b.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ceny */}
      <section className="py-20 bg-white" id="ceny">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Vyberte si svůj plán
            </h2>
            <p className="text-gray-600 text-lg">
              Začněte zdarma nebo rovnou odemkněte plný přístup
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Zdarma */}
            <div className="rounded-2xl border-2 border-gray-200 p-7">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Zdarma
              </div>
              <div className="text-4xl font-bold text-navy mb-1">0 Kč</div>
              <div className="text-gray-500 text-sm mb-6">navždy</div>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                {[
                  "2 kurzy zdarma",
                  "Přístup po registraci",
                  "Bez platební karty",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/registrace"
                className="block w-full text-center border-2 border-navy text-navy py-3 rounded-xl font-semibold hover:bg-navy hover:text-white transition-all"
              >
                Registrovat se
              </Link>
            </div>

            {/* Měsíční – featured */}
            <div className="rounded-2xl border-2 border-gold bg-navy p-7 relative shadow-xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                Nejoblíbenější
              </div>
              <div className="text-sm font-semibold text-gold/80 uppercase tracking-wide mb-2">
                Měsíční
              </div>
              <div className="text-4xl font-bold text-white mb-1">999 Kč</div>
              <div className="text-white/50 text-sm mb-6">/ měsíc · zrušit kdykoliv</div>
              <ul className="space-y-3 mb-8 text-sm text-white/80">
                {[
                  "Neomezený přístup ke všem kurzům",
                  "Všechna skripta a PDF",
                  "Certifikáty",
                  "Nový obsah průběžně",
                  "Správa přes Stripe Portal",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <CheckoutButton planKey="monthly" className="w-full bg-gold text-navy py-3 rounded-xl font-bold hover:bg-gold-dark transition-all text-center block">
                Začít členství
              </CheckoutButton>
            </div>

            {/* Roční */}
            <div className="rounded-2xl border-2 border-gray-200 p-7 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                Ušetříte 2 000 Kč
              </div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Roční
              </div>
              <div className="text-4xl font-bold text-navy mb-1">9 990 Kč</div>
              <div className="text-gray-500 text-sm mb-6">/ rok · 833 Kč/měsíc</div>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                {[
                  "Vše z měsíčního plánu",
                  "2 měsíce zdarma",
                  "Prioritní podpora",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <CheckoutButton planKey="yearly" className="w-full border-2 border-navy text-navy py-3 rounded-xl font-semibold hover:bg-navy hover:text-white transition-all text-center block">
                Roční členství
              </CheckoutButton>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy text-center mb-12">
            Časté otázky
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="bg-white rounded-xl border border-gray-100 group"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-navy list-none">
                  {faq.q}
                  <svg
                    className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-600 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Připraveni začít?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Přidejte se k profesionálům, kteří se vzdělávají s Akademií Drsov.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/clenstvi"
              className="inline-flex items-center justify-center bg-gold text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-dark transition-all shadow-lg"
            >
              Začít členství
            </Link>
            <Link
              href="/registrace"
              className="inline-flex items-center justify-center border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Zkusit zdarma
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
