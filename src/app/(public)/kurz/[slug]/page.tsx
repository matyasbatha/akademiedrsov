import Link from "next/link";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice, coursePricing } from "@/lib/utils";
import { courseMedia } from "@/data/courseMedia";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) return { title: "Kurz" };
  return {
    title: course.title,
    description: course.description ?? undefined,
    openGraph: {
      title: course.title,
      description: course.description ?? undefined,
      images: course.coverImage ? [course.coverImage] : undefined,
    },
  };
}

export default async function VerejnyKurzPage({ params }: Props) {
  const { slug } = await params;

  // Přihlášené pošleme rovnou do členské sekce kurzu (koupě / přehrávání)
  const session = await auth();
  if (session?.user) redirect(`/kurzy/${slug}`);

  const course = await prisma.course.findUnique({
    where: { slug, isPublished: true },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
        select: { id: true, title: true },
      },
      _count: { select: { lessons: true } },
    },
  });

  if (!course) notFound();

  const isFree = course.isFree || course.price <= 0;
  const pricing = coursePricing(course);
  const media = courseMedia[course.slug] ?? {};

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-navy overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "radial-gradient(circle at 80% 30%, #c9a84c 0%, transparent 55%)" }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Link href="/nabidka-kurzu" className="text-white/60 hover:text-white text-sm mb-4 inline-block">
              ← Zpět na nabídku kurzů
            </Link>
            {course.isComingSoon && (
              <span className="inline-block bg-amber-400 text-navy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
                Připravujeme · předprodej −50 %
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5">{course.title}</h1>
            {course.description && (
              <p className="text-lg text-white/85 mb-6 leading-relaxed">{course.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm mb-8">
              <span>{course._count.lessons} lekcí</span>
              <span>·</span>
              <span>Certifikát po dokončení</span>
              <span>·</span>
              <span>{course.accessMonths} měsíců přístup</span>
            </div>
            <div className="flex items-center gap-3">
              {isFree ? (
                <span className="text-3xl font-bold text-green-400">Zdarma</span>
              ) : (
                <>
                  <span className="text-3xl font-bold text-gold">{formatPrice(pricing.effective)}</span>
                  {pricing.strike && pricing.strike > pricing.effective && (
                    <span className="text-white/50 line-through text-lg">{formatPrice(pricing.strike)}</span>
                  )}
                  {pricing.isPresale && (
                    <span className="bg-amber-400 text-navy text-xs font-bold px-2 py-1 rounded-full">−50 %</span>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl bg-navy-light">
            {course.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ukázka ze školení (YouTube) */}
      {media.youtubeId && (
        <section className="py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-gold font-semibold text-sm uppercase tracking-widest">Ukázka zdarma</span>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mt-2">Ukázka ze školení</h2>
            </div>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-black" style={{ aspectRatio: "16 / 9" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${media.youtubeId}${media.youtubeStart ? `?start=${media.youtubeStart}` : ""}`}
                title="Ukázka ze školení"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* O čem kurz je + obsah */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">O čem kurz je</h2>
          <p className="text-gray-600 leading-relaxed mb-10">
            {course.description ??
              "Profesionální online kurz s video lekcemi, studijními materiály a certifikátem po dokončení."}
          </p>

          {course.lessons.length > 0 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-5">Obsah kurzu</h2>
              <div className="space-y-2 mb-4">
                {course.lessons.map((l, i) => (
                  <div key={l.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <span className="w-7 h-7 rounded-full bg-navy/10 text-navy text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{l.title}</span>
                    <svg className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 mb-2">Obsah lekcí se odemkne po přihlášení do členské sekce.</p>
            </>
          )}
        </div>
      </section>

      {/* Ukázky z kurzu (galerie) */}
      {media.gallery && media.gallery.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-8 text-center">Ukázky z kurzu</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {media.gallery.map((src, i) => (
                <div key={src} className="aspect-[1/1] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Ukázka ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Jak kurz odemknout */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border-2 border-gold/40 shadow-lg p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
              {course.isComingSoon ? "Předprodej se slevou 50 %" : "Jak kurz odemknout"}
            </h2>

            {isFree ? (
              <p className="text-gray-600 leading-relaxed mb-6">
                Tento kurz je <strong className="text-green-600">zdarma</strong>. Stačí se
                bezplatně zaregistrovat do členské sekce a získáte okamžitý přístup ke všem
                lekcím, materiálům i certifikátu.
              </p>
            ) : course.isComingSoon ? (
              <p className="text-gray-600 leading-relaxed mb-6">
                Tento kurz <strong className="text-amber-600">právě připravujeme</strong>. Teď ho
                můžete koupit v <strong className="text-navy">předprodeji se slevou 50 % za{" "}
                {formatPrice(pricing.effective)}</strong> místo {formatPrice(pricing.full)}. Přístup
                získáte hned, jakmile kurz spustíme. Nejprve se zdarma zaregistrujte.
              </p>
            ) : (
              <p className="text-gray-600 leading-relaxed mb-6">
                Nejprve se <strong className="text-navy">zdarma zaregistrujte</strong> do členské
                sekce. Kurz si pak odemknete <strong className="text-navy">jednorázovým nákupem
                za {formatPrice(course.price)}</strong> – žádné předplatné, přístup na{" "}
                {course.accessMonths} měsíců a certifikát po dokončení.
              </p>
            )}

            <Link
              href={`/registrace?callbackUrl=/kurzy/${course.slug}`}
              className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-dark transition-all shadow-lg"
            >
              {isFree
                ? "Zaregistrovat se a získat zdarma"
                : course.isComingSoon
                ? "Koupit v předprodeji −50 %"
                : "Zaregistrovat se a pokračovat"}
            </Link>

            <p className="text-gray-500 text-sm mt-4">
              Registrace je zdarma. Navíc vám budeme <strong className="text-navy">posílat informace
              o nových kurzech</strong> a akcích – ať vám nic neuteče.
            </p>
            <p className="text-gray-400 text-sm mt-3">
              Už máte účet?{" "}
              <Link href={`/prihlaseni?callbackUrl=/kurzy/${course.slug}`} className="text-navy font-semibold underline">
                Přihlaste se
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
