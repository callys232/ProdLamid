"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q27Page() {
  const config = MODULE_REGISTRY["Q27"] ?? buildFallbackConfig("Q27", "Q-Series — Decision Intelligence", "Decision-Maker Profile Engine");
  return (
    <DashboardTierGate pillar="Q27 — Decision-Maker Profile Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
