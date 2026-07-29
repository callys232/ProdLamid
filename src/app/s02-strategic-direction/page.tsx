"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S02Page() {
  const config = MODULE_REGISTRY["S02"]!;
  return (
    <DashboardTierGate pillar="Strategic Direction Setter" backHref="/s01-strategic-identity" backLabel="Back to Strategic Identity Statement">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
