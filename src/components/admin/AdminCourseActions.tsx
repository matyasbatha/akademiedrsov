"use client";

import { useState } from "react";
import { deleteCourse } from "@/actions/courses";
import { useRouter } from "next/navigation";

export default function AdminCourseActions({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Opravdu smazat kurz? Tato akce je nevratná.")) return;
    setLoading(true);
    try {
      await deleteCourse(courseId);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
    >
      {loading ? "Mažu..." : "Smazat"}
    </button>
  );
}
