import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getActiveAccessCourseIds } from "@/lib/access";
import { formatPrice, coursePricing } from "@/lib/utils";
import BuyCourseButton from "@/components/member/BuyCourseButton";
import Icon from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Kurzy" };

export default async function KurzyPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");

  const isAdmin = session.user.role === "ADMIN";

  const [courses, ownedIds] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      include: { _count: { select: { lessons: true } } },
      orderBy: { order: "asc" },
    }),
    getActiveAccessCourseIds(session.user.id),
  ]);

  const accessible = (c: { id: string; isFree: boolean }) =>
    isAdmin || c.isFree || ownedIds.has(c.id);

  const myCourses = courses.filter(accessible);
  const availableCourses = courses.filter((c) => !accessible(c));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kurzy</h1>
        <p className="text-gray-500 mt-1">
          Kupte si přístup ke konkrétnímu kurzu. Po zakoupení máte přístup 6 měsíců.
        </p>
      </div>

      {/* Moje kurzy */}
      {myCourses.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Moje kurzy
          </h2>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none]">
            {myCourses.map((course) => (
              <CourseCard key={course.id} course={course} owned />
            ))}
          </div>
        </div>
      )}

      {/* Nabídka kurzů */}
      {availableCourses.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            {myCourses.length > 0 ? "Další kurzy" : "Nabídka kurzů"}
          </h2>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none]">
            {availableCourses.map((course) => (
              <CourseCard key={course.id} course={course} owned={false} />
            ))}
          </div>
        </div>
      )}

      {courses.length === 0 && (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center mx-auto mb-4">
            <Icon name="book" className="w-7 h-7 text-navy/40" />
          </div>
          <p className="text-gray-500 text-lg">Zatím žádné kurzy. Brzy přibydou!</p>
        </div>
      )}
    </div>
  );
}

type CardCourse = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  isFree: boolean;
  isComingSoon: boolean;
  price: number;
  originalPrice: number | null;
  _count: { lessons: number };
};

function CourseCard({ course, owned }: { course: CardCourse; owned: boolean }) {
  const lessonsLabel = `${course._count.lessons} ${
    course._count.lessons === 1 ? "lekce" : course._count.lessons < 5 ? "lekce" : "lekcí"
  }`;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:border-gold/30 flex flex-col shrink-0 w-[47%] snap-start md:w-auto">
      <Link href={`/kurzy/${course.slug}`} className="block">
        <div className="aspect-[16/9] bg-navy/10 relative overflow-hidden">
          {course.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
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
          {course.isFree && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              ZDARMA
            </div>
          )}
          {owned && !course.isFree && (
            <div className="absolute top-2 left-2 bg-navy text-white text-xs font-bold px-2.5 py-1 rounded-full">
              ZAKOUPENO
            </div>
          )}
          {!owned && course.isComingSoon && !course.isFree && (
            <div className="absolute top-2 left-2 bg-amber-400 text-navy text-xs font-bold px-2.5 py-1 rounded-full">
              PŘIPRAVUJEME −50 %
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link href={`/kurzy/${course.slug}`}>
          <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-navy transition-colors line-clamp-2">
            {course.title}
          </h3>
        </Link>
        {course.description && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{course.description}</p>
        )}
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {lessonsLabel}
        </div>

        <div className="mt-auto">
          {owned ? (
            <Link
              href={`/kurzy/${course.slug}`}
              className="block w-full text-center bg-navy text-white py-2.5 rounded-xl font-semibold hover:bg-navy-light transition-all"
            >
              Otevřít kurz →
            </Link>
          ) : (
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-navy">{formatPrice(coursePricing(course).effective)}</span>
                {(() => {
                  const p = coursePricing(course);
                  return p.strike && p.strike > p.effective ? (
                    <span className="text-sm text-gray-400 line-through">{formatPrice(p.strike)}</span>
                  ) : null;
                })()}
              </div>
              <BuyCourseButton
                courseId={course.id}
                courseSlug={course.slug}
                className="bg-gold text-navy px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gold-dark whitespace-nowrap text-center"
              >
                {course.isComingSoon ? "Předprodej" : "Koupit"}
              </BuyCourseButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
