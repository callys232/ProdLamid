"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q96Page() {
  const config = MODULE_REGISTRY["Q96"] ?? buildFallbackConfig("Q96", "Q-Series — Decision Intelligence", "Decision Protocol Library Engine");
  return (
    <DashboardTierGate pillar="Q96 — Decision Protocol Library Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
