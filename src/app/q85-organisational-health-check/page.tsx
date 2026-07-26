"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q85Page() {
  const config = MODULE_REGISTRY["Q85"] ?? buildFallbackConfig("Q85", "Q-Series — Decision Intelligence", "Organisational Health Check Engine");
  return (
    <DashboardTierGate pillar="Q85 — Organisational Health Check Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
