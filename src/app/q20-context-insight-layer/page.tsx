"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q20Page() {
  const config = MODULE_REGISTRY["Q20"] ?? buildFallbackConfig("Q20", "Q-Series — Decision Intelligence", "Context Insight Layer Engine");
  return (
    <DashboardTierGate pillar="Q20 — Context Insight Layer Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
