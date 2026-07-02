"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R25Page() {
  const config = MODULE_REGISTRY["R25"] ?? buildFallbackConfig("R25", "R-Series — Rhythm Intelligence", "Rhythm Origin Engine");
  return (
    <DashboardTierGate pillar="R25 — Rhythm Origin Engine" backHref="/r24-rhythm-continuum" backLabel="Rhythm Continuum">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
