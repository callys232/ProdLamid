"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q10Page() {
  const config = MODULE_REGISTRY["Q10"] ?? buildFallbackConfig("Q10", "Q-Series — Decision Intelligence", "Multi-Factor Decision View Engine");
  return (
    <DashboardTierGate pillar="Q10 — Multi-Factor Decision View Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
