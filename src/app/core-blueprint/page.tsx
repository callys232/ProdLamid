"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function CoreBlueprintPage() {
  const config = MODULE_REGISTRY["C06"] ?? buildFallbackConfig("C06", "LAMID CORE — Consulting Intelligence", "Blueprint Generator");
  return (
    <DashboardTierGate pillar="C06 — Blueprint Generator" backHref="/core-operating-rhythm" backLabel="Operating Rhythm Engine">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
