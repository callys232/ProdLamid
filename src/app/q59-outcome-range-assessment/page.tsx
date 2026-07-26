"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q59Page() {
  const config = MODULE_REGISTRY["Q59"] ?? buildFallbackConfig("Q59", "Q-Series — Decision Intelligence", "Outcome Range Forecast Engine");
  return (
    <DashboardTierGate pillar="Q59 — Outcome Range Forecast Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
