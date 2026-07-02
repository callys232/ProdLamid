"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R12Page() {
  const config = MODULE_REGISTRY["R12"] ?? buildFallbackConfig("R12", "R-Series — Rhythm Intelligence", "Rhythm Flow Engine");
  return (
    <DashboardTierGate pillar="R12 — Rhythm Flow Engine" backHref="/r11-rhythm-synchronization" backLabel="Rhythm Synchronization">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
