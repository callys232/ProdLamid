"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q78Page() {
  const config = MODULE_REGISTRY["Q78"] ?? buildFallbackConfig("Q78", "Q-Series — Decision Intelligence", "Cross-Team Decision Convergence Engine");
  return (
    <DashboardTierGate pillar="Q78 — Cross-Team Decision Convergence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
