import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isActiveMembership } from "@/lib/stripe";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  return { title: course?.title ?? "Kurz" };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");

  const [course, membership] = await Promise.all([
    prisma.course.findUnique({
      where: { slug, isPublished: true },
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { order: "asc" },
        },
        downloads: { orderBy: { createdAt: "asc" } },
      },
    }),
    prisma.membership.findUnique({ where: { userId: session.user.id } }),
  ]);

  if (!course) notFound();

  const isActive = isActiveMembership(membership?.status);
  const canAccess = isActive || course.isFree || session.user.role === "ADMIN";

  // canAccess = false znamená, že uživatel vidí kurz, ale lekce jsou zamčené

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/kurzy" className="hover:text-navy transition-colors">
          Kurzy
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{course.title}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6 shadow-sm">
        {course.coverImage && (
          <div className="aspect-video bg-navy overflow-hidden">
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-navy mb-3">{course.title}</h1>
          {course.description && (
            <p className="text-gray-600 leading-relaxed">{course.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {course.lessons.length} lekcí
            </span>
            {course.downloads.length > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                {course.downloads.length} souborů
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Paywall banner pro nezaplacené */}
      {!canAccess && (
        <div className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-navy" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg">Tento kurz vyžaduje členství</p>
              <p className="text-white/70 text-sm">Odemkněte přístup ke všem kurzům za 999 Kč/měsíc</p>
            </div>
          </div>
          <Link
            href="/clenstvi"
            className="inline-flex items-center gap-2 bg-gold text-navy px-6 py-3 rounded-xl font-bold hover:bg-gold-dark transition-all mt-2"
          >
            Aktivovat členství
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      )}

      {/* Lekce */}
      {course.lessons.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Lekce</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {course.lessons.map((lesson, index) => {
              const lessonAccessible = canAccess || lesson.isFree;
              return lessonAccessible ? (
                <Link
                  key={lesson.id}
                  href={`/lekce/${lesson.slug}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group"
                >
                  <div className="w-8 h-8 rounded-full bg-navy/10 text-navy flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:bg-navy group-hover:text-white transition-colors">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 group-hover:text-navy transition-colors">
                      {lesson.title}
                    </p>
                    {lesson.description && (
                      <p className="text-sm text-gray-500 truncate">{lesson.description}</p>
                    )}
                  </div>
                  {lesson.videoUrl && (
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-navy transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-navy transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 opacity-60 cursor-not-allowed"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-500">{lesson.title}</p>
                    {lesson.description && (
                      <p className="text-sm text-gray-400 truncate">{lesson.description}</p>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Certifikát – pouze pro uživatele s přístupem */}
      {canAccess && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white text-lg">Certifikát o absolvování</p>
                <p className="text-white/60 text-sm">Stáhněte si certifikát se svým jménem a názvem kurzu</p>
              </div>
            </div>
            <a
              href={`/api/certificate/${course.id}`}
              className="flex items-center gap-2 bg-gold text-navy px-5 py-2.5 rounded-xl font-bold hover:bg-gold-light transition-all whitespace-nowrap flex-shrink-0 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Generovat certifikát
            </a>
          </div>
        </div>
      )}

      {/* Stažení */}
      {course.downloads.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Materiály ke stažení</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {course.downloads.map((dl) => (
              <a
                key={dl.id}
                href={dl.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 group-hover:text-navy transition-colors">
                    {dl.title}
                  </p>
                  <p className="text-xs text-gray-400 uppercase">{dl.type}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-navy transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
