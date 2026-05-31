import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-offcut-links-platform";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "offcut_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isMembersRoute = pathname.startsWith("/members");
  const isAuthPage = pathname === "/login" || pathname === "/admin/login" || pathname === "/register";

  const sessionCookie = request.cookies.get(COOKIE_NAME);

  // 1. Unauthenticated Wall
  if (isAdminRoute || isMembersRoute) {
    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL(pathname.startsWith("/admin") ? "/admin/login" : "/login", request.url);
      // Use fixed callbackUrl to prevent /admin/admin redirect loops
      const callbackUrl = pathname.startsWith("/admin") ? "/admin" : "/members";
      loginUrl.searchParams.set("callbackUrl", callbackUrl);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(sessionCookie.value, SECRET_KEY);
      const role = payload.role as string || "member";

      if (isAdminRoute && role !== "admin") {
        // Standard creators cannot access administration views, send back to creator dashboard
        return NextResponse.redirect(new URL("/members", request.url));
      }

      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL(pathname.startsWith("/admin") ? "/admin/login" : "/login", request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // 2. Active Session Redirects (Prevent already authenticated accounts from accessing login/register)
  if (isAuthPage && sessionCookie && sessionCookie.value) {
    try {
      const { payload } = await jwtVerify(sessionCookie.value, SECRET_KEY);
      const role = payload.role as string || "member";

      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/members", request.url));
      }
    } catch {
      // Invalid cookie, let them access auth pages, clear stale cookie
      const response = NextResponse.next();
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/members/:path*", "/login", "/register"],
};
