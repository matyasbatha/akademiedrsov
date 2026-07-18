import { prisma } from "@/lib/prisma";

// ──────────────────────────────────────────────────────────────────────────
// Přístup ke kurzům – jednorázový nákup s časově omezeným přístupem.
// Student má přístup ke kurzu, pokud má platný (nevypršelý) CourseAccess,
// nebo je kurz zdarma, nebo je uživatel ADMIN.
// ──────────────────────────────────────────────────────────────────────────

/** Vrátí množinu ID kurzů, ke kterým má uživatel právě teď platný přístup. */
export async function getActiveAccessCourseIds(userId: string): Promise<Set<string>> {
  const accesses = await prisma.courseAccess.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
    select: { courseId: true },
  });
  return new Set(accesses.map((a) => a.courseId));
}

/** Má uživatel přístup ke konkrétnímu kurzu? (ADMIN i zdarma kurzy = ano) */
export async function hasCourseAccess(
  userId: string,
  course: { id: string; isFree: boolean },
  role?: string
): Promise<boolean> {
  if (role === "ADMIN") return true;
  if (course.isFree) return true;
  const access = await prisma.courseAccess.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
  });
  return !!access && access.expiresAt > new Date();
}

/** Zakoupené (a stále platné) kurzy uživatele – pro sekci „Moje kurzy". */
export async function getMyCourses(userId: string) {
  return prisma.courseAccess.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
    include: {
      course: { include: { _count: { select: { lessons: true } } } },
    },
    orderBy: { grantedAt: "desc" },
  });
}
