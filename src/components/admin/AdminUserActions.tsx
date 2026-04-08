"use client";

import { useState, useTransition } from "react";
import { setMembershipStatus, setUserRole } from "@/actions/admin";
import { MembershipStatus, Role } from "@prisma/client";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  currentStatus: string;
  currentRole: string;
}

export default function AdminUserActions({ userId, currentStatus, currentRole }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleStatus(status: MembershipStatus) {
    startTransition(async () => {
      await setMembershipStatus(userId, status);
      setOpen(false);
      router.refresh();
    });
  }

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
            <div className="px-3 py-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wide">Členství</div>
            {(["active", "inactive", "canceled"] as MembershipStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                disabled={isPending || currentStatus === s}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${currentStatus === s ? "font-semibold text-navy" : "text-gray-700"}`}
              >
                {currentStatus === s ? "✓ " : ""}{s}
              </button>
            ))}
            <div className="border-t border-gray-100 mt-1 pt-1">
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
          </div>
        </>
      )}
    </div>
  );
}
