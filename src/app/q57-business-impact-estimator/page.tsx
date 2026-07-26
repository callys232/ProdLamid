"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q57Page() {
  const config = MODULE_REGISTRY["Q57"] ?? buildFallbackConfig("Q57", "Q-Series — Decision Intelligence", "Business Impact Estimator Engine");
  return (
    <DashboardTierGate pillar="Q57 — Business Impact Estimator Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
