"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q08Page() {
  const config = MODULE_REGISTRY["Q08"] ?? buildFallbackConfig("Q08", "Q-Series — Decision Intelligence", "Decision Finalization Engine");
  return (
    <DashboardTierGate pillar="Q08 — Decision Finalization Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
