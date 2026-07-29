"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function CoreChangeManagementPage() {
  const config = MODULE_REGISTRY["C08"] ?? buildFallbackConfig("C08", "LAMID CORE — Consulting Intelligence", "Change Management Engine");
  return (
    <DashboardTierGate pillar="Change Management" backHref="/core-strategic-alignment" backLabel="Strategic Alignment Engine">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
