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

const BASE = process.env.NEXT_PUBLIC_URL ?? "https://lamid.io";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default:  "AIVORA — The HumanAI Consulting Ecosystem",
    template: "%s | AIVORA",
  },
  description:
    "AIVORA blends trusted expertise with advanced AI to deliver smarter, faster, accessible solutions " +
    "for organizations seeking clarity and growth. Expert matching, BIZ intelligence, and talent development — in one ecosystem.",
  keywords: ["AIVORA", "HumanAI consulting", "consulting ecosystem", "AI consulting", "expert matching", "talent development", "business intelligence", "Africa", "global"],
  authors:  [{ name: "AIVORA", url: BASE }],
  openGraph: {
    type:        "website",
    url:         BASE,
    siteName:    "AIVORA",
    title:       "AIVORA — The HumanAI Consulting Ecosystem",
    description: "Smarter. Faster. Accessible. Expert matching, AI-powered intelligence, and talent development in one unified platform.",
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: "AIVORA — The HumanAI Consulting Ecosystem" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "AIVORA — The HumanAI Consulting Ecosystem",
    description: "Smarter. Faster. Accessible. Trusted expertise + advanced AI in one unified platform.",
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
        </ThemeProvider>
      </body>
    </html>
  );
}
