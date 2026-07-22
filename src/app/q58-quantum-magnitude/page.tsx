"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q58Page() {
  const config = MODULE_REGISTRY["Q58"] ?? buildFallbackConfig("Q58", "Q-Series — Decision Intelligence", "Impact Magnitude Report Engine");
  return (
    <DashboardTierGate pillar="Q58 — Impact Magnitude Report Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
