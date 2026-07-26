"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q83Page() {
  const config = MODULE_REGISTRY["Q83"] ?? buildFallbackConfig("Q83", "Q-Series — Decision Intelligence", "Decision Culture Profile Engine");
  return (
    <DashboardTierGate pillar="Decision Culture Profile Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
