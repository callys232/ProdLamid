"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q33Page() {
  const config = MODULE_REGISTRY["Q33"] ?? buildFallbackConfig("Q33", "Q-Series — Decision Intelligence", "Decision-Making Skill Score Engine");
  return (
    <DashboardTierGate pillar="Q33 — Decision-Making Skill Score Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
