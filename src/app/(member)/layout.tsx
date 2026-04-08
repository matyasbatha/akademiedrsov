import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/actions/auth";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/prihlaseni");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-navy flex-col fixed inset-y-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-white text-sm">
              Akademie <span className="text-gold">Drsov</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: "/dashboard", icon: "⊞", label: "Dashboard" },
            { href: "/kurzy", icon: "▶", label: "Kurzy" },
            { href: "/ucet", icon: "◉", label: "Můj účet" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {session.user.role === "ADMIN" && (
            <>
              <div className="pt-4 pb-2">
                <span className="text-xs text-white/30 uppercase tracking-widest px-4">Admin</span>
              </div>
              {[
                { href: "/admin", label: "Přehled" },
                { href: "/admin/kurzy", label: "Kurzy" },
                { href: "/admin/uzivatele", label: "Uživatelé" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gold/80 hover:bg-white/10 hover:text-gold transition-all text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-sm">
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-white/40 text-xs truncate">{session.user.email}</p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-left px-3 py-2 text-red-400 hover:bg-white/5 rounded-lg text-sm transition-colors"
            >
              Odhlásit se
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-navy border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-white text-sm">
          Akademie <span className="text-gold">Drsov</span>
        </Link>
        <div className="flex gap-3">
          <Link href="/dashboard" className="text-white/70 text-sm">Dashboard</Link>
          <Link href="/kurzy" className="text-white/70 text-sm">Kurzy</Link>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
