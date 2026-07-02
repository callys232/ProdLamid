"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q12Page() {
  const config = MODULE_REGISTRY["Q12"] ?? buildFallbackConfig("Q12", "Q-Series — Quality Intelligence", "Quality Integration Engine");
  return (
    <DashboardTierGate pillar="Q12 — Quality Integration Engine" backHref="/q11-quality-coherence" backLabel="Quality Coherence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
