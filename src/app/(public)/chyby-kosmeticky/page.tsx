import Link from "next/link";
import { Metadata } from "next";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "10 nejčastějších chyb kosmetičky",
  description:
    "9 z 10 kosmetiček dělá tyto chyby – a přichází kvůli nim o klientky i peníze. Odhalte všech 10 a získejte kurzy zdarma po bezplatné registraci.",
  openGraph: {
    title: "10 nejčastějších chyb kosmetičky – děláte je i vy?",
    description:
      "Odhalte všech 10 chyb, které vás stojí klientky a peníze. Po registraci navíc kurzy zdarma.",
    type: "website",
  },
};

// 4 odhalené + 6 zamčených. Obsah klidně uprav v adminu textu / tady.
const mistakes = [
  {
    title: "Přeskakují důkladnou konzultaci a anamnézu",
    desc: "Bez pochopení potřeb, zdravotního stavu a očekávání klientky střílíte naslepo. Kvalitní konzultace je základ důvěry i výsledku.",
  },
  {
    title: "Nedělají poctivou analýzu pleti",
    desc: "Ošetření „od oka" vede k volbě špatných přípravků a postupů. Bez správné diagnostiky typu a stavu pleti nemůžete slíbit výsledek.",
  },
  {
    title: "Podceňují kontraindikace",
    desc: "Přehlédnutá kontraindikace znamená riziko podráždění, komplikace a ztrátu klientky. Bezpečnost musí být vždy na prvním místě.",
  },
  {
    title: "Zanedbávají hygienu nad rámec minima",
    desc: "Dezinfekce, jednorázové pomůcky a čistý postup nejsou formalita. Právě detaily hygieny odlišují profesionálku od amatérky.",
  },
  {
    title: "Neřeší domácí péči klientky",
    desc: "I to nejlepší ošetření ztratí efekt, když klientka doma dělá chyby. Bez doporučené domácí péče výsledky nevydrží.",
  },
  {
    title: "Prodávají se pod cenou",
    desc: "Špatně nastavené ceny vás připraví o zisk i o vnímanou hodnotu. Naučte se počítat cenu podle skutečných nákladů a hodnoty.",
  },
  {
    title: "Nedokumentují průběh a výsledky",
    desc: "Bez fotek a záznamů nemáte důkaz posunu ani oporu při reklamaci. Dokumentace je zároveň skvělý marketing.",
  },
  {
    title: "Neumí ošetření „prodat“",
    desc: "Skvělá práce, o které se klientka nedozví, se neprodá. Komunikace hodnoty rozhoduje o tom, zda se klientka vrátí.",
  },
  {
    title: "Nepokračují ve vzdělávání",
    desc: "Metody a přístroje jdou rychle dopředu. Kdo se nevzdělává, ztrácí konkurenceschopnost i sebejistotu.",
  },
  {
    title: "Nepracují s návraty klientek",
    desc: "Získat novou klientku je dražší než udržet stávající. Bez databáze a systému návratů necháváte peníze na stole.",
  },
];

export default async function ChybyKosmetickyPage() {
  const session = await auth();
  const unlocked = !!session?.user;

  const revealed = mistakes.slice(0, 4);
  const locked = mistakes.slice(4);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-navy overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 40%, #c9a84c 0%, transparent 55%), radial-gradient(circle at 85% 20%, #4a6fa5 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            Pro kosmetičky a estetické specialistky
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
            10 nejčastějších chyb,
            <br />
            <span className="text-gold">které dělá 9 z 10 kosmetiček</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Přichází kvůli nim o klientky, o peníze a o pověst – a většinou o nich
            ani nevědí. Čtěte a poctivě si zaškrtněte, kolika se dopouštíte i vy.
          </p>
          <a
            href="#chyby"
            className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-dark transition-all shadow-lg"
          >
            Ukázat chyby
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Odhalené chyby */}
      <section id="chyby" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-gold font-semibold text-sm uppercase tracking-widest">Zdarma odhaleno</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2">
              První 4 chyby
            </h2>
          </div>

          <div className="space-y-5">
            {revealed.map((m, i) => (
              <div
                key={m.title}
                className="flex gap-5 bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-navy text-gold font-bold text-xl flex items-center justify-center">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-navy text-lg mb-1">{m.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zamčené chyby / odemčeno */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {unlocked ? (
            <>
              <div className="text-center mb-12">
                <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">Odemčeno</span>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2">Zbývajících 6 chyb</h2>
              </div>
              <div className="space-y-5">
                {locked.map((m, i) => (
                  <div key={m.title} className="flex gap-5 bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-navy text-gold font-bold text-xl flex items-center justify-center">
                      {i + 5}
                    </div>
                    <div>
                      <h3 className="font-bold text-navy text-lg mb-1">{m.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  href="/kurzy"
                  className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-dark transition-all shadow-lg"
                >
                  Prohlédnout kurzy v akademii
                </Link>
              </div>
            </>
          ) : (
            <div className="relative">
              {/* Rozmazaný teaser */}
              <div className="space-y-5" aria-hidden="true">
                {locked.map((m, i) => (
                  <div key={m.title} className="flex gap-5 bg-white rounded-2xl p-6 border border-gray-100 blur-[6px] select-none">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-navy text-gold font-bold text-xl flex items-center justify-center">
                      {i + 5}
                    </div>
                    <div>
                      <h3 className="font-bold text-navy text-lg mb-1">{m.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Překryv s výzvou */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-50/40 via-gray-50/85 to-gray-50 rounded-2xl">
                <div className="text-center max-w-lg px-6 py-10">
                  <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
                    Odhalte zbývajících 6 chyb
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Zaregistrujte se zdarma do členské sekce a odemkněte celý seznam.
                    Navíc získáte přístup k <strong className="text-navy">vybraným kurzům zdarma</strong> –
                    jen za to, že se zaregistrujete.
                  </p>
                  <Link
                    href="/registrace?callbackUrl=/chyby-kosmeticky"
                    className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-dark transition-all shadow-lg"
                  >
                    Odhalit zdarma po registraci
                  </Link>
                  <p className="text-gray-400 text-sm mt-3">
                    Registrace zdarma · bez platební karty · hotovo za minutu
                  </p>
                  <p className="text-gray-500 text-sm mt-4">
                    Už máte účet?{" "}
                    <Link href="/prihlaseni?callbackUrl=/chyby-kosmeticky" className="text-navy font-semibold underline">
                      Přihlaste se
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Co získáte registrací */}
      {!unlocked && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">Co získáte registrací zdarma</h2>
              <p className="text-gray-600 text-lg">Registrace nic nestojí a otevře vám dveře do akademie.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { t: "Celý seznam 10 chyb", d: "Okamžitě odemknete zbývajících 6 chyb i s vysvětlením." },
                { t: "Vybrané kurzy zdarma", d: "Ochutnávka obsahu akademie – bez jakékoliv platby." },
                { t: "Přístup do akademie", d: "Placené kurzy si můžete kdykoliv dokoupit jednotlivě." },
              ].map((b) => (
                <div key={b.t} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-navy mb-1">{b.t}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{b.d}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/registrace?callbackUrl=/chyby-kosmeticky"
                className="inline-flex items-center justify-center gap-2 bg-navy text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-navy-light transition-all shadow-lg"
              >
                Zaregistrovat se zdarma
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
