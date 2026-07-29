"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q23Page() {
  const config = MODULE_REGISTRY["Q23"] ?? buildFallbackConfig("Q23", "Q-Series — Decision Intelligence", "Decision Architecture Console Engine");
  return (
    <DashboardTierGate pillar="Decision Architecture Console" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
