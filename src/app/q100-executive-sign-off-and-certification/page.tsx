"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q100Page() {
  const config = MODULE_REGISTRY["Q100"] ?? buildFallbackConfig("Q100", "Q-Series — Decision Intelligence", "Executive Sign-Off & Certification");
  return (
    <DashboardTierGate pillar="Executive Sign-Off & Certification" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
