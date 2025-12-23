// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "./layoutWrapper";
import { Toaster } from "react-hot-toast";
import { inter, playfair } from "../fonts";
import { CartProvider } from "@/components/Cartcontext";
import ClientGlobals from "./ClientGlobal"; // ✅ import client wrapper

export const metadata: Metadata = {
  title: "Lamid Consulting",
  description: "International Management Consultants",
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
        </CartProvider>
      </body>
    </html>
  );
}
