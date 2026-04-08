"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCourse } from "@/actions/courses";
import { slugify } from "@/lib/utils";
import Link from "next/link";

export default function NovyKurzPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(val: string) {
    setTitle(val);
    setSlug(slugify(val));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const course = await createCourse({
          title: form.get("title") as string,
          slug: form.get("slug") as string,
          description: form.get("description") as string || undefined,
          coverImage: form.get("coverImage") as string || undefined,
          isPublished: form.getAll("isPublished").includes("true"),
          isFree: form.getAll("isFree").includes("true"),
          order: Number(form.get("order")) || 0,
        });
        router.push(`/admin/kurzy/${course.id}`);
      } catch {
        setError("Chyba při vytváření kurzu");
      }
    });
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/kurzy" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Kurzy
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">Nový kurz</h1>
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
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            placeholder="Např. Ozonické čištění pleti"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">URL slug *</label>
          <input
            type="text"
            name="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent font-mono text-sm"
            placeholder="ozonicke-cisteni-pleti"
          />
          <p className="text-xs text-gray-400 mt-1">Použito v URL: /kurzy/{slug || "slug"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Popis</label>
          <textarea
            name="description"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent resize-none"
            placeholder="Popis kurzu pro studenty..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">URL obrázku (cover)</label>
          <input
            type="url"
            name="coverImage"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Pořadí</label>
          <input
            type="number"
            name="order"
            defaultValue={0}
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
              className="w-4 h-4 rounded accent-navy"
            />
            <span className="text-sm font-medium text-gray-700">Zdarma (bez členství)</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy-light transition-all disabled:opacity-50"
          >
            {isPending ? "Vytvářím..." : "Vytvořit kurz"}
          </button>
          <Link href="/admin/kurzy" className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors">
            Zrušit
          </Link>
        </div>
      </form>
    </div>
  );
}
