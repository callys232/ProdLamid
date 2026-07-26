"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q26Page() {
  const config = MODULE_REGISTRY["Q26"] ?? buildFallbackConfig("Q26", "Q-Series — Decision Intelligence", "Decision Signature Report Engine");
  return (
    <DashboardTierGate pillar="Q26 — Decision Signature Report Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
