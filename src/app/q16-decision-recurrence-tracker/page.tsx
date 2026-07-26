"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q16Page() {
  const config = MODULE_REGISTRY["Q16"] ?? buildFallbackConfig("Q16", "Q-Series — Decision Intelligence", "Decision Recurrence Tracker Engine");
  return (
    <DashboardTierGate pillar="Q16 — Decision Recurrence Tracker Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
