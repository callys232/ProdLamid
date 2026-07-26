"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A27Page() {
  const config = MODULE_REGISTRY["A27"] ?? buildFallbackConfig("A27", "A-Series — TALENT Intelligence", "Engagement & Culture Signals Engine");
  return (
    <DashboardTierGate pillar="A27 — Engagement & Culture Signals Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
