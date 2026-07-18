import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const benefits = [
  {
    // video / přehrávání
    icon: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z",
    title: "Video kurzy",
    desc: "Profesionální video lekce s výkladem krok za krokem",
  },
  {
    // dokument
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
    title: "Skripta a PDF",
    desc: "Kompletní studijní materiály ke stažení u každého kurzu",
  },
  {
    // certifikát / odznak
    icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
    title: "Certifikáty",
    desc: "Po dokončení kurzu získáte certifikát se svým jménem",
  },
  {
    // hodiny / čas
    icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "6 měsíců přístup",
    desc: "Ke kurzu se vracíte, kdykoliv potřebujete",
  },
  {
    // zařízení / mobil
    icon: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
    title: "Studujte odkudkoliv",
    desc: "Počítač, tablet i mobil – obsah je responzivní",
  },
  {
    // odbornost / akademie
    icon: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
    title: "20+ let praxe",
    desc: "Know-how od odborníků ze studia Body Factory",
  },
];

const faqs = [
  { q: "Jak nákup kurzu funguje?", a: "Zaregistrujete se, vyberete kurz a zaplatíte kartou. Ihned po platbě získáte přístup ke všem lekcím a materiálům daného kurzu." },
  { q: "Jak dlouho mám ke kurzu přístup?", a: "Ke každému zakoupenému kurzu máte přístup 6 měsíců od nákupu. Certifikát a historie objednávek vám zůstávají i poté." },
  { q: "Platím jednorázově, nebo měsíčně?", a: "Jednorázově za konkrétní kurz. Žádné předplatné, žádné opakované platby." },
  { q: "Dostanu certifikát?", a: "Ano, po splnění podmínek kurzu si vygenerujete PDF certifikát se svým jménem a názvem kurzu." },
  { q: "Na jakých zařízeních kurzy fungují?", a: "Na všech moderních zařízeních – počítač, tablet i mobil." },
];

export default async function HomePage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    take: 6,
  });

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
              Online kurzy estetické kosmetiky – kupte si přístup ke konkrétnímu kurzu,
              studujte ve svém tempu a získejte certifikát. Bez předplatného.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/nabidka-kurzu"
                className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl"
              >
                Prohlédnout kurzy
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/registrace"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Vytvořit účet
              </Link>
            </div>
            <p className="text-white/50 text-sm mt-4">
              Jednorázová platba · Okamžitý přístup · Certifikát
            </p>
          </div>
        </div>
      </section>

      {/* Kurzy */}
      {courses.length > 0 && (
        <section id="kurzy" className="py-20 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Naše kurzy</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Zaregistrujte se zdarma, prohlédněte si obsah kurzů a koupí získáte
                přístup k lekcím, materiálům i certifikátu.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/prihlaseni?callbackUrl=/kurzy/${course.slug}`}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-gold/40 hover:shadow-xl transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-navy/10">
                    {course.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-light">
                        <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="font-bold text-navy text-lg leading-snug mb-2 group-hover:text-gold transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{course.description}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        {course.isFree ? (
                          <span className="text-xl font-bold text-green-600">Zdarma</span>
                        ) : (
                          <>
                            <span className="text-xl font-bold text-navy">{formatPrice(course.price)}</span>
                            {course.originalPrice && course.originalPrice > course.price && (
                              <span className="text-sm text-gray-400 line-through">{formatPrice(course.originalPrice)}</span>
                            )}
                          </>
                        )}
                      </div>
                      <span className="text-gold font-semibold text-sm group-hover:translate-x-1 transition-transform">Detail →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/registrace"
                className="inline-flex items-center justify-center gap-2 bg-navy text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-navy-light transition-all shadow-lg"
              >
                Zaregistrovat se zdarma a podívat se
              </Link>
              <p className="text-gray-500 text-sm mt-3">Registrace je zdarma · platíte jen za kurz, který si vyberete</p>
            </div>
          </div>
        </section>
      )}

      {/* Co získáte */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Co s kurzem získáte</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-gold/40 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center mb-5 group-hover:bg-gold transition-colors">
                  <svg className="w-6 h-6 text-gold group-hover:text-navy transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={b.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-navy text-lg mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy text-center mb-12">Časté otázky</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="bg-gray-50 rounded-xl border border-gray-100 group">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-navy list-none">
                  {faq.q}
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Připraveni začít?</h2>
          <p className="text-white/70 text-lg mb-8">Vytvořte si účet a vyberte si svůj první kurz.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registrace" className="inline-flex items-center justify-center bg-gold text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-dark transition-all shadow-lg">
              Vytvořit účet
            </Link>
            <Link href="/kurzy" className="inline-flex items-center justify-center border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Prohlédnout kurzy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
