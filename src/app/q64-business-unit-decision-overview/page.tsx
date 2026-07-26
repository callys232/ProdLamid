"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q64Page() {
  const config = MODULE_REGISTRY["Q64"] ?? buildFallbackConfig("Q64", "Q-Series — Decision Intelligence", "Business Unit Decision Overview Engine");
  return (
    <DashboardTierGate pillar="Q64 — Business Unit Decision Overview Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
