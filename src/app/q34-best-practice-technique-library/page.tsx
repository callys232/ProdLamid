"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q34Page() {
  const config = MODULE_REGISTRY["Q34"] ?? buildFallbackConfig("Q34", "Q-Series — Decision Intelligence", "Best-Practice Technique Library Engine");
  return (
    <DashboardTierGate pillar="Best-Practice Technique Library Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
