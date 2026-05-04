// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "./layoutWrapper";
import { Toaster } from "react-hot-toast";
import { inter, playfair } from "../fonts";
import { CartProvider } from "@/components/Cartcontext";
import ClientGlobals from "./ClientGlobal";
import CookieConsent from "@/components/CookieConsent";

const BASE = process.env.NEXT_PUBLIC_URL ?? "https://lamid.io";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default:  "Lamid — AI-Powered Consulting Marketplace",
    template: "%s | Lamid",
  },
  description:
    "Source, manage, and pay world-class consultants across 20 specialist categories. " +
    "AI-powered matching, milestone escrow, and enterprise workspaces.",
  keywords: ["consulting", "freelance", "consultant marketplace", "project management", "escrow", "Nigeria", "Africa", "UK"],
  authors:  [{ name: "Lamid", url: BASE }],
  openGraph: {
    type:        "website",
    url:         BASE,
    siteName:    "Lamid Consulting",
    title:       "Lamid — AI-Powered Consulting Marketplace",
    description: "Source world-class consultants. AI matching, secure escrow, enterprise workspaces.",
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: "Lamid Consulting" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Lamid — AI-Powered Consulting Marketplace",
    description: "Source world-class consultants across 20 categories.",
    images:      [`${BASE}/og-image.png`],
  },
  robots: { index: true, follow: true },
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
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className="antialiased font-sans bg-[#0c0000] text-white min-h-screen flex flex-col">
        <CartProvider>
          {/* Layout wrapper for navbar, footer, main content */}
          <LayoutWrapper>{children}</LayoutWrapper>

          {/* Global Toast notifications */}
          <Toaster position="top-right" />

          {/* ✅ Client-only globals */}
          <ClientGlobals />
          <CookieConsent />
        </CartProvider>
      </body>
    </html>
  );
}
