"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q12Page() {
  const config = MODULE_REGISTRY["Q12"] ?? buildFallbackConfig("Q12", "Q-Series — Decision Intelligence", "Full Scenario Explorer Engine");
  return (
    <DashboardTierGate pillar="Q12 — Full Scenario Explorer Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
