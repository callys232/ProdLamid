"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q84Page() {
  const config = MODULE_REGISTRY["Q84"] ?? buildFallbackConfig("Q84", "Q-Series — Decision Intelligence", "Company Values Alignment Engine");
  return (
    <DashboardTierGate pillar="Q84 — Company Values Alignment Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
