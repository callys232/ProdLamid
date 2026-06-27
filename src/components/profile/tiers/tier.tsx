"use client";

import TierCard from "./tierList";

const tiers = [
  {
    title: "Freemium",
    services: [
      { name: "Basic Consultant Profile" },
      { name: "Apply to 5 Projects / Month" },
      { name: "Standard Marketplace Visibility" },
      { name: "Community Forum Access" },
      { name: "Getting Started Docs" },
    ],
    highlight: false,
    tierHref: "/tiers/freemium",
  },
  {
    title: "Premium",
    services: [
      { name: "Unlimited Project Applications" },
      { name: "AI Project Matching" },
      { name: "Enhanced Search Visibility" },
      { name: "Proposal Templates" },
      { name: "CRM Lite Tools" },
      { name: "Priority Support" },
      { name: "Analytics Dashboard" },
    ],
    highlight: true,
    tierHref: "/tiers/premium",
  },
  {
    title: "Enterprise",
    services: [
      { name: "Dedicated Account Manager" },
      { name: "Priority AI Matching" },
      { name: "Featured Profile Placement" },
      { name: "Advanced CRM Tools" },
      { name: "Team Collaboration Tools" },
      { name: "Customer Success Concierge" },
      { name: "Lowest Platform Commission" },
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
          Tiers – How we serve consultants
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
