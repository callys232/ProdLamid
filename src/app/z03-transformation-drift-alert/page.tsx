"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z03Page() {
  const config = MODULE_REGISTRY["Z03"] ?? buildFallbackConfig("Z03", "Z-Series — Transformation Intelligence", "Transformation Drift Alert Engine");
  return (
    <DashboardTierGate pillar="Z03 — Transformation Drift Alert Engine" backHref="/z02-pace-of-transformation" backLabel="Pace of Transformation">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
