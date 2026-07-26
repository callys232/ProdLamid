"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q02Page() {
  const config = MODULE_REGISTRY["Q02"] ?? buildFallbackConfig("Q02", "Q-Series — Decision Intelligence", "Current Decision Status Engine");
  return (
    <DashboardTierGate pillar="Q02 — Current Decision Status Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
