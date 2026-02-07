import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginPage = nextUrl.pathname === "/login";

  if (isApiAuthRoute) return;

  if (isAdminRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/admin/dashboard", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};