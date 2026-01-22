"use client";

import TierCard from "./tierList";

const tiers = [
  {
    title: "Premium",
    services: [
      { name: "Analytics" },
      { name: "AI Preferences" },
      { name: "Priority Support" },
      { name: "AI‑Powered Reliability Insights" },
      { name: "Customer Success Concierge " },
    ],
    highlight: true,
    tierHref: "/premium",
  },
  {
    title: "Current Plan",
    services: [
      { name: "Basic Dashboard" },
      { name: "Email Support" },
      { name: "Community Forum" },
      { name: "Getting Started Docs" },
      { name: "Sample Data Access" },
    ],
    highlight: false,
    tierHref: "/premium",
  },
];

export default function HomePage() {
  return (
    <section className="min-h-screen bg-black py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-white text-center">
          Tiers - How we serve you.
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
