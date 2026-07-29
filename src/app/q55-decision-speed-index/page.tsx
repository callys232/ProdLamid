"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q55Page() {
  const config = MODULE_REGISTRY["Q55"] ?? buildFallbackConfig("Q55", "Q-Series — Decision Intelligence", "Decision Speed Index Engine");
  return (
    <DashboardTierGate pillar="Decision Speed Index" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
