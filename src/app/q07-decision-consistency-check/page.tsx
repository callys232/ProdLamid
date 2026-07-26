"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q07Page() {
  const config = MODULE_REGISTRY["Q07"] ?? buildFallbackConfig("Q07", "Q-Series — Decision Intelligence", "Decision Consistency Check Engine");
  return (
    <DashboardTierGate pillar="Q07 — Decision Consistency Check Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
