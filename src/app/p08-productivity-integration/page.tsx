"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P08Page() {
  const config = MODULE_REGISTRY["P08"] ?? buildFallbackConfig("P08", "P-Series — Enterprise Productivity", "Productivity Integration Engine");
  return (
    <DashboardTierGate pillar="P08 — Productivity Integration Engine" backHref="/p07-productivity-coherence" backLabel="Productivity Coherence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
