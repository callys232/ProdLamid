"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q81Page() {
  const config = MODULE_REGISTRY["Q81"] ?? buildFallbackConfig("Q81", "Q-Series — Decision Intelligence", "Organisational Self-Assessment Engine");
  return (
    <DashboardTierGate pillar="Q81 — Organisational Self-Assessment Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
