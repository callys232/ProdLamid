"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q36Page() {
  const config = MODULE_REGISTRY["Q36"] ?? buildFallbackConfig("Q36", "Q-Series — Decision Intelligence", "Decision Process Tracker Engine");
  return (
    <DashboardTierGate pillar="Q36 — Decision Process Tracker Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
