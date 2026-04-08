"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

function requireAdmin(role?: string) {
  if (role !== "ADMIN") throw new Error("Unauthorized");
}

const CourseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFree: z.boolean().default(false),
  order: z.number().default(0),
});

const LessonSchema = z.object({
  courseId: z.string(),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.number().optional(),
  isPublished: z.boolean().default(false),
  isFree: z.boolean().default(false),
  order: z.number().default(0),
});

export async function createCourse(data: z.infer<typeof CourseSchema>) {
  const session = await auth();
  requireAdmin(session?.user?.role);

  const validated = CourseSchema.parse(data);
  const course = await prisma.course.create({ data: validated });
  revalidatePath("/admin/kurzy");
  revalidatePath("/kurzy");
  return course;
}

export async function updateCourse(id: string, data: Partial<z.infer<typeof CourseSchema>>) {
  const session = await auth();
  requireAdmin(session?.user?.role);

  const course = await prisma.course.update({ where: { id }, data });
  revalidatePath("/admin/kurzy");
  revalidatePath("/kurzy");
  revalidatePath(`/kurzy/${course.slug}`);
  return course;
}

export async function deleteCourse(id: string) {
  const session = await auth();
  requireAdmin(session?.user?.role);

  await prisma.course.delete({ where: { id } });
  revalidatePath("/admin/kurzy");
  revalidatePath("/kurzy");
}

export async function createLesson(data: z.infer<typeof LessonSchema>) {
  const session = await auth();
  requireAdmin(session?.user?.role);

  const validated = LessonSchema.parse(data);
  const lesson = await prisma.lesson.create({ data: validated });
  revalidatePath("/admin/kurzy");
  return lesson;
}

export async function updateLesson(id: string, data: Partial<z.infer<typeof LessonSchema>>) {
  const session = await auth();
  requireAdmin(session?.user?.role);

  const lesson = await prisma.lesson.update({ where: { id }, data });
  revalidatePath("/admin/kurzy");
  return lesson;
}

export async function deleteLesson(id: string) {
  const session = await auth();
  requireAdmin(session?.user?.role);

  await prisma.lesson.delete({ where: { id } });
  revalidatePath("/admin/kurzy");
}

export async function createDownload(data: {
  courseId?: string;
  lessonId?: string;
  title: string;
  fileUrl: string;
  fileSize?: number;
  type?: string;
}) {
  const session = await auth();
  requireAdmin(session?.user?.role);

  const download = await prisma.download.create({ data });
  revalidatePath("/admin/kurzy");
  return download;
}

export async function deleteDownload(id: string) {
  const session = await auth();
  requireAdmin(session?.user?.role);

  await prisma.download.delete({ where: { id } });
  revalidatePath("/admin/kurzy");
}
