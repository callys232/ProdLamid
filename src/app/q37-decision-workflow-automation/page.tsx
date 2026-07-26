"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q37Page() {
  const config = MODULE_REGISTRY["Q37"] ?? buildFallbackConfig("Q37", "Q-Series — Decision Intelligence", "Decision Workflow Automation Engine");
  return (
    <DashboardTierGate pillar="Q37 — Decision Workflow Automation Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
