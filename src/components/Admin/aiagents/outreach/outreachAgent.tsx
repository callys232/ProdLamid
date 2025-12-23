"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// ✅ Import child components
import CampaignBuilder from "./campaignBuilder";
import KeywordTracker from "./keywordtracker";
import PreviewCard from "./previewCard";
import AdminControls from "./admincontrol";

interface Campaign {
  subject: string;
  content: string;
  recipients: string[];
}

interface OutreachData {
  campaigns: Campaign[];
  keywords: string[];
}

// ✅ Section snippet included inside the container
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[#010101]/80 border border-[#1f1f1f] rounded-lg p-5 shadow-md backdrop-blur-md">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      {children}
    </section>
  );
}

export default function OutreachAdminPanel({
  projectId,
}: {
  projectId: string;
}) {
  const { data, error, isLoading } = useQuery<OutreachData>({
    queryKey: ["outreach", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/outreach`);
      if (!res.ok) throw new Error("Failed to fetch outreach data");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const outreach = data ?? { campaigns: [], keywords: [] };

  // Local draft state for campaign builder
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <Section title="Campaign Builder">
        <CampaignBuilder
          subject={subject}
          setSubject={setSubject}
          content={content}
          setContent={setContent}
          recipients={recipients}
          setRecipients={setRecipients}
        />
      </Section>

      <Section title="Keyword Tracking">
        <KeywordTracker keywords={outreach.keywords} />
      </Section>

      <Section title="Preview">
        <PreviewCard
          subject={subject}
          content={content}
          recipients={recipients}
        />
      </Section>

      <Section title="Admin Controls">
        <AdminControls />
      </Section>

      {isLoading && <p className="text-gray-400">Loading outreach data...</p>}
      {error && <p className="text-red-400">Failed to load outreach data.</p>}
    </div>
  );
}
