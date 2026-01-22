// app/ClientGlobals.tsx
"use client";

import dynamic from "next/dynamic";
import FloatingBot from "@/components/FloatingHelp"; // 👈 import your bot component

// ✅ Lazy‑load heavy components only on client
const AIAgent = dynamic(() => import("@/components/Agent/Onboarding"), {
  ssr: false,
});
const CartDrawer = dynamic(() => import("@/components/cartDrawer"), {
  ssr: false,
});

export default function ClientGlobals() {
  return (
    <>
      <AIAgent />
      <CartDrawer />
      <FloatingBot /> {/* 👈 add your floating bot + Need Help bubble here */}
    </>
  );
}
