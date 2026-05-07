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
    <div className="min-h-screen w-screen bg-[#0c0000] text-white overflow-x-hidden flex flex-col transition-colors duration-300">
      {/* Navbar */}
      {!hideLayout && <Navbar />}

      {/* Main Content */}
      <main
        role="main"
        className={`flex-1 w-full overflow-y-auto ${
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
