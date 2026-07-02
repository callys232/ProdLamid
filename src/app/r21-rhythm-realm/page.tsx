"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R21Page() {
  const config = MODULE_REGISTRY["R21"] ?? buildFallbackConfig("R21", "R-Series — Rhythm Intelligence", "Rhythm Realm Engine");
  return (
    <DashboardTierGate pillar="R21 — Rhythm Realm Engine" backHref="/r20-rhythm-domain" backLabel="Rhythm Domain">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
