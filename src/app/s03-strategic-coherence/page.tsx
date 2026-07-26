"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S03Page() {
  const config = MODULE_REGISTRY["S03"]!;
  return (
    <DashboardTierGate pillar="S03 — Strategy Consistency Check Engine" backHref="/s02-strategic-direction" backLabel="Back to Strategic Direction Setter">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
