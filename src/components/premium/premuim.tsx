// app/premium/page.tsx
"use client";
import Link from "next/link";

import { useState } from "react";
import TickingBullet from "@/components/profile/tiers/tickBullet";
import ServicePopup from "./servicePopup";

const premiumServices = [
  {
    name: "Analytics",
    description: "Advanced dashboards and insights.",
    href: "/services/analytics",
  },
  {
    name: "AI Preferences",
    description: "Customize AI behavior to your needs.",
    href: "/profile/settings/premium/AIPreferences",
  },
  {
    name: "Priority Support",
    description: "24/7 dedicated support team.",
    href: "/services/integrations",
  },
  {
    name: "AI‑Powered Reliability Insights",
    description:
      "Predictive analytics, writing enhancement and expert suggestions.",
    href: "/services/sla",
  },
  {
    name: "Customer Success Concierge",
    description: "Personalized guidance to achieve your goals.",
    href: "/services/success",
  },
];

export default function PremiumPage() {
  const [selectedService, setSelectedService] = useState<
    null | (typeof premiumServices)[0]
  >(null);

  return (
    <section className="min-h-screen bg-black py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-10">
        <h1 className="text-4xl font-bold text-[#2563EB] mb-6">Premium Plan</h1>
        <p className="text-gray-700 mb-8">
          Unlock advanced features, personalized support, and exclusive benefits
          with the Premium plan.
        </p>

        <h2 className="text-2xl font-semibold text-black mb-4">
          Included Services
        </h2>
        <ul className="space-y-4">
          {premiumServices.map((svc, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 border-b border-gray-200 pb-2 cursor-pointer hover:text-[#2563EB]"
              onClick={() => setSelectedService(svc)}
            >
              <TickingBullet />
              <span className="text-black">{svc.name}</span>
            </li>
          ))}
        </ul>

        {/* Popup */}
        {selectedService && (
          <ServicePopup
            open={!!selectedService}
            onClose={() => setSelectedService(null)}
            title={selectedService.name}
            description={selectedService.description}
          />
        )}

        {/* Cost & Upgrade */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-black mb-4">Cost</h2>
          <p className="text-gray-800">
            <span className="font-bold text-[#2563EB]">quaterly:</span> $49
          </p>
          <p className="text-gray-800">
            <span className="font-bold text-[#2563EB]">Annual:</span> $499 /
            year (save 8%)
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link
            href="#"
            className="flex-1 text-center bg-[#2563EB] text-white py-3 rounded hover:bg-black transition"
          >
            Upgrade Monthly
          </Link>
          <Link
            href="#"
            className="flex-1 text-center bg-[#2563EB] text-white py-3 rounded hover:bg-black transition"
          >
            Upgrade Annually
          </Link>
        </div>
      </div>
    </section>
  );
}
