"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R14Page() {
  const config = MODULE_REGISTRY["R14"] ?? buildFallbackConfig("R14", "R-Series — Rhythm Intelligence", "Rhythm Pulse Engine");
  return (
    <DashboardTierGate pillar="R14 — Rhythm Pulse Engine" backHref="/r13-rhythm-resonance" backLabel="Rhythm Resonance">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
