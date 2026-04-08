import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Admin – Kurzy" };

export default async function AdminKurzyPage() {
  const courses = await prisma.course.findMany({
    include: {
      _count: { select: { lessons: true, downloads: true } },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kurzy & Lekce</h1>
          <p className="text-gray-500 mt-1">Správa kurzů a obsahu</p>
        </div>
        <Link
          href="/admin/kurzy/novy"
          className="inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-navy-light transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nový kurz
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-500 mb-4">Zatím žádné kurzy</p>
          <Link
            href="/admin/kurzy/novy"
            className="inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-navy-light transition-all"
          >
            Vytvořit první kurz
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-navy/20 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-navy/10 flex-shrink-0">
                    {course.coverImage ? (
                      <img src={course.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-navy/30 text-xl">▶</div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{course.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        course.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {course.isPublished ? "Publikováno" : "Skrytý"}
                      </span>
                      {course.isFree && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                          Zdarma
                        </span>
                      )}
                    </div>
                    {course.description && (
                      <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>{course._count.lessons} lekcí</span>
                      <span>{course._count.downloads} souborů</span>
                      <span>/{course.slug}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/kurzy/${course.id}`}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Upravit
                  </Link>
                  <Link
                    href={`/admin/kurzy/${course.id}/lekce`}
                    className="px-3 py-1.5 text-sm bg-navy/10 text-navy rounded-lg hover:bg-navy/20 transition-colors font-medium"
                  >
                    Lekce
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
