"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q80Page() {
  const config = MODULE_REGISTRY["Q80"] ?? buildFallbackConfig("Q80", "Q-Series — Decision Intelligence", "Decision Model Evolution Tracker Engine");
  return (
    <DashboardTierGate pillar="Q80 — Decision Model Evolution Tracker Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
