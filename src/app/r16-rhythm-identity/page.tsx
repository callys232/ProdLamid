"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R16Page() {
  const config = MODULE_REGISTRY["R16"] ?? buildFallbackConfig("R16", "R-Series — Rhythm Intelligence", "Rhythm Identity Engine");
  return (
    <DashboardTierGate pillar="R16 — Rhythm Identity Engine" backHref="/r15-rhythm-signature" backLabel="Rhythm Signature">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
