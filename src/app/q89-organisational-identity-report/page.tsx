"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q89Page() {
  const config = MODULE_REGISTRY["Q89"] ?? buildFallbackConfig("Q89", "Q-Series — Decision Intelligence", "Organisational Identity Report Engine");
  return (
    <DashboardTierGate pillar="Q89 — Organisational Identity Report Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
