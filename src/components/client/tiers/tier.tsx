"use client";

import TierCard from "./tierList";

const tiers = [
  {
    title: "Freemium",
    services: [
      { name: "Post up to 10 Projects / Month" },
      { name: "Browse Consultant Profiles" },
      { name: "Basic Messaging with Applicants" },
      { name: "Community Forum Access" },
      { name: "Getting Started Docs" },
    ],
    highlight: false,
    tierHref: "/tiers/freemium",
  },
  {
    title: "Premium",
    services: [
      { name: "Unlimited Project Postings" },
      { name: "AI Consultant Matching" },
      { name: "Enhanced Project Visibility" },
      { name: "Proposal Review Tools" },
      { name: "CRM Lite for Client Projects" },
      { name: "Priority Support" },
      { name: "Analytics Dashboard for Projects" },
    ],
    highlight: true,
    tierHref: "/tiers/premium",
  },
  {
    title: "Enterprise",
    services: [
      { name: "Dedicated Account Manager" },
      { name: "Priority AI Matching for Projects" },
      { name: "Featured Project Placement" },
      { name: "Advanced CRM & Workflow Tools" },
      { name: "Team Collaboration Features" },
      { name: "Customer Success Concierge" },
      { name: "Lowest Platform Commission Rates" },
    ],
    highlight: true,
    tierHref: "/tiers/enterprise",
  },
];

export default function HomePage() {
  return (
    <section className="min-h-screen bg-black py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-white text-center">
          Tiers – How we serve clients
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiers.map((tier, idx) => (
            <TierCard
              key={idx}
              title={tier.title}
              services={tier.services}
              highlight={tier.highlight}
              tierHref={tier.tierHref}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
