import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import AdminUserActions from "@/components/admin/AdminUserActions";

export const metadata: Metadata = { title: "Admin – Uživatelé" };

export default async function AdminUzivatelePage() {
  const users = await prisma.user.findMany({
    include: {
      courseAccesses: {
        where: { expiresAt: { gt: new Date() } },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Uživatelé</h1>
        <p className="text-gray-500 mt-1">{users.length} celkem registrovaných uživatelů</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Uživatel</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aktivní kurzy</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Registrace</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => {
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {user.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{user.name ?? "–"}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        user.role === "ADMIN" ? "bg-purple-100 text-purple-700" :
                        user.role === "MEMBER" ? "bg-navy/10 text-navy" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {user.courseAccesses.length > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700">
                          {user.courseAccesses.length} {user.courseAccesses.length < 5 ? "kurzy" : "kurzů"}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">–</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <AdminUserActions
                        userId={user.id}
                        currentRole={user.role}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
