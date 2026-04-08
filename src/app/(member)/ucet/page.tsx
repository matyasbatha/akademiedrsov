import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { isActiveMembership } from "@/lib/stripe";
import ManageSubscriptionButton from "@/components/member/ManageSubscriptionButton";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Můj účet" };

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: "Aktivní", color: "text-green-700 bg-green-100" },
  trialing: { label: "Zkušební", color: "text-blue-700 bg-blue-100" },
  past_due: { label: "Po splatnosti", color: "text-amber-700 bg-amber-100" },
  canceled: { label: "Zrušeno", color: "text-red-700 bg-red-100" },
  inactive: { label: "Neaktivní", color: "text-gray-600 bg-gray-100" },
};

export default async function UcetPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");

  const [user, membership] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.membership.findUnique({ where: { userId: session.user.id } }),
  ]);

  if (!user) redirect("/prihlaseni");

  const isActive = isActiveMembership(membership?.status);
  const statusInfo =
    statusLabels[membership?.status ?? "inactive"] ?? statusLabels.inactive;

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
        <div className="text-sm text-gray-500">
          Člen od {formatDate(user.createdAt)}
        </div>
      </div>

      {/* Členství */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Stav členství</h2>

        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${statusInfo.color}`}>
            <span className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
            {statusInfo.label}
          </span>
          {membership?.stripePriceId && isActive && (
            <span className="text-sm text-gray-500">
              {membership.stripePriceId.includes("yearly") ? "Roční plán" : "Měsíční plán"}
            </span>
          )}
        </div>

        {membership?.currentPeriodEnd && (
          <div className="text-sm text-gray-600 mb-4">
            {membership.cancelAtPeriodEnd ? (
              <p>
                ⚠️ Členství skončí{" "}
                <span className="font-semibold">{formatDate(membership.currentPeriodEnd)}</span>
              </p>
            ) : (
              <p>
                Automaticky se obnoví{" "}
                <span className="font-semibold">{formatDate(membership.currentPeriodEnd)}</span>
              </p>
            )}
          </div>
        )}

        {isActive ? (
          <ManageSubscriptionButton />
        ) : (
          <Link
            href="/clenstvi"
            className="inline-flex items-center gap-2 bg-gold text-navy px-6 py-3 rounded-xl font-bold hover:bg-gold-dark transition-all"
          >
            Aktivovat členství
          </Link>
        )}
      </div>

      {/* Rychlé odkazy */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Rychlé odkazy</h2>
        <div className="space-y-2">
          <Link href="/kurzy" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700">
            <span>Všechny kurzy</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/dashboard" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700">
            <span>Dashboard</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
