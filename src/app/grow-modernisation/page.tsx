"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function GrowModernisationPage() {
  const config = MODULE_REGISTRY["G04"] ?? buildFallbackConfig("G04", "LAMID GROW — Growth Intelligence", "Modernisation Readiness Engine");
  return (
    <DashboardTierGate pillar="G04 — Modernisation Readiness Engine" backHref="/grow-pathways" backLabel="Growth Pathways">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
