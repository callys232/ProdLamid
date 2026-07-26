"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q95Page() {
  const config = MODULE_REGISTRY["Q95"] ?? buildFallbackConfig("Q95", "Q-Series — Decision Intelligence", "Executive Mandate Tracker Engine");
  return (
    <DashboardTierGate pillar="Q95 — Executive Mandate Tracker Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
