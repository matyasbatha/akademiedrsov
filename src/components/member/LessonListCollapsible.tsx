"use client";

import { useState } from "react";
import Link from "next/link";

interface Lesson {
  id: string;
  slug: string;
  title: string;
  order: number;
}

interface Props {
  lessons: Lesson[];
  currentSlug: string;
  courseTitle: string;
}

export default function LessonListCollapsible({ lessons, currentSlug, courseTitle }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const currentIndex = lessons.findIndex((l) => l.slug === currentSlug);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left lg:pointer-events-none"
        aria-expanded={isOpen}
      >
        <div>
          <h3 className="font-bold text-gray-900 text-sm">{courseTitle}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {lessons.length} {lessons.length === 1 ? "lekce" : lessons.length < 5 ? "lekce" : "lekcí"} · Lekce {currentIndex + 1}
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 lg:hidden ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`${isOpen ? "block" : "hidden"} lg:block border-t border-gray-50`}>
        <div className="max-h-72 lg:max-h-96 overflow-y-auto">
          {lessons.map((l, i) => (
            <Link
              key={l.id}
              href={`/lekce/${l.slug}`}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors border-b border-gray-50 last:border-0 ${
                l.slug === currentSlug
                  ? "bg-navy text-white"
                  : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  l.slug === currentSlug ? "bg-white text-navy" : "bg-gray-100 text-gray-500"
                }`}
              >
                {i + 1}
              </span>
              <span className="truncate leading-snug">{l.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
