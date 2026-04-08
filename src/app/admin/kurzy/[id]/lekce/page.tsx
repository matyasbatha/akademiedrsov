"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { useParams } from "next/navigation";
import { createLesson, updateLesson, deleteLesson } from "@/actions/courses";
import { slugify } from "@/lib/utils";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  videoUrl: string | null;
  isPublished: boolean;
  isFree: boolean;
  order: number;
}

interface Download {
  id: string;
  title: string;
  fileUrl: string;
  fileSize: number | null;
}

interface Course {
  id: string;
  title: string;
}

export default function AdminLessonPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [isPending, startTransition] = useTransition();
  const [materialsLessonId, setMaterialsLessonId] = useState<string | null>(null);

  async function loadData() {
    const [c, l] = await Promise.all([
      fetch(`/api/admin/courses/${courseId}`).then((r) => r.json()),
      fetch(`/api/admin/courses/${courseId}/lessons`).then((r) => r.json()),
    ]);
    setCourse(c);
    setLessons(l);
  }

  useEffect(() => { loadData(); }, [courseId]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const data = {
        courseId,
        title: form.get("title") as string,
        slug: form.get("slug") as string,
        description: (form.get("description") as string) || undefined,
        videoUrl: (form.get("videoUrl") as string) || undefined,
        isPublished: form.getAll("isPublished").includes("true"),
        isFree: form.getAll("isFree").includes("true"),
        order: Number(form.get("order")) || lessons.length,
      };

      if (editLesson) {
        await updateLesson(editLesson.id, data);
      } else {
        await createLesson(data);
      }

      setShowForm(false);
      setEditLesson(null);
      await loadData();
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Smazat lekci?")) return;
    await deleteLesson(id);
    await loadData();
  }

  const defaultSlug = (title: string) => slugify(title);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/kurzy" className="text-gray-400 hover:text-gray-600">← Kurzy</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600">{course?.title ?? "..."}</span>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Lekce</h1>
      </div>

      {!showForm && !editLesson && (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-navy-light transition-all shadow-sm mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Přidat lekci
        </button>
      )}

      {(showForm || editLesson) && (
        <LessonForm
          lesson={editLesson}
          defaultOrder={lessons.length}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditLesson(null); }}
          isPending={isPending}
        />
      )}

      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <div key={lesson.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-navy/10 text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 truncate">{lesson.title}</p>
                  {!lesson.isPublished && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Skrytý</span>
                  )}
                  {lesson.isFree && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Zdarma</span>
                  )}
                </div>
                {lesson.videoUrl && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">🎬 {lesson.videoUrl}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMaterialsLessonId(materialsLessonId === lesson.id ? null : lesson.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    materialsLessonId === lesson.id
                      ? "bg-gold/10 border-gold/30 text-yellow-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  📎 Materiály
                </button>
                <button
                  onClick={() => { setEditLesson(lesson); setMaterialsLessonId(null); }}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Upravit
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Smazat
                </button>
              </div>
            </div>
            {/* Sekce materiálů – zobrazí se po kliknutí na "Materiály" */}
            {materialsLessonId === lesson.id && (
              <DownloadsSection lessonId={lesson.id} />
            )}
          </div>
        ))}
        {lessons.length === 0 && !showForm && (
          <div className="text-center py-12 text-gray-400">
            Žádné lekce. Začněte přidáním první lekce.
          </div>
        )}
      </div>
    </div>
  );
}

