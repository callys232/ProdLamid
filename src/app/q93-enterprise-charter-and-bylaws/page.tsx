"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q93Page() {
  const config = MODULE_REGISTRY["Q93"] ?? buildFallbackConfig("Q93", "Q-Series — Decision Intelligence", "Enterprise Charter & Bylaws Engine");
  return (
    <DashboardTierGate pillar="Enterprise Charter & Bylaws Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
