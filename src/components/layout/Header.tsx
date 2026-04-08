"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { logout } from "@/actions/auth";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-navy text-lg tracking-tight">
              Akademie <span className="text-gold">Drsov</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/clenstvi"
              className="text-gray-600 hover:text-navy font-medium transition-colors"
            >
              Členství
            </Link>
            {session?.user ? (
              <>
                <Link
                  href="/kurzy"
                  className="text-gray-600 hover:text-navy font-medium transition-colors"
                >
                  Kurzy
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-navy font-medium transition-colors"
                >
                  Dashboard
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-gold hover:text-gold-dark font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 text-gray-600 hover:text-navy transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-semibold">
                      {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <Link
                        href="/ucet"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setMenuOpen(false)}
                      >
                        Můj účet
                      </Link>
                      <hr className="my-1" />
                      <form action={logout}>
                        <button
                          type="submit"
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Odhlásit se
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/prihlaseni"
                  className="text-navy font-medium hover:text-navy-light transition-colors"
                >
                  Přihlásit se
                </Link>
                <Link
                  href="/clenstvi"
                  className="bg-gold text-navy px-5 py-2 rounded-lg font-semibold hover:bg-gold-dark transition-all shadow-sm hover:shadow-md"
                >
                  Začít členství
                </Link>
              </div>
            )}
          </nav>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white py-2">
          <div className="px-4 space-y-1">
            <Link href="/clenstvi" className="block py-2 text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
              Členství
            </Link>
            {session?.user ? (
              <>
                <Link href="/kurzy" className="block py-2 text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
                  Kurzy
                </Link>
                <Link href="/dashboard" className="block py-2 text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/ucet" className="block py-2 text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
                  Můj účet
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="block py-2 text-gold font-medium" onClick={() => setMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <form action={logout}>
                  <button type="submit" className="block py-2 text-red-600 font-medium w-full text-left">
                    Odhlásit se
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/prihlaseni" className="block py-2 text-navy font-medium" onClick={() => setMenuOpen(false)}>
                  Přihlásit se
                </Link>
                <Link href="/clenstvi" className="block py-2 text-gold font-semibold" onClick={() => setMenuOpen(false)}>
                  Začít členství →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
