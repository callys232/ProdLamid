"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q42Page() {
  const config = MODULE_REGISTRY["Q42"] ?? buildFallbackConfig("Q42", "Q-Series — Decision Intelligence", "Organizational Insight Index Engine");
  return (
    <DashboardTierGate pillar="Organizational Insight Index" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
