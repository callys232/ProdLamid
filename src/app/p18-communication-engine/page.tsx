"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P18Page() {
  const config = MODULE_REGISTRY["P18"] ?? buildFallbackConfig("P18", "P-Series — Enterprise Productivity", "Communication Engine");
  return (
    <DashboardTierGate pillar="P18 — Communication Engine" backHref="/p17-collaboration-engine" backLabel="Collaboration Engine">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
