"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S02Page() {
  const config = MODULE_REGISTRY["S02"]!;
  return (
    <DashboardTierGate pillar="S02 — Strategic Direction Setter Engine" backHref="/s01-strategic-identity" backLabel="Back to Strategic Identity Statement">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
