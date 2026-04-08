import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isActiveMembership } from "@/lib/stripe";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Kurzy" };

export default async function KurzyPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");

  const [membership, courses] = await Promise.all([
    prisma.membership.findUnique({ where: { userId: session.user.id } }),
    prisma.course.findMany({
      where: { isPublished: true },
      include: { _count: { select: { lessons: true } } },
      orderBy: { order: "asc" },
    }),
  ]);

  const isActive = isActiveMembership(membership?.status);
  const canAccessAll = isActive || session.user.role === "ADMIN";

  const freeCourses = courses.filter((c) => c.isFree);
  const paidCourses = courses.filter((c) => !c.isFree);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Všechny kurzy</h1>
        <p className="text-gray-500 mt-1">
          {canAccessAll
            ? "Máte přístup ke všem kurzům."
            : "Zdarma kurzy jsou přístupné ihned. Pro plný přístup aktivujte členství."}
        </p>
      </div>

      {freeCourses.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Zdarma kurzy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {freeCourses.map((course) => (
              <CourseCard key={course.id} course={course} accessible={true} />
            ))}
          </div>
        </div>
      )}

      {paidCourses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              Prémiové kurzy
            </h2>
            {!canAccessAll && (
              <Link
                href="/clenstvi"
                className="text-sm text-gold font-semibold hover:text-gold-dark transition-colors"
              >
                Aktivovat členství →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paidCourses.map((course) => (
              <CourseCard key={course.id} course={course} accessible={canAccessAll} />
            ))}
          </div>
        </div>
      )}

      {courses.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-500 text-lg">Zatím žádné kurzy. Brzy přibydou!</p>
        </div>
      )}
    </div>
  );
}

function CourseCard({
  course,
  accessible,
}: {
  course: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    coverImage: string | null;
    isFree: boolean;
    _count: { lessons: number };
  };
  accessible: boolean;
}) {
  return (
    <Link
      href={`/kurzy/${course.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:border-gold/30"
    >
      <div className="aspect-video bg-navy/10 relative overflow-hidden">
        {course.coverImage ? (
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-light">
            <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        {!accessible && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white/90 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-navy font-semibold text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Členský obsah
            </div>
          </div>
        )}
        {course.isFree && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            ZDARMA
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-navy transition-colors line-clamp-2">
          {course.title}
        </h3>
        {course.description && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{course.description}</p>
        )}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {course._count.lessons} {course._count.lessons === 1 ? "lekce" : course._count.lessons < 5 ? "lekce" : "lekcí"}
        </div>
      </div>
    </Link>
  );
}
