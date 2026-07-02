"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R19Page() {
  const config = MODULE_REGISTRY["R19"] ?? buildFallbackConfig("R19", "R-Series — Rhythm Intelligence", "Rhythm Field Engine");
  return (
    <DashboardTierGate pillar="R19 — Rhythm Field Engine" backHref="/r18-rhythm-spirit" backLabel="Rhythm Spirit">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
