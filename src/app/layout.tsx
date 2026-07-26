// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutWrapper from "./layoutWrapper";
import { Toaster } from "react-hot-toast";
import { inter, playfair, spaceGrotesk } from "../fonts";
import { CartProvider } from "@/components/Cartcontext";
import ClientGlobals from "./ClientGlobal";
import CookieConsent from "@/components/CookieConsent";
import StickmanBg from "@/components/StickmanBg";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthRefreshProvider from "@/components/AuthRefreshProvider";

const BASE = process.env.NEXT_PUBLIC_URL ?? "https://lamid.io";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default:  "LAMID ONE — The HumanAI Consulting & Growth Ecosystem",
    template: "%s | LAMID ONE",
  },
  description:
    "Diagnose, transform, and accelerate your organization with clarity, intelligence, and trust. " +
    "One unified HumanAI ecosystem — LAMID CORE, LAMID GROW, LAMID TALENT, and LAMID FINANCE.",
  keywords: ["LAMID ONE", "LAMID CORE", "LAMID GROW", "LAMID TALENT", "HumanAI consulting", "consulting ecosystem", "AI consulting", "expert matching", "talent development", "business intelligence", "global", "enterprise consulting"],
  authors:  [{ name: "LAMID ONE", url: BASE }],
  openGraph: {
    type:        "website",
    url:         BASE,
    siteName:    "LAMID ONE",
    title:       "LAMID ONE — The HumanAI Consulting & Growth Ecosystem",
    description: "Human insight. AI precision. One ecosystem. LAMID CORE, LAMID GROW, and LAMID TALENT — unified.",
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: "LAMID ONE — The HumanAI Consulting & Growth Ecosystem" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "LAMID ONE — The HumanAI Consulting & Growth Ecosystem",
    description: "Human insight. AI precision. One ecosystem.",
    images:      [`${BASE}/og-image.png`],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: BASE },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${spaceGrotesk.variable}`}
    >
      <body className="antialiased font-sans min-h-screen flex flex-col">
        <ThemeProvider>
        <AuthRefreshProvider>
        <CartProvider>
          {/* Running stickman background — fixed, behind all content */}
          <StickmanBg />

          {/* Layout wrapper for navbar, footer, main content */}
          <LayoutWrapper>{children}</LayoutWrapper>

          {/* Global Toast notifications */}
          <Toaster position="top-right" />

          {/* ✅ Client-only globals */}
          <ClientGlobals />
          <CookieConsent />
        </CartProvider>
        </AuthRefreshProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
