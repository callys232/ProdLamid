"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A18Page() {
  const config = MODULE_REGISTRY["A18"] ?? buildFallbackConfig("A18", "A-Series — TALENT Intelligence", "Talent Acceleration Engine — Part II");
  return (
    <DashboardTierGate pillar="Talent Acceleration Engine — Part II" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
