"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R26Page() {
  const config = MODULE_REGISTRY["R26"] ?? buildFallbackConfig("R26", "R-Series — Rhythm Intelligence", "Rhythm Source Engine");
  return (
    <DashboardTierGate pillar="R26 — Rhythm Source Engine" backHref="/r25-rhythm-origin" backLabel="Rhythm Origin">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
