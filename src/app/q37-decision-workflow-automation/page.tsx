"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q37Page() {
  const config = MODULE_REGISTRY["Q37"] ?? buildFallbackConfig("Q37", "Q-Series — Decision Intelligence", "Decision Workflow Automation Engine");
  return (
    <DashboardTierGate pillar="Decision Workflow Automation" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
