"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P17Page() {
  const config = MODULE_REGISTRY["P17"] ?? buildFallbackConfig("P17", "P-Series — Enterprise Productivity", "Collaboration Engine");
  return (
    <DashboardTierGate pillar="P17 — Collaboration Engine" backHref="/p16-team-productivity" backLabel="Team Productivity">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
