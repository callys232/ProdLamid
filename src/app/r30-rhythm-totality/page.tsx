"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R30Page() {
  const config = MODULE_REGISTRY["R30"] ?? buildFallbackConfig("R30", "R-Series — Rhythm Intelligence", "Rhythm Totality Engine");
  return (
    <DashboardTierGate pillar="R30 — Rhythm Totality Engine" backHref="/r29-rhythm-crown" backLabel="Rhythm Crown">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
