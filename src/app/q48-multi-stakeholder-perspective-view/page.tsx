"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q48Page() {
  const config = MODULE_REGISTRY["Q48"] ?? buildFallbackConfig("Q48", "Q-Series — Decision Intelligence", "Multi-Stakeholder Perspective View Engine");
  return (
    <DashboardTierGate pillar="Multi-Stakeholder Perspective View" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
