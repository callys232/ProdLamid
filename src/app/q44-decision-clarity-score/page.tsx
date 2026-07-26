"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q44Page() {
  const config = MODULE_REGISTRY["Q44"] ?? buildFallbackConfig("Q44", "Q-Series — Decision Intelligence", "Decision Clarity Score Engine");
  return (
    <DashboardTierGate pillar="Q44 — Decision Clarity Score Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
