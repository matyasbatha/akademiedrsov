import Link from "next/link";
import { coursePricing, formatPrice } from "@/lib/utils";
import BuyCourseButton from "@/components/member/BuyCourseButton";

type Props = {
  course: {
    id: string;
    slug: string;
    title: string;
    coverImage: string | null;
    price: number;
    originalPrice: number | null;
    isComingSoon: boolean;
  };
};

export default function CourseSaleCard({ course }: Props) {
  const p = coursePricing(course);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:border-gold/30 flex flex-col shrink-0 w-[80%] sm:w-[46%] md:w-auto">
      <Link href={`/kurzy/${course.slug}`} className="block">
        <div className="aspect-[16/9] bg-navy/10 relative overflow-hidden">
          {course.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-light">
              <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          {course.isComingSoon && (
            <div className="absolute top-2 left-2 bg-amber-400 text-navy text-xs font-bold px-2.5 py-1 rounded-full">
              PŘIPRAVUJEME −50 %
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link href={`/kurzy/${course.slug}`}>
          <h3 className="font-bold text-navy leading-snug mb-3 line-clamp-2 group-hover:text-gold transition-colors">
            {course.title}
          </h3>
        </Link>
        <div className="mt-auto flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-navy">{formatPrice(p.effective)}</span>
            {p.strike && p.strike > p.effective && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(p.strike)}</span>
            )}
          </div>
          <BuyCourseButton
            courseId={course.id}
            courseSlug={course.slug}
            className="bg-gold text-navy px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gold-dark whitespace-nowrap text-center"
          >
            {course.isComingSoon ? "Předprodej" : "Koupit"}
          </BuyCourseButton>
        </div>
      </div>
    </div>
  );
}
