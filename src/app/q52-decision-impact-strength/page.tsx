"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q52Page() {
  const config = MODULE_REGISTRY["Q52"] ?? buildFallbackConfig("Q52", "Q-Series — Decision Intelligence", "Decision Impact Strength Engine");
  return (
    <DashboardTierGate pillar="Q52 — Decision Impact Strength Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
