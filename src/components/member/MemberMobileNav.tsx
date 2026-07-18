"use client";

import Link from "next/link";
import { useState } from "react";
import { logout } from "@/actions/auth";
import Icon from "@/components/ui/Icon";

export default function MemberMobileNav({
  email,
  isAdmin,
}: {
  email?: string | null;
  isAdmin?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/kurzy", label: "Kurzy", icon: "book" },
    { href: "/ucet", label: "Můj účet", icon: "user" },
  ];

  return (
    <div className="md:hidden">
      {/* Horní lišta */}
      <div className="fixed top-0 inset-x-0 z-50 bg-navy border-b border-white/10 px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-white text-sm" onClick={() => setOpen(false)}>
          Akademie <span className="text-gold">Drsov</span>
        </Link>
        <button onClick={() => setOpen((v) => !v)} className="text-white p-2 -mr-2" aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Výsuvná nabídka */}
      {open && (
        <>
          <div className="fixed inset-0 top-14 z-40 bg-black/40" onClick={() => setOpen(false)} />
          <div className="fixed top-14 inset-x-0 z-50 bg-navy border-b border-white/10 p-4 space-y-1 shadow-xl">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
              >
                <Icon name={item.icon} className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-gold hover:bg-white/10 transition-all text-sm font-medium"
              >
                <Icon name="dashboard" className="w-5 h-5" />
                Administrace
              </Link>
            )}
            <div className="border-t border-white/10 my-2" />
            {email && <div className="px-3 text-white/40 text-xs truncate">{email}</div>}
            <form action={logout}>
              <button type="submit" className="w-full text-left px-3 py-3 text-red-400 hover:bg-white/5 rounded-xl text-sm font-medium">
                Odhlásit se
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
