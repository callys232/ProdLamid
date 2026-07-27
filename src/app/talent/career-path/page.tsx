"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import CareerPathTool from "@/components/lamidOne/CareerPathTool";

export default function CareerPathPage() {
  return (
    <DashboardTierGate pillar="Career Path Assessment" backHref="/talent-dashboard" backLabel="Talent Dashboard">
      <CareerPathTool />
    </DashboardTierGate>
  );
}
