"use client";

import { useMemo } from "react";
import type { Project } from "@/types/project";
import { getImageOrFallback } from "@/utils/imageFallback";
import HeaderCard from "./headercard";
import HeroImageCard from "./heroCard";
import OverviewCard from "./overviewcard";
import ConsultantsCard from "./consultantCard";
import MilestonesCard from "./milestoneCard";
import FinanceCard from "./financeCard";
import TeamCard from "./teamCard";
import BidCard from "./bidCard";
import ProgressCard from "./progresscard";
import ActivityLog from "./activityLog";
import * as mockData from "@/mocks/mockClient";

interface ProjectOverviewProps {
  project: Project;
  variant?: "thumbnail" | "modal";
}

export default function ProjectOverview({
  project,
  variant = "modal",
}: ProjectOverviewProps) {
  const image = getImageOrFallback(project.image, "/placeholder-project.jpg");

  const sectionClass =
    variant === "thumbnail"
      ? "bg-black/80 border border-[#c21219] rounded-lg p-4 text-white space-y-4"
      : "max-w-6xl mx-auto p-8 text-white space-y-8";

  // ✅ Memoize imported mock data so they remain stable
  const activity = useMemo(() => mockData.mockActivity, []);
  const transactions = useMemo(() => mockData.mockEscrowTransactions, []);
  const teamMembers = useMemo(() => mockData.mockTeamMembers, []);
  const invitations = useMemo(() => mockData.mockInvitations, []);
  const consultants = useMemo(() => mockData.mockConsultants, []);

  return (
    <section className={sectionClass}>
      <HeaderCard project={project} />
      <HeroImageCard image={image} title={project.title} />

      {variant === "modal" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <OverviewCard project={project} />
            <ConsultantsCard consultants={project.consultants || []} />
          </div>

          <MilestonesCard milestones={project.milestones || []} />
          <ProgressCard progress={project.milestoneProgress || 0} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FinanceCard transactions={transactions} budget={project.budget} />
            <TeamCard
              members={teamMembers}
              invitations={invitations}
              consultants={consultants}
            />
          </div>

          <BidCard />
          <ActivityLog items={activity} />
        </>
      )}
    </section>
  );
}
