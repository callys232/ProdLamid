"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q30Page() {
  const config = MODULE_REGISTRY["Q30"] ?? buildFallbackConfig("Q30", "Q-Series — Decision Intelligence", "Decision Function Library Engine");
  return (
    <DashboardTierGate pillar="Q30 — Decision Function Library Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
