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
    default:  "Lamid — Human and AI-Assisted Consulting Marketplace",
    template: "%s | Lamid",
  },
  description:
    "Source, manage, and pay world-class consultants across 20 specialist categories. " +
    "AI-assisted matching, milestone escrow, and enterprise workspaces.",
  keywords: ["consulting", "freelance", "consultant marketplace", "project management", "escrow", "Nigeria", "Africa", "UK"],
  authors:  [{ name: "Lamid", url: BASE }],
  openGraph: {
    type:        "website",
    url:         BASE,
    siteName:    "Lamid Consulting",
    title:       "Lamid — Human and AI-Assisted Consulting Marketplace",
    description: "Source world-class consultants. AI matching, secure escrow, enterprise workspaces.",
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: "Lamid Consulting" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Lamid — Human and AI-Assisted Consulting Marketplace",
    description: "Source world-class consultants across 20 categories.",
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
