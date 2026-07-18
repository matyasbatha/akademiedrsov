"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

function requireAdmin(role?: string) {
  if (role !== "ADMIN") throw new Error("Unauthorized");
}

export async function setUserRole(userId: string, role: Role) {
  const session = await auth();
  requireAdmin(session?.user?.role);

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/uzivatele");
}

export async function getAdminStats() {
  const session = await auth();
  requireAdmin(session?.user?.role);

  const [totalUsers, activeAccesses, totalCourses, totalLessons] = await Promise.all([
    prisma.user.count(),
    prisma.courseAccess.count({ where: { expiresAt: { gt: new Date() } } }),
    prisma.course.count(),
    prisma.lesson.count(),
  ]);

  return { totalUsers, activeAccesses, totalCourses, totalLessons };
}
