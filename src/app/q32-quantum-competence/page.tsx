"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q32Page() {
  const config = MODULE_REGISTRY["Q32"] ?? buildFallbackConfig("Q32", "Q-Series — Decision Intelligence", "Team Decision Capability Score Engine");
  return (
    <DashboardTierGate pillar="Q32 — Team Decision Capability Score Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
