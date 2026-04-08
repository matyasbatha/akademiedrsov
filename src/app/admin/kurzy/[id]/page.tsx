"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateCourse, deleteCourse } from "@/actions/courses";
import { slugify } from "@/lib/utils";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  isPublished: boolean;
  isFree: boolean;
  order: number;
}

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/courses/${id}`)
      .then((r) => r.json())
      .then(setCourse)
      .catch(() => setError("Kurz nebyl nalezen"));
  }, [id]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updateCourse(id, {
          title: form.get("title") as string,
          slug: form.get("slug") as string,
          description: (form.get("description") as string) || undefined,
          coverImage: (form.get("coverImage") as string) || undefined,
          isPublished: form.getAll("isPublished").includes("true"),
          isFree: form.getAll("isFree").includes("true"),
          order: Number(form.get("order")) || 0,
        });
        router.push("/admin/kurzy");
      } catch {
        setError("Chyba při ukládání");
      }
    });
  }

  async function handleDelete() {
    if (!confirm("Opravdu smazat? Tato akce je nevratná.")) return;
    await deleteCourse(id);
    router.push("/admin/kurzy");
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-navy border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/kurzy" className="text-gray-400 hover:text-gray-600 transition-colors">← Kurzy</Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900">Upravit kurz</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/kurzy/${id}/lekce`}
            className="px-4 py-2 bg-navy/10 text-navy rounded-xl font-medium text-sm hover:bg-navy/20 transition-all"
          >
            Lekce ({course.title})
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 border border-red-200 rounded-xl font-medium text-sm hover:bg-red-50 transition-all"
          >
            Smazat
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Název kurzu *</label>
          <input
            type="text"
            name="title"
            required
            defaultValue={course.title}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">URL slug *</label>
          <input
            type="text"
            name="slug"
            required
            defaultValue={course.slug}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Popis</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={course.description ?? ""}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">URL obrázku (cover)</label>
          <input
            type="url"
            name="coverImage"
            defaultValue={course.coverImage ?? ""}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Pořadí</label>
          <input
            type="number"
            name="order"
            defaultValue={course.order}
            className="w-32 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="hidden" name="isPublished" value="false" />
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={course.isPublished}
              className="w-4 h-4 rounded accent-navy"
            />
            <span className="text-sm font-medium text-gray-700">Publikovaný</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="hidden" name="isFree" value="false" />
            <input
              type="checkbox"
              name="isFree"
              value="true"
              defaultChecked={course.isFree}
              className="w-4 h-4 rounded accent-navy"
            />
            <span className="text-sm font-medium text-gray-700">Zdarma</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy-light transition-all disabled:opacity-50"
          >
            {isPending ? "Ukládám..." : "Uložit změny"}
          </button>
          <Link href="/admin/kurzy" className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium">
            Zrušit
          </Link>
        </div>
      </form>
    </div>
  );
}
