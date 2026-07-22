"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q69Page() {
  const config = MODULE_REGISTRY["Q69"] ?? buildFallbackConfig("Q69", "Q-Series — Decision Intelligence", "Continuous Decision Tracking Engine");
  return (
    <DashboardTierGate pillar="Q69 — Continuous Decision Tracking Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
