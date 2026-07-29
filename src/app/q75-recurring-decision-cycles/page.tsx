"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q75Page() {
  const config = MODULE_REGISTRY["Q75"] ?? buildFallbackConfig("Q75", "Q-Series — Decision Intelligence", "Recurring Decision Cycles Engine");
  return (
    <DashboardTierGate pillar="Recurring Decision Cycles" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
