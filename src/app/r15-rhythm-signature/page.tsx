"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R15Page() {
  const config = MODULE_REGISTRY["R15"] ?? buildFallbackConfig("R15", "R-Series — Rhythm Intelligence", "Rhythm Signature Engine");
  return (
    <DashboardTierGate pillar="R15 — Rhythm Signature Engine" backHref="/r14-rhythm-pulse" backLabel="Rhythm Pulse">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
