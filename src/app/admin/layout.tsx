import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/actions/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-60 bg-gray-900 fixed inset-y-0 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gold rounded flex items-center justify-center text-navy font-bold text-xs">
              A
            </div>
            <span className="font-bold text-white text-sm">Admin Panel</span>
          </Link>
          <p className="text-xs text-white/30 mt-1">Akademie Drsov</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {[
            { href: "/admin", label: "Přehled", icon: "⊞" },
            { href: "/admin/kurzy", label: "Kurzy & Lekce", icon: "▶" },
            { href: "/admin/uzivatele", label: "Uživatelé", icon: "◉" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all text-sm"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div className="pt-4 pb-2">
            <span className="text-xs text-white/20 uppercase tracking-widest px-3">Web</span>
          </div>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all text-sm">
            <span>↗</span> Přejít na web
          </Link>
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="text-xs text-white/30 px-3 mb-2">{session.user.email}</div>
          <form action={logout}>
            <button type="submit" className="w-full text-left px-3 py-2 text-red-400 hover:bg-white/5 rounded-lg text-sm transition-colors">
              Odhlásit se
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 ml-60">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
