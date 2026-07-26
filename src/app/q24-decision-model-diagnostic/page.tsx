"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q24Page() {
  const config = MODULE_REGISTRY["Q24"] ?? buildFallbackConfig("Q24", "Q-Series — Decision Intelligence", "Decision Model Diagnostic");
  return (
    <DashboardTierGate pillar="Q24 — Decision Model Diagnostic" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
