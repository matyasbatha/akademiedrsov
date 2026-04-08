import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isActiveMembership } from "@/lib/stripe";
import CertificatePDF from "@/components/CertificatePDF";
import React from "react";

interface Params {
  params: Promise<{ courseId: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;

  const [course, membership] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId, isPublished: true },
    }),
    prisma.membership.findUnique({ where: { userId: session.user.id } }),
  ]);

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const isActive = isActiveMembership(membership?.status);
  const canAccess = isActive || course.isFree || session.user.role === "ADMIN";

  if (!canAccess) {
    return NextResponse.json({ error: "Membership required" }, { status: 403 });
  }

  const recipientName = session.user.name ?? session.user.email ?? "Absolvent";
  const date = new Date().toLocaleDateString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const buffer = await renderToBuffer(
    React.createElement(CertificatePDF, {
      recipientName,
      courseName: course.title,
      issuerName: "Matyáš Baťha, Dis.",
      date,
    })
  );

  const safeName = course.title.replace(/[^a-z0-9áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s]/gi, "").trim();
  const filename = `Certifikát_${recipientName}_${safeName}.pdf`
    .replace(/\s+/g, "_");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
