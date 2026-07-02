"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R18Page() {
  const config = MODULE_REGISTRY["R18"] ?? buildFallbackConfig("R18", "R-Series — Rhythm Intelligence", "Rhythm Spirit Engine");
  return (
    <DashboardTierGate pillar="R18 — Rhythm Spirit Engine" backHref="/r17-rhythm-essence" backLabel="Rhythm Essence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
