"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q67Page() {
  const config = MODULE_REGISTRY["Q67"] ?? buildFallbackConfig("Q67", "Q-Series — Decision Intelligence", "Global Decision Overview Engine");
  return (
    <DashboardTierGate pillar="Q67 — Global Decision Overview Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
