"use client";
import React from "react";
import EscrowStats from "./escrowStat";
import AlertsPanel from "./alertsCard";
import NotificationsPanel from "./notifs";
import ProjectStats from "./projectStat";
import ConsultantStats from "./consultants";
import ClientStats from "./clients";
import { ClientProfile } from "@/types/client";

export default function OverviewPage({ client }: { client?: ClientProfile }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Admin Overview</h2>

      {/* Horizontal scroll container */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        <div className="min-w-[300px]">
          <EscrowStats transactions={client?.escrowTransactions} />
        </div>
        <div className="min-w-[300px]">
          <ProjectStats projects={client?.projects} />
        </div>
        <div className="min-w-[300px]">
          <ConsultantStats consultants={client?.consultants} />
        </div>
        <div className="min-w-[300px]">
          <ClientStats client={client} />
        </div>
        <div className="min-w-[300px]">
          <NotificationsPanel notifications={client?.notifications} />
        </div>
        <div className="min-w-[300px]">
          <AlertsPanel alerts={client?.alerts} />
        </div>
      </div>
    </div>
  );
}
