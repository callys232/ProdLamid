"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q97Page() {
  const config = MODULE_REGISTRY["Q97"] ?? buildFallbackConfig("Q97", "Q-Series — Decision Intelligence", "Compliance & Policy Rules Engine");
  return (
    <DashboardTierGate pillar="Compliance & Policy Rules Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
