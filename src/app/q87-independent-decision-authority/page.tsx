"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q87Page() {
  const config = MODULE_REGISTRY["Q87"] ?? buildFallbackConfig("Q87", "Q-Series — Decision Intelligence", "Independent Decision Authority Engine");
  return (
    <DashboardTierGate pillar="Q87 — Independent Decision Authority Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
