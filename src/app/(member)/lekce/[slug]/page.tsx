import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isActiveMembership } from "@/lib/stripe";
import { Metadata } from "next";
import VideoPlayer from "@/components/member/VideoPlayer";
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

  const [lesson, membership] = await Promise.all([
    prisma.lesson.findUnique({
      where: { slug, isPublished: true },
      include: {
        course: true,
        downloads: { orderBy: { createdAt: "asc" } },
      },
    }),
    prisma.membership.findUnique({ where: { userId: session.user.id } }),
  ]);

  if (!lesson) notFound();

  const isActive = isActiveMembership(membership?.status);
  const canAccess =
    isActive || lesson.isFree || lesson.course.isFree || session.user.role === "ADMIN";

  const allLessons = await prisma.lesson.findMany({
    where: { courseId: lesson.courseId, isPublished: true },
    orderBy: { order: "asc" },
    select: { id: true, slug: true, title: true, order: true },
  });

  const currentIndex = allLessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    /*
     * Na mobilu: video jde přes celou šířku (záporné marginy negují padding layoutu).
     * Na desktopu (lg+): flex layout – video zabírá výšku viewportu (šířka auto z 9:16),
     * vpravo se skládá obsah.
     * overflow-x-hidden zabraňuje horizontálnímu scrollu na mobilu.
     */
    <div className="overflow-x-hidden lg:flex lg:gap-8 lg:items-start">

      {/* ─── Video sloupec ─────────────────────────────────── */}
      <div className="lg:flex-shrink-0 lg:sticky lg:top-4">
        {/*
          Mobil: záporné marginy = full-bleed přes celou šířku obrazovky
          Desktop: výška = viewport − offset, šířka se dopočítá z aspect-ratio 9:16
        */}
        <div className="
          -mx-6 -mt-6 md:-mx-8 md:-mt-8
          aspect-[9/16] bg-black overflow-hidden
          lg:mx-0 lg:mt-0
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
                <p className="text-white font-semibold text-lg leading-tight mb-1">Tato lekce je pro členy</p>
                <p className="text-white/50 text-sm">Aktivuj členství a získej přístup ke všem lekcím</p>
              </div>
              <Link
                href="/clenstvi"
                className="mt-2 px-6 py-3 bg-gold text-navy font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors"
              >
                Aktivovat členství
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

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
          <Link href="/kurzy" className="hover:text-navy transition-colors">
            Kurzy
          </Link>
          <span>/</span>
          <Link href={`/kurzy/${lesson.course.slug}`} className="hover:text-navy transition-colors">
            {lesson.course.title}
          </Link>
          <span>/</span>
          <span className="text-gray-600 font-medium truncate max-w-[160px]">{lesson.title}</span>
        </nav>

        {/* Název + popis */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full overflow-hidden">
          <h1 className="text-xl font-bold text-navy leading-tight mb-2 [overflow-wrap:anywhere]">{lesson.title}</h1>
          {lesson.description && (
            <p className="text-gray-600 text-sm leading-relaxed [overflow-wrap:anywhere]">{lesson.description}</p>
          )}
        </div>

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

        {/* Seznam lekcí kurzu */}
        <LessonListCollapsible
          lessons={allLessons}
          currentSlug={slug}
          courseTitle={lesson.course.title}
        />

        {/* Navigace předchozí/další – pouze mobil */}
        <div className="lg:hidden grid grid-cols-2 gap-3 pb-6">
          {prevLesson ? (
            <Link
              href={`/lekce/${prevLesson.slug}`}
              className="flex flex-col items-start gap-1 p-4 rounded-2xl border border-gray-200 bg-white active:bg-gray-50 transition-all"
            >
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Předchozí
              </span>
              <span className="text-sm font-medium text-gray-800 leading-tight line-clamp-2">{prevLesson.title}</span>
            </Link>
          ) : (
            <div />
          )}
          {nextLesson ? (
            <Link
              href={`/lekce/${nextLesson.slug}`}
              className="flex flex-col items-end gap-1 p-4 rounded-2xl bg-navy text-white active:opacity-90 transition-all col-start-2"
            >
              <span className="text-xs text-white/60 flex items-center gap-1">
                Další
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span className="text-sm font-medium leading-tight line-clamp-2 text-right">{nextLesson.title}</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
