"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q73Page() {
  const config = MODULE_REGISTRY["Q73"] ?? buildFallbackConfig("Q73", "Q-Series — Decision Intelligence", "Decision Sequence Tracker Engine");
  return (
    <DashboardTierGate pillar="Q73 — Decision Sequence Tracker Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