function DownloadsSection({ lessonId }: { lessonId: string }) {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadDownloads() {
    const res = await fetch(`/api/admin/lessons/${lessonId}/downloads`);
    const data = await res.json();
    setDownloads(data);
  }

  useEffect(() => { loadDownloads(); }, [lessonId]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !uploadTitle.trim()) {
      setError("Zadejte název a vyberte soubor.");
      return;
    }
    setError(null);
    setIsUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      if (!uploadRes.ok) throw new Error("Upload selhal");
      const { url } = await uploadRes.json();

      await fetch(`/api/admin/lessons/${lessonId}/downloads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: uploadTitle.trim(), fileUrl: url, fileSize: file.size }),
      });

      setUploadTitle("");
      if (fileRef.current) fileRef.current.value = "";
      await loadDownloads();
    } catch {
      setError("Nepodařilo se nahrát soubor. Zkuste znovu.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Smazat materiál?")) return;
    await fetch(`/api/admin/downloads/${id}`, { method: "DELETE" });
    await loadDownloads();
  }

  function formatSize(bytes: number | null) {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return ` · ${Math.round(bytes / 1024)} KB`;
    return ` · ${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">Materiály ke stažení (PDF)</h4>

      {/* Existující materiály */}
      {downloads.length > 0 ? (
        <div className="space-y-1.5">
          {downloads.map((dl) => (
            <div key={dl.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <span className="flex-1 text-sm text-gray-700 truncate">
                {dl.title}<span className="text-gray-400">{formatSize(dl.fileSize)}</span>
              </span>
              <a href={dl.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-navy hover:underline">
                Otevřít
              </a>
              <button
                onClick={() => handleDelete(dl.id)}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Smazat
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">Žádné materiály. Nahrajte první PDF níže.</p>
      )}

      {/* Upload formulář */}
      <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-2 pt-1">
        <input
          type="text"
          placeholder="Název materiálu"
          value={uploadTitle}
          onChange={(e) => setUploadTitle(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy"
        />
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
          className="text-sm text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-navy file:text-white file:text-xs file:cursor-pointer hover:file:bg-navy-light"
        />
        <button
          type="submit"
          disabled={isUploading}
          className="px-4 py-2 bg-navy text-white text-sm rounded-xl font-medium hover:bg-navy-light disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {isUploading ? "Nahrávám..." : "Nahrát"}
        </button>
      </form>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function LessonForm({
  lesson,
  defaultOrder,
  onSubmit,
  onCancel,
  isPending,
}: {
  lesson: Lesson | null;
  defaultOrder: number;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [slug, setSlug] = useState(lesson?.slug ?? "");

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4 mb-6">
      <h3 className="font-bold text-gray-900">{lesson ? "Upravit lekci" : "Nová lekce"}</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Název *</label>
          <input
            type="text"
            name="title"
            required
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (!lesson) setSlug(slugify(e.target.value)); }}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug *</label>
          <input
            type="text"
            name="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy text-sm font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Video URL (Vimeo / YouTube)</label>
        <input
          type="url"
          name="videoUrl"
          defaultValue={lesson?.videoUrl ?? ""}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy text-sm"
          placeholder="https://vimeo.com/... nebo https://youtube.com/..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Popis</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={lesson?.description ?? ""}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy text-sm resize-none"
        />
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Pořadí</label>
          <input
            type="number"
            name="order"
            defaultValue={lesson?.order ?? defaultOrder}
            className="w-24 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy text-sm"
          />
        </div>
        <div className="pt-5 flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="hidden" name="isPublished" value="false" />
            <input type="checkbox" name="isPublished" value="true" defaultChecked={lesson?.isPublished ?? false} className="w-4 h-4 accent-navy" />
            <span className="text-sm text-gray-700">Publikovaná</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="hidden" name="isFree" value="false" />
            <input type="checkbox" name="isFree" value="true" defaultChecked={lesson?.isFree ?? false} className="w-4 h-4 accent-navy" />
            <span className="text-sm text-gray-700">Zdarma</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className="bg-navy text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-navy-light transition-all disabled:opacity-50 text-sm">
          {isPending ? "Ukládám..." : lesson ? "Uložit" : "Přidat lekci"}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 text-gray-500 hover:text-gray-700 font-medium text-sm">
          Zrušit
        </button>
      </div>
    </form>
  );
}
