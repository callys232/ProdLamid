"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q49Page() {
  const config = MODULE_REGISTRY["Q49"] ?? buildFallbackConfig("Q49", "Q-Series — Decision Intelligence", "Decision Rationale Explainer Engine");
  return (
    <DashboardTierGate pillar="Q49 — Decision Rationale Explainer Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
