"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q17Page() {
  const config = MODULE_REGISTRY["Q17"] ?? buildFallbackConfig("Q17", "Q-Series — Decision Intelligence", "Stakeholder Alignment Score Engine");
  return (
    <DashboardTierGate pillar="Q17 — Stakeholder Alignment Score Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
