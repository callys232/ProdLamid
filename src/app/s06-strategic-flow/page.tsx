"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S06Page() {
  const config = MODULE_REGISTRY["S06"]!;
  return (
    <DashboardTierGate pillar="S06 — Strategic Flow Engine" backHref="/s05-strategic-rhythm" backLabel="Back to Strategic Rhythm">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
