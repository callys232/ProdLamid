"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q69Page() {
  const config = MODULE_REGISTRY["Q69"] ?? buildFallbackConfig("Q69", "Q-Series — Decision Intelligence", "Decision Consistency Diagnostic");
  return (
    <DashboardTierGate pillar="Decision Consistency Diagnostic" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
