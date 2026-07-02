"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R23Page() {
  const config = MODULE_REGISTRY["R23"] ?? buildFallbackConfig("R23", "R-Series — Rhythm Intelligence", "Rhythm Infinity Engine");
  return (
    <DashboardTierGate pillar="R23 — Rhythm Infinity Engine" backHref="/r22-rhythm-universe" backLabel="Rhythm Universe">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
