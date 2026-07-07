// app/ClientGlobals.tsx
"use client";

import dynamic from "next/dynamic";
import FloatingBot from "@/components/FloatingHelp"; // 👈 import your bot component
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

// ✅ Lazy‑load heavy components only on client
const AIAgent = dynamic(() => import("@/components/Agent/Onboarding"), {
  ssr: false,
});
const CartDrawer = dynamic(() => import("@/components/cartDrawer"), {
  ssr: false,
});

export default function ClientGlobals() {
  const { user, isAuthenticated } = useAuth();
  const { showOnboarding, completeOnboarding } = useOnboarding();

  return (
    <>
      <AIAgent />
      <CartDrawer />
      <FloatingBot /> {/* 👈 add your floating bot + Need Help bubble here */}

      {/* Post-signup onboarding wizard — only for authenticated users who haven't completed it */}
      {isAuthenticated && user && showOnboarding && (
        <OnboardingWizard user={user} onComplete={completeOnboarding} />
      )}
    </>
  );
}
