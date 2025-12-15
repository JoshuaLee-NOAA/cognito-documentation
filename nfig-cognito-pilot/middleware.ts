/**
 * NextAuth Middleware for Route Protection
 * 
 * Protects routes that require authentication.
 * Unauthenticated users are redirected to the home page.
 * 
 * FR-3.5: After logout, attempting to access protected pages must redirect
 */

export { auth as middleware } from "@/lib/auth";

/**
 * Matcher configuration
 * Specifies which routes should be protected by the middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (except /api/auth which NextAuth handles)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - home page (/)
     * - test page (/test)
     */
    "/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|.*\\..*|test|$).*)",
  ],
};
