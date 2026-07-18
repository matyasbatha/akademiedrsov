import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDate, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Můj účet" };

export default async function UcetPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");

  const [user, accesses, orders] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.courseAccess.findMany({
      where: { userId: session.user.id },
      include: { course: { select: { title: true, slug: true } } },
      orderBy: { grantedAt: "desc" },
    }),
    prisma.order.findMany({
      where: { userId: session.user.id, status: "paid" },
      include: { course: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!user) redirect("/prihlaseni");

  const now = new Date();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Můj účet</h1>

      {/* Profil */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Profil</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center text-2xl font-bold">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">{user.name}</p>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">Registrace {formatDate(user.createdAt)}</div>
      </div>

      {/* Moje kurzy / přístupy */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Moje přístupy</h2>
        {accesses.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Zatím nemáte žádný zakoupený kurz.{" "}
            <Link href="/kurzy" className="text-gold font-semibold hover:text-gold-dark">
              Prohlédnout nabídku →
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {accesses.map((a) => {
              const active = a.expiresAt > now;
              return (
                <div key={a.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100">
                  <div className="min-w-0">
                    <Link href={`/kurzy/${a.course.slug}`} className="font-medium text-gray-900 hover:text-navy transition-colors">
                      {a.course.title}
                    </Link>
                    <p className="text-xs text-gray-400">
                      {active ? `Přístup do ${formatDate(a.expiresAt)}` : `Přístup vypršel ${formatDate(a.expiresAt)}`}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${
                      active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {active ? "Aktivní" : "Vypršel"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historie objednávek */}
      {orders.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Historie objednávek</h2>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-gray-800">{o.course.title}</p>
                  <p className="text-xs text-gray-400">{formatDate(o.createdAt)}</p>
                </div>
                <span className="font-semibold text-gray-900">{formatPrice(o.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
