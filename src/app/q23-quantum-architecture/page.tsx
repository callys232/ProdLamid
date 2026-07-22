"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q23Page() {
  const config = MODULE_REGISTRY["Q23"] ?? buildFallbackConfig("Q23", "Q-Series — Decision Intelligence", "Decision Architecture Console Engine");
  return (
    <DashboardTierGate pillar="Q23 — Decision Architecture Console Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
