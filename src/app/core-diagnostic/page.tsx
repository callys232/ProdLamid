"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function CoreDiagnosticPage() {
  const config = MODULE_REGISTRY["C03"] ?? buildFallbackConfig("C03", "LAMID CORE — Consulting Intelligence", "Diagnostic Engine");
  return (
    <DashboardTierGate pillar="Diagnostic Engine" backHref="/core-workflow" backLabel="Workflow Engine">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
