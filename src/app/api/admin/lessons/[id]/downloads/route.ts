import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const downloads = await prisma.download.findMany({
    where: { lessonId: id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(downloads);
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const { title, fileUrl, fileSize } = await req.json();

  if (!title || !fileUrl) {
    return NextResponse.json({ error: "title and fileUrl are required" }, { status: 400 });
  }

  const download = await prisma.download.create({
    data: {
      lessonId: id,
      title,
      fileUrl,
      fileSize: fileSize ?? null,
      type: "pdf",
    },
  });

  return NextResponse.json(download);
}
