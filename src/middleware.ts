import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication — redirect to /signin if no token
const PROTECTED = ["/client", "/profile", "/enterprise", "/admin", "/postjobs", "/escrow", "/projects", "/dashboard"];

// Routes that authenticated users should not visit
const AUTH_ONLY = ["/signin", "/signup", "/account-type", "/forgotpassword"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // ── Route guards ──────────────────────────────────────────────
  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  const isAuthOnly  = AUTH_ONLY.some(p => pathname.startsWith(p));

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthOnly && token) {
    return NextResponse.redirect(new URL("/client", request.url));
  }

  // ── Security headers ──────────────────────────────────────────
  const res = NextResponse.next();

  res.headers.set("X-Content-Type-Options",   "nosniff");
  res.headers.set("X-Frame-Options",           "DENY");
  res.headers.set("X-XSS-Protection",          "1; mode=block");
  res.headers.set("Referrer-Policy",           "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy",        "camera=(), microphone=(), geolocation=()");
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com",
      "connect-src 'self' https://api.paystack.co https://openrouter.ai",
      "frame-src https://checkout.paystack.com",
    ].join("; ")
  );

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)).*)",
  ],
};
