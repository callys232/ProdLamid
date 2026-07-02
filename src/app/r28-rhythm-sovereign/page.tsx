"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R28Page() {
  const config = MODULE_REGISTRY["R28"] ?? buildFallbackConfig("R28", "R-Series — Rhythm Intelligence", "Rhythm Sovereign Engine");
  return (
    <DashboardTierGate pillar="R28 — Rhythm Sovereign Engine" backHref="/r27-rhythm-apex" backLabel="Rhythm Apex">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
