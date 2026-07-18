import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDate, formatPrice, coursePricing } from "@/lib/utils";
import { getMyCourses } from "@/lib/access";
import BuyCourseButton from "@/components/member/BuyCourseButton";
import Icon from "@/components/ui/Icon";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");

  const isAdmin = session.user.role === "ADMIN";

  const [myAccesses, allCourses] = await Promise.all([
    getMyCourses(session.user.id),
    prisma.course.findMany({
      where: { isPublished: true },
      include: { _count: { select: { lessons: true } } },
      orderBy: { order: "asc" },
    }),
  ]);

  const ownedIds = new Set(myAccesses.map((a) => a.courseId));
  // Admin vidí vše jako „moje"; ostatní jen zakoupené/zdarma
  const myCourses = isAdmin
    ? allCourses.map((c) => ({ course: c, expiresAt: null as Date | null }))
    : [
        ...myAccesses.map((a) => ({ course: a.course, expiresAt: a.expiresAt })),
        ...allCourses
          .filter((c) => c.isFree && !ownedIds.has(c.id))
          .map((c) => ({ course: c, expiresAt: null as Date | null })),
      ];

  const availableCourses = isAdmin
    ? []
    : allCourses.filter((c) => !c.isFree && !ownedIds.has(c.id)).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Vítejte, {session.user.name?.split(" ")[0] ?? ""}
        </h1>
        <p className="text-gray-500 mt-1">Přehled vašich kurzů a studia.</p>
      </div>

      {/* Moje kurzy */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Moje kurzy</h2>
          <Link href="/kurzy" className="text-sm text-navy font-medium hover:text-gold transition-colors">
            Všechny kurzy →
          </Link>
        </div>

        {myCourses.length === 0 ? (
          <div className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-8 text-center text-white">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="cap" className="w-7 h-7 text-gold" />
            </div>
            <p className="font-bold text-lg mb-1">Zatím nemáte žádný kurz</p>
            <p className="text-white/70 text-sm mb-5">Vyberte si z naší nabídky a začněte studovat.</p>
            <Link
              href="/kurzy"
              className="inline-flex items-center gap-2 bg-gold text-navy px-6 py-3 rounded-xl font-bold hover:bg-gold-dark transition-all"
            >
              Prohlédnout kurzy
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myCourses.map(({ course, expiresAt }) => (
              <Link
                key={course.id}
                href={`/kurzy/${course.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:border-gold/30"
              >
                <div className="aspect-video bg-navy/10 relative overflow-hidden">
                  {course.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-light">
                      <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-navy transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                    <span>{course._count.lessons} lekcí</span>
                    {expiresAt && <span>Přístup do {formatDate(expiresAt)}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Tipy na další kurzy */}
      {availableCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Mohlo by vás zajímat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
                <Link href={`/kurzy/${course.slug}`} className="aspect-video bg-navy/10 relative overflow-hidden block">
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
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/kurzy/${course.slug}`}>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-navy transition-colors">{course.title}</h3>
                  </Link>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="font-bold text-navy">{formatPrice(coursePricing(course).effective)}</span>
                    <BuyCourseButton
                      courseId={course.id}
                      courseSlug={course.slug}
                      className="bg-gold text-navy px-4 py-2 rounded-xl font-bold text-sm hover:bg-gold-dark"
                    >
                      {course.isComingSoon ? "Předprodej" : "Koupit"}
                    </BuyCourseButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
