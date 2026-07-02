"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S03Page() {
  const config = MODULE_REGISTRY["S03"]!;
  return (
    <DashboardTierGate pillar="S03 — Strategic Coherence Engine" backHref="/s02-strategic-direction" backLabel="Back to Strategic Direction">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
