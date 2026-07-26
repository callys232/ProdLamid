"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q36Page() {
  const config = MODULE_REGISTRY["Q36"] ?? buildFallbackConfig("Q36", "Q-Series — Decision Intelligence", "Decision Process Tracker Engine");
  return (
    <DashboardTierGate pillar="Decision Process Tracker Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
