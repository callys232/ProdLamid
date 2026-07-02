"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q14Page() {
  const config = MODULE_REGISTRY["Q14"] ?? buildFallbackConfig("Q14", "Q-Series — Quality Intelligence", "Quality Convergence Engine");
  return (
    <DashboardTierGate pillar="Q14 — Quality Convergence Engine" backHref="/q13-quality-alignment" backLabel="Quality Alignment">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
