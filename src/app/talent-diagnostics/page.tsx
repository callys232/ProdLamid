"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function TalentDiagnosticsPage() {
  const config = MODULE_REGISTRY["A07"] ?? buildFallbackConfig("A07", "LAMID TALENT — Workforce Intelligence", "Talent Diagnostics Engine");
  return (
    <DashboardTierGate pillar="A07 — Talent Diagnostics Engine" backHref="/talent-workforce-readiness" backLabel="Workforce Readiness">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
