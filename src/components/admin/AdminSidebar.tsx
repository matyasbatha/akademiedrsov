"use client";

import Link from "next/link";
import { useState } from "react";
import { logout } from "@/actions/auth";
import Icon from "@/components/ui/Icon";

const navItems = [
  { href: "/admin", label: "Přehled", icon: "dashboard" },
  { href: "/admin/kurzy", label: "Kurzy & Lekce", icon: "book" },
  { href: "/admin/uzivatele", label: "Uživatelé", icon: "users" },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all text-sm"
        >
          <Icon name={item.icon} className="w-5 h-5" />
          {item.label}
        </Link>
      ))}
      <div className="pt-4 pb-2">
        <span className="text-xs text-white/20 uppercase tracking-widest px-3">Web</span>
      </div>
      <Link
        href="/dashboard"
        onClick={onClick}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all text-sm"
      >
        <Icon name="dashboard" className="w-5 h-5" /> Přejít na web
      </Link>
    </>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2">
      <div className="w-7 h-7 bg-gold rounded flex items-center justify-center text-navy font-bold text-xs">A</div>
      <span className="font-bold text-white text-sm">Admin Panel</span>
    </Link>
  );
}

export default function AdminSidebar({ email }: { email: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-gray-900 fixed inset-y-0 flex-col">
        <div className="p-5 border-b border-white/10">
          <Brand />
          <p className="text-xs text-white/30 mt-1">Akademie Drsov</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          <NavLinks />
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="text-xs text-white/30 px-3 mb-2 truncate">{email}</div>
          <form action={logout}>
            <button type="submit" className="w-full text-left px-3 py-2 text-red-400 hover:bg-white/5 rounded-lg text-sm transition-colors">
              Odhlásit se
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-gray-900 border-b border-white/10 px-4 h-14 flex items-center justify-between">
        <Brand />
        <button onClick={() => setOpen((v) => !v)} className="text-white p-2 -mr-2" aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden">
          <div className="fixed inset-0 top-14 z-40 bg-black/40" onClick={() => setOpen(false)} />
          <div className="fixed top-14 inset-x-0 z-50 bg-gray-900 border-b border-white/10 p-3 space-y-0.5 shadow-xl">
            <NavLinks onClick={() => setOpen(false)} />
            <div className="border-t border-white/10 my-2" />
            <div className="text-xs text-white/30 px-3 mb-1 truncate">{email}</div>
            <form action={logout}>
              <button type="submit" className="w-full text-left px-3 py-2.5 text-red-400 hover:bg-white/5 rounded-lg text-sm">
                Odhlásit se
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
