"use client";
import ProjectHeader from "./projectHeader";
import ProjectSummary from "./projectSummary";
import MilestonesCard from "./milestoneC";
import SkillsCard from "./skillsCard";
import EscrowCard from "./escrowC";
import AnalyticsCard from "./analyticsCard";

export default function Overview({ projectId }: { projectId: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Top row */}
      <ProjectHeader projectId={projectId} />
      <SkillsCard projectId={projectId} />
      <ProjectSummary projectId={projectId} />

      {/* Bottom row */}
      <EscrowCard projectId={projectId} />
      <MilestonesCard projectId={projectId} />
      <AnalyticsCard projectId={projectId} />
    </div>
  );
}
