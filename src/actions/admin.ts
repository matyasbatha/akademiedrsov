"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MembershipStatus, Role } from "@prisma/client";

function requireAdmin(role?: string) {
  if (role !== "ADMIN") throw new Error("Unauthorized");
}

export async function setUserRole(userId: string, role: Role) {
  const session = await auth();
  requireAdmin(session?.user?.role);

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/uzivatele");
}

export async function setMembershipStatus(userId: string, status: MembershipStatus) {
  const session = await auth();
  requireAdmin(session?.user?.role);

  await prisma.membership.upsert({
    where: { userId },
    update: { status },
    create: { userId, status },
  });

  const isActive = status === "active" || status === "trialing";
  await prisma.user.update({
    where: { id: userId },
    data: { role: isActive ? "MEMBER" : "GUEST" },
  });

  revalidatePath("/admin/uzivatele");
}

export async function getAdminStats() {
  const session = await auth();
  requireAdmin(session?.user?.role);

  const [totalUsers, activeMembers, totalCourses, totalLessons] = await Promise.all([
    prisma.user.count(),
    prisma.membership.count({ where: { status: { in: ["active", "trialing"] } } }),
    prisma.course.count(),
    prisma.lesson.count(),
  ]);

  return { totalUsers, activeMembers, totalCourses, totalLessons };
}
