"use client";

import { useState, useTransition } from "react";
import { setUserRole } from "@/actions/admin";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  currentRole: string;
}

export default function AdminUserActions({ userId, currentRole }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleRole(role: Role) {
    startTransition(async () => {
      await setUserRole(userId, role);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        ⋯
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
            <div className="px-3 py-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wide">Role</div>
            {(["GUEST", "MEMBER", "ADMIN"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => handleRole(r)}
                disabled={isPending || currentRole === r}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${currentRole === r ? "font-semibold text-navy" : "text-gray-700"}`}
              >
                {currentRole === r ? "✓ " : ""}{r}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
