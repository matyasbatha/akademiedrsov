import { getAdminStats } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Admin – Přehled" };

export default async function AdminPage() {
  const stats = await getAdminStats();

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { membership: { select: { status: true } } },
  });

  const statCards = [
    { label: "Celkem uživatelů", value: stats.totalUsers, color: "bg-blue-50 text-blue-700", icon: "👤" },
    { label: "Aktivní členové", value: stats.activeMembers, color: "bg-green-50 text-green-700", icon: "✅" },
    { label: "Kurzy", value: stats.totalCourses, color: "bg-purple-50 text-purple-700", icon: "📚" },
    { label: "Lekce", value: stats.totalLessons, color: "bg-amber-50 text-amber-700", icon: "▶" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Přehled</h1>
        <p className="text-gray-500 mt-1">Vítejte v admin panelu Akademie Drsov</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Noví uživatelé</h2>
            <Link href="/admin/uzivatele" className="text-sm text-navy hover:text-gold transition-colors">
              Zobrazit vše →
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name ?? "–"}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  user.membership?.status === "active" ? "bg-green-100 text-green-700" :
                  user.membership?.status === "trialing" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-500"
                }`}>
                  {user.membership?.status ?? "–"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Rychlé akce</h2>
          <div className="space-y-3">
            <Link
              href="/admin/kurzy"
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-navy/20 hover:bg-gray-50 transition-all group"
            >
              <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center text-navy font-bold group-hover:bg-navy group-hover:text-white transition-all">
                +
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Přidat nový kurz</p>
                <p className="text-xs text-gray-400">Vytvořit kurz s lekcemi</p>
              </div>
            </Link>
            <Link
              href="/admin/uzivatele"
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-navy/20 hover:bg-gray-50 transition-all group"
            >
              <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center text-navy font-bold group-hover:bg-navy group-hover:text-white transition-all">
                👤
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Správa uživatelů</p>
                <p className="text-xs text-gray-400">Přístupy a členství</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
