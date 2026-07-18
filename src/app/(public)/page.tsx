import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const benefits = [
  { icon: "🎬", title: "Video kurzy", desc: "Profesionální video lekce s výkladem krok za krokem" },
  { icon: "📄", title: "Skripta a PDF", desc: "Kompletní studijní materiály ke stažení u každého kurzu" },
  { icon: "🏆", title: "Certifikáty", desc: "Po dokončení kurzu získáte certifikát se svým jménem" },
  { icon: "⏱️", title: "6 měsíců přístup", desc: "Ke kurzu se vracíte, kdykoliv potřebujete" },
  { icon: "📱", title: "Studujte odkudkoliv", desc: "Počítač, tablet i mobil – obsah je responzivní" },
  { icon: "🔬", title: "20+ let praxe", desc: "Know-how od odborníků ze studia Body Factory" },
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
                href="/kurzy"
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
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Naše kurzy</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Vyberte si specializaci a začněte studovat ještě dnes.
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
            <div className="text-center mt-10">
              <Link href="/kurzy" className="inline-flex items-center gap-2 text-gold font-semibold hover:text-gold-dark transition-colors">
                Zobrazit všechny kurzy →
              </Link>
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
              <div key={b.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all group">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-navy text-lg mb-2 group-hover:text-gold transition-colors">{b.title}</h3>
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
