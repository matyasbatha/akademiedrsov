import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/clenstvi",
  "/prihlaseni",
  "/registrace",
  "/api/auth",
  "/api/stripe/webhook",
];

const memberRoutes = ["/dashboard", "/kurzy", "/lekce", "/ucet"];
const adminRoutes = ["/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  if (isPublic) return NextResponse.next();

  const isAdmin = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  if (isAdmin) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/prihlaseni", req.url));
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  const isMember = memberRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  if (isMember) {
    if (!session?.user) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/prihlaseni?callbackUrl=${callbackUrl}`, req.url)
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
