import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice, coursePricing } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nabídka kurzů",
  description:
    "Prohlédněte si všechny kurzy Akademie Drsov. Přístup k lekcím a materiálům získáte po bezplatné registraci.",
};

export default async function NabidkaKurzuPage() {
  const [session, courses, freeLessons] = await Promise.all([
    auth(),
    prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
    prisma.lesson.findMany({
      where: { isPublished: true, isFree: true, course: { isPublished: true } },
      select: { id: true, title: true, course: { select: { title: true } } },
      orderBy: { order: "asc" },
    }),
  ]);

  const isLoggedIn = !!session?.user;
  const freeCourses = courses.filter((c) => c.isFree);


  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hlavička */}
      <section className="bg-navy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Naše kurzy</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Prohlédněte si celou nabídku. Kupujete jen to, co chcete – žádné předplatné.
          </p>
        </div>
      </section>

      {/* Upozornění na registraci (jen pro nepřihlášené) */}
      {!isLoggedIn && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="bg-white rounded-2xl border-2 border-gold/40 shadow-lg p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-bold text-navy text-lg">Přístup ke kurzům je jen po registraci</h2>
              <p className="text-gray-600 text-sm mt-0.5">
                Registrace je zdarma a hotová za minutu. Poté se dostanete k lekcím,
                materiálům, certifikátům a vybraným kurzům zdarma.
              </p>
            </div>
            <Link
              href="/registrace?callbackUrl=/kurzy"
              className="bg-gold text-navy px-6 py-3 rounded-xl font-bold hover:bg-gold-dark transition-all whitespace-nowrap flex-shrink-0"
            >
              Zaregistrovat se zdarma
            </Link>
          </div>
        </div>
      )}

      {/* Co najdete zdarma */}
      <section className="pt-14 pb-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 md:p-9">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-navy">Co po registraci získáte zdarma</h2>
                <p className="text-gray-500 text-sm">Bez jakékoliv platby, hned po vytvoření účtu.</p>
              </div>
            </div>

            <ul className="space-y-3">
              {freeCourses.map((c) => (
                <li key={c.id} className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-gray-700">
                    <strong className="text-navy">Kurz zdarma:</strong> {c.title}
                  </span>
                </li>
              ))}

              {freeLessons.map((l) => (
                <li key={l.id} className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-gray-700">
                    <strong className="text-navy">Ukázková lekce zdarma:</strong> {l.title}
                    <span className="text-gray-400"> · z kurzu {l.course.title}</span>
                  </span>
                </li>
              ))}

              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-gray-700">
                  <strong className="text-navy">Kompletní seznam 10 nejčastějších chyb kosmetičky</strong>{" "}
                  <Link href="/chyby-kosmeticky" className="text-gold font-semibold hover:text-gold-dark">(zobrazit)</Link>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-gray-700">
                  <strong className="text-navy">Přístup do členské sekce</strong> – placené kurzy si můžete kdykoliv dokoupit jednotlivě
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-gray-700">
                  <strong className="text-navy">Certifikát</strong> po dokončení každého zakoupeného kurzu
                </span>
              </li>
            </ul>

            {freeCourses.length === 0 && freeLessons.length === 0 && (
              <p className="text-xs text-gray-400 mt-5">
                Tip pro administrátora: kurz nebo lekci označíte jako „Zdarma“ v adminu a objeví se zde v seznamu.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Mřížka kurzů */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col shadow-sm">
                <div className="aspect-[16/10] bg-navy/10 relative overflow-hidden">
                  {course.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-light">
                      <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                  {/* Zámek pro nepřihlášené */}
                  {!isLoggedIn && !course.isFree && (
                    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-navy/80 flex items-center justify-center backdrop-blur">
                      <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                  )}
                  {course.isFree && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">ZDARMA</div>
                  )}
                  {!course.isFree && course.isComingSoon && (
                    <div className="absolute top-2 left-2 bg-amber-400 text-navy text-xs font-bold px-2.5 py-1 rounded-full">PŘIPRAVUJEME −50 %</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-navy text-lg mb-1.5 line-clamp-2">{course.title}</h3>
                  {course.description && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{course.description}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      {course.isFree ? (
                        <span className="text-lg font-bold text-green-600">Zdarma</span>
                      ) : (
                        <>
                          <span className="text-lg font-bold text-navy">{formatPrice(coursePricing(course).effective)}</span>
                          {(() => {
                            const p = coursePricing(course);
                            return p.strike && p.strike > p.effective ? (
                              <span className="text-sm text-gray-400 line-through">{formatPrice(p.strike)}</span>
                            ) : null;
                          })()}
                        </>
                      )}
                    </div>
                    {isLoggedIn ? (
                      <Link href={`/kurzy/${course.slug}`} className="text-gold font-semibold text-sm hover:text-gold-dark">
                        Otevřít →
                      </Link>
                    ) : (
                      <Link href={`/kurz/${course.slug}`} className="text-gold font-semibold text-sm hover:text-gold-dark">
                        Detail →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Spodní výzva */}
          {!isLoggedIn && (
            <div className="text-center mt-14">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">Chcete se dostat ke kurzům?</h2>
              <p className="text-gray-600 mb-6">Zaregistrujte se zdarma – trvá to minutu a hned uvidíte obsah zevnitř.</p>
              <Link
                href="/registrace?callbackUrl=/kurzy"
                className="inline-flex items-center justify-center gap-2 bg-navy text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-navy-light transition-all shadow-lg"
              >
                Zaregistrovat se zdarma
              </Link>
              <p className="text-gray-500 text-sm mt-3">
                Už máte účet?{" "}
                <Link href="/prihlaseni?callbackUrl=/kurzy" className="text-navy font-semibold underline">Přihlaste se</Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
