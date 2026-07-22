"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q54Page() {
  const config = MODULE_REGISTRY["Q54"] ?? buildFallbackConfig("Q54", "Q-Series — Decision Intelligence", "Decision Momentum Tracker Engine");
  return (
    <DashboardTierGate pillar="Q54 — Decision Momentum Tracker Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
