import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

// The session cookie name must match what's in session.ts
const SESSION_COOKIE_NAME = "padi_admin_session";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is under /admin
  const isAdminRoute = path.startsWith("/admin");
  const isLoginRoute = path === "/login";

  // Read the session cookie
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decrypt(cookie);
  const isAuthenticated = !!session?.userId && session.role === "ADMIN";

  // LAYER 1 PROTECTION: Redirect unauthenticated users from admin routes
  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated admins away from login page
  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }

  // Refresh session expiry on each request to keep users logged in
  const response = NextResponse.next();
  return response;
}

// Routes Proxy should run on
export const config = {
  matcher: [
    // Run on all routes except static files, images, and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
