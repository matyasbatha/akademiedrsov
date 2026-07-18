import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { hasCourseAccess, getActiveAccessCourseIds } from "@/lib/access";
import { Metadata } from "next";
import VideoPlayer from "@/components/member/VideoPlayer";
import CourseSaleCard from "@/components/member/CourseSaleCard";
import LessonListCollapsible from "@/components/member/LessonListCollapsible";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { slug } });
  return { title: lesson?.title ?? "Lekce" };
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");

  const lesson = await prisma.lesson.findUnique({
    where: { slug, isPublished: true },
    include: {
      course: true,
      downloads: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!lesson) notFound();

  const courseAccess = await hasCourseAccess(
    session.user.id,
    lesson.course,
    session.user.role
  );
  const canAccess = courseAccess || lesson.isFree;

  const allLessons = await prisma.lesson.findMany({
    where: { courseId: lesson.courseId, isPublished: true },
    orderBy: { order: "asc" },
    select: { id: true, slug: true, title: true, order: true },
  });

  const currentIndex = allLessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const isLastLesson = !nextLesson;

  // Materiály na úrovni kurzu (skripta, kontraindikace) – ukážeme po dokončení
  const courseDownloads = await prisma.download.findMany({
    where: { courseId: lesson.courseId },
    orderBy: { createdAt: "asc" },
  });

  // Po dokončení nabídneme další kurzy k zakoupení (které student nevlastní)
  let recommendedCourses: {
    id: string;
    slug: string;
    title: string;
    coverImage: string | null;
    price: number;
    originalPrice: number | null;
    isComingSoon: boolean;
  }[] = [];
  if (isLastLesson) {
    const ownedIds = await getActiveAccessCourseIds(session.user.id);
    const others = await prisma.course.findMany({
      where: { isPublished: true, isFree: false, id: { not: lesson.courseId } },
      orderBy: { order: "asc" },
    });
    recommendedCourses = others.filter((c) => !ownedIds.has(c.id)).slice(0, 6);
  }

  // Hlavička (breadcrumb + název + popis) – použije se 2× (mobil nad videem, desktop vedle videa)
  const headerBlock = (
    <>
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
        <Link href="/kurzy" className="hover:text-navy transition-colors">Kurzy</Link>
        <span>/</span>
        <Link href={`/kurzy/${lesson.course.slug}`} className="hover:text-navy transition-colors">{lesson.course.title}</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium truncate max-w-[160px]">{lesson.title}</span>
      </nav>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full overflow-hidden">
        <p className="text-xs font-semibold text-gold uppercase tracking-wide mb-1">
          Lekce {currentIndex + 1} z {allLessons.length}
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-navy leading-tight mb-2 [overflow-wrap:anywhere]">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-gray-600 text-sm leading-relaxed [overflow-wrap:anywhere]">{lesson.description}</p>
        )}
      </div>
    </>
  );

  return (
    <div className="overflow-x-hidden">

      {/* Hlavička nad videem – pouze mobil */}
      <div className="lg:hidden mb-5 space-y-3">{headerBlock}</div>

      {/* ─── Video + obsah ─────────────────────────────────── */}
      <div className="lg:flex lg:gap-8 lg:items-start">

      {/* ─── Video sloupec ─────────────────────────────────── */}
      <div className="lg:flex-shrink-0 lg:sticky lg:top-4">
        {/*
          Mobil: záporné marginy = full-bleed přes celou šířku obrazovky
          Desktop: výška = viewport − offset, šířka se dopočítá z aspect-ratio 9:16
        */}
        <div className="
          -mx-6 md:-mx-8
          aspect-[9/16] bg-black overflow-hidden
          lg:mx-0
          lg:h-[calc(100svh-96px)] lg:w-auto
          lg:rounded-2xl lg:shadow-2xl
        ">
          {!canAccess ? (
            /* Paywall – video zamčené, uživatel nemá členství */
            <div className="w-full h-full flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-navy to-gray-900 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-lg leading-tight mb-1">Tato lekce je zamčená</p>
                <p className="text-white/50 text-sm">Kupte si kurz a získejte přístup ke všem lekcím</p>
              </div>
              <Link
                href={`/kurzy/${lesson.course.slug}`}
                className="mt-2 px-6 py-3 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors"
              >
                Koupit kurz
              </Link>
            </div>
          ) : lesson.videoUrl ? (
            <VideoPlayer url={lesson.videoUrl} title={lesson.title} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/40 text-sm">
              Video není k dispozici
            </div>
          )}
        </div>

        {/* Navigace předchozí/další – pouze desktop */}
        <div className="hidden lg:flex items-center justify-between mt-3 gap-2">
          {prevLesson ? (
            <Link
              href={`/lekce/${prevLesson.slug}`}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-navy hover:border-navy transition-all text-xs font-medium flex-1 min-w-0"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="truncate">{prevLesson.title}</span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {nextLesson && (
            <Link
              href={`/lekce/${nextLesson.slug}`}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy text-white hover:bg-navy-light transition-all text-xs font-medium flex-1 min-w-0 justify-end"
            >
              <span className="truncate">{nextLesson.title}</span>
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* ─── Obsah sloupec ─────────────────────────────────── */}
      <div className="min-w-0 w-full flex-1 space-y-4 pt-5 lg:pt-0 lg:max-w-lg">

        {/* Hlavička vedle videa – pouze desktop */}
        <div className="hidden lg:block space-y-3">{headerBlock}</div>

        {/* Rychlé pokračování na další lekci – pouze mobil (desktop má navigaci pod videem) */}
        {canAccess && nextLesson && (
          <Link
            href={`/lekce/${nextLesson.slug}`}
            className="lg:hidden flex items-center justify-between gap-3 bg-navy text-white rounded-2xl p-4 shadow-sm active:opacity-90 hover:bg-navy-light transition-all"
          >
            <span className="min-w-0">
              <span className="block text-xs text-white/60">Pokračovat na další lekci</span>
              <span className="block font-semibold leading-tight truncate">{nextLesson.title}</span>
            </span>
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        )}

        {/* Materiály ke stažení – pouze pro členy */}
        {canAccess && lesson.downloads.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Materiály ke stažení
            </h2>
            <div className="space-y-2">
              {lesson.downloads.map((dl) => (
                <a
                  key={dl.id}
                  href={dl.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors group border border-gray-100"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-navy leading-tight">
                    {dl.title}
                  </span>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-navy flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Po dokončení kurzu – materiály + certifikát (jen poslední lekce) */}
        {canAccess && isLastLesson && (
          <div className="bg-gradient-to-br from-navy to-navy-light rounded-2xl p-6 shadow-sm text-white">
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold">Dokončili jste kurz!</h2>
              <p className="text-white/70 text-sm mt-1">
                Stáhněte si materiály a vygenerujte certifikát na své jméno.
              </p>
            </div>

            {courseDownloads.length > 0 && (
              <div className="space-y-2 mb-4">
                {courseDownloads.map((dl) => (
                  <a
                    key={dl.id}
                    href={dl.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/10 rounded-xl p-3 hover:bg-white/15 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="flex-1 text-sm font-medium leading-tight">{dl.title}</span>
                    <svg className="w-4 h-4 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                ))}
              </div>
            )}

            <a
              href={`/api/certificate/${lesson.course.id}`}
              className="flex items-center justify-center gap-2 bg-gold text-navy px-6 py-3.5 rounded-xl font-bold hover:bg-gold-light transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Vygenerovat certifikát
            </a>
            <p className="text-white/50 text-xs text-center mt-2">
              Certifikát se vytvoří na jméno uvedené ve vašem účtu.
            </p>
          </div>
        )}

        {/* Seznam lekcí kurzu */}
        <LessonListCollapsible
          lessons={allLessons}
          currentSlug={slug}
          courseTitle={lesson.course.title}
        />

        {/* Zpět na předchozí lekci – pouze mobil (další lekce je nahoře pod videem) */}
        {prevLesson && (
          <Link
            href={`/lekce/${prevLesson.slug}`}
            className="lg:hidden flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-white active:bg-gray-50 transition-all mb-6"
          >
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="min-w-0">
              <span className="block text-xs text-gray-400">Předchozí lekce</span>
              <span className="block text-sm font-medium text-gray-800 leading-tight line-clamp-1">{prevLesson.title}</span>
            </span>
          </Link>
        )}
      </div>
      </div>

      {/* Další kurzy k zakoupení – po poslední lekci */}
      {isLastLesson && recommendedCourses.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            Další kurzy k zakoupení
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {recommendedCourses.map((c) => (
              <CourseSaleCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
