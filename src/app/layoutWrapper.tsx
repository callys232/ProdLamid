// app/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import ModalWrapper from "@/components/ModalWrapper";
import AIAgent from "@/components/Agent/Onboarding";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Ensure pathname is always a string
  const pathname = usePathname() ?? "";

  // ✅ Hide layout elements on these routes (and their sub‑routes)
  const noLayoutRoutes = ["/signin", "/signup", "/admin"];
  const hideLayout = noLayoutRoutes.some((path) => pathname.startsWith(path));

  return (
    <div className="min-h-screen w-screen overflow-x-hidden flex flex-col transition-colors duration-300">

      {/* ── Site-wide vector line background ── */}
      <svg
        aria-hidden="true"
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
      >
        {/* Full-span diagonals */}
        <line x1="0"    y1="0"   x2="1440" y2="900" stroke="#ffffff" strokeWidth="0.5" opacity="0.03" />
        <line x1="1440" y1="0"   x2="0"    y2="900" stroke="#ffffff" strokeWidth="0.4" opacity="0.025" />
        <line x1="0"    y1="450" x2="1440" y2="0"   stroke="#ffffff" strokeWidth="0.3" opacity="0.02" />
        <line x1="0"    y1="450" x2="1440" y2="900" stroke="#ffffff" strokeWidth="0.3" opacity="0.02" />

        {/* Red accent diagonals — top-left origin */}
        <line x1="0" y1="0"   x2="720"  y2="900" stroke="#2563EB" strokeWidth="0.6" opacity="0.07" />
        <line x1="0" y1="0"   x2="1440" y2="600" stroke="#2563EB" strokeWidth="0.4" opacity="0.05" />
        <line x1="0" y1="180" x2="900"  y2="900" stroke="#2563EB" strokeWidth="0.5" opacity="0.04" />

        {/* Red accent diagonals — bottom-right origin */}
        <line x1="1440" y1="900" x2="720"  y2="0"   stroke="#2563EB" strokeWidth="0.6" opacity="0.07" />
        <line x1="1440" y1="900" x2="0"    y2="300"  stroke="#2563EB" strokeWidth="0.4" opacity="0.05" />
        <line x1="1440" y1="720" x2="540"  y2="0"    stroke="#2563EB" strokeWidth="0.5" opacity="0.04" />

        {/* Subtle horizontal guidelines */}
        <line x1="0" y1="300" x2="1440" y2="300" stroke="#ffffff" strokeWidth="0.3" opacity="0.018" />
        <line x1="0" y1="600" x2="1440" y2="600" stroke="#ffffff" strokeWidth="0.3" opacity="0.018" />

        {/* Subtle vertical guidelines */}
        <line x1="360"  y1="0" x2="360"  y2="900" stroke="#ffffff" strokeWidth="0.3" opacity="0.018" />
        <line x1="720"  y1="0" x2="720"  y2="900" stroke="#ffffff" strokeWidth="0.3" opacity="0.015" />
        <line x1="1080" y1="0" x2="1080" y2="900" stroke="#ffffff" strokeWidth="0.3" opacity="0.018" />

        {/* Top-left corner accent cluster */}
        <line x1="0" y1="0" x2="260" y2="420" stroke="#2563EB" strokeWidth="0.8" opacity="0.09" />
        <line x1="0" y1="0" x2="480" y2="160" stroke="#2563EB" strokeWidth="0.6" opacity="0.07" />
        <line x1="0" y1="0" x2="140" y2="900" stroke="#ffffff" strokeWidth="0.4" opacity="0.025" />

        {/* Bottom-right corner accent cluster */}
        <line x1="1440" y1="900" x2="1180" y2="480" stroke="#2563EB" strokeWidth="0.8" opacity="0.09" />
        <line x1="1440" y1="900" x2="960"  y2="740" stroke="#2563EB" strokeWidth="0.6" opacity="0.07" />
        <line x1="1440" y1="900" x2="1300" y2="0"   stroke="#ffffff" strokeWidth="0.4" opacity="0.025" />

        {/* Mid-field cross accents */}
        <line x1="200"  y1="0"   x2="1240" y2="900" stroke="#ffffff" strokeWidth="0.35" opacity="0.02" />
        <line x1="1240" y1="0"   x2="200"  y2="900" stroke="#ffffff" strokeWidth="0.35" opacity="0.02" />
      </svg>

      {/* Navbar */}
      {!hideLayout && <Navbar />}

      {/* Main Content */}
      <main
        role="main"
        className={`relative z-10 flex-1 w-full overflow-y-auto ${
          !hideLayout ? "pt-20" : ""
        }`}
      >
        {children}
      </main>

      {/* Footer */}
      {!hideLayout && <Footer />}

      {/* Modal */}
      {!hideLayout && <ModalWrapper />}

      {/* AI Chat Assistant */}
      {!hideLayout && <AIAgent />}
    </div>
  );
}
