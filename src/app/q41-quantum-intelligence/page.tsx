"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q41Page() {
  const config = MODULE_REGISTRY["Q41"] ?? buildFallbackConfig("Q41", "Q-Series — Decision Intelligence", "Decision Intelligence Summary Engine");
  return (
    <DashboardTierGate pillar="Q41 — Decision Intelligence Summary Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
