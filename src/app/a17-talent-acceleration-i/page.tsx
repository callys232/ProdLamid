"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A17Page() {
  const config = MODULE_REGISTRY["A17"] ?? buildFallbackConfig("A17", "A-Series — TALENT Intelligence", "Talent Acceleration Engine — Part I");
  return (
    <DashboardTierGate pillar="A17 — Talent Acceleration Engine — Part I" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
