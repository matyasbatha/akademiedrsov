import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { isActiveMembership } from "@/lib/stripe";
import ManageSubscriptionButton from "@/components/member/ManageSubscriptionButton";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");

  const [membership, courses] = await Promise.all([
    prisma.membership.findUnique({ where: { userId: session.user.id } }),
    prisma.course.findMany({
      where: { isPublished: true },
      include: { _count: { select: { lessons: true } } },
      orderBy: { order: "asc" },
      take: 6,
    }),
  ]);

  const isActive = isActiveMembership(membership?.status);
  const canAccess = isActive || session.user.role === "ADMIN";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Vítejte, {session.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Zde je přehled vašeho členství a kurzů.</p>
      </div>

      {/* Membership status */}
      <div
        className={`rounded-2xl p-6 mb-8 ${
          isActive
            ? "bg-gradient-to-r from-navy to-navy-light text-white"
            : "bg-amber-50 border-2 border-amber-200"
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isActive ? "bg-green-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-green-300" : "text-amber-700"
                }`}
              >
                {isActive ? "Aktivní členství" : "Neaktivní členství"}
              </span>
            </div>
            <h2
              className={`text-lg font-bold ${
                isActive ? "text-white" : "text-amber-900"
              }`}
            >
              {isActive
                ? membership?.stripePriceId?.includes("yearly")
                  ? "Roční členství"
                  : "Měsíční členství"
                : "Nemáte aktivní členství"}
            </h2>
            {membership?.currentPeriodEnd && isActive && (
              <p className="text-white/60 text-sm mt-1">
                {membership.cancelAtPeriodEnd
                  ? `Vyprší ${formatDate(membership.currentPeriodEnd)}`
                  : `Obnoví se ${formatDate(membership.currentPeriodEnd)}`}
              </p>
            )}
          </div>
          <div>
            {isActive ? (
              <ManageSubscriptionButton />
            ) : (
              <Link
                href="/clenstvi"
                className="inline-flex items-center gap-2 bg-gold text-navy px-6 py-2.5 rounded-xl font-bold hover:bg-gold-dark transition-all"
              >
                Aktivovat členství
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Kurzy */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {canAccess ? "Vaše kurzy" : "Dostupné kurzy"}
          </h2>
          <Link
            href="/kurzy"
            className="text-sm text-navy font-medium hover:text-gold transition-colors"
          >
            Zobrazit vše →
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-gray-500">Zatím žádné kurzy. Brzy přibydou!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => {
              const accessible =
                canAccess || course.isFree;
              return (
                <Link
                  key={course.id}
                  href={accessible ? `/kurzy/${course.slug}` : "/clenstvi"}
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
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {course.isFree && !isActive && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        ZDARMA
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-navy transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                        {course.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course._count.lessons} {course._count.lessons === 1 ? "lekce" : course._count.lessons < 5 ? "lekce" : "lekcí"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
