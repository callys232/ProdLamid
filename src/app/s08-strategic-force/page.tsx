"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S08Page() {
  const config = MODULE_REGISTRY["S08"]!;
  return (
    <DashboardTierGate pillar="S08 — Strategic Momentum Score Engine" backHref="/s07-strategic-field" backLabel="Back to Strategic Cadence Impact Map">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
