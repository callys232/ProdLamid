"use client";

import { useState } from "react";
import { FaCheckCircle, FaUpload } from "react-icons/fa";
import KycModal from "./KycModal";
import AvailabilityCalendar from "./calenderAvai";
import Tooltip from "./toolTip";

interface Profile {
  tier?: "Freemium" | "Premium";
  accountType?: "Freelancer" | "Client" | "Enterprise";
  premium?: boolean;
  verified?: boolean;
  availability?: { day: string; slots: number[] }[];
}

interface StepStatusProps {
  profile?: Profile;
  onUpdateAvailability: (availability: Profile["availability"]) => void;
}

export default function StepStatus({ profile, onUpdateAvailability }: StepStatusProps) {
  const [kycOpen, setKycOpen] = useState(false);

  const safeProfile: Profile = {
    tier: profile?.tier ?? "Freemium",
    accountType: profile?.accountType ?? "Freelancer",
    premium: profile?.premium ?? false,
    verified: profile?.verified ?? false,
    availability: profile?.availability ?? [],
  };

  return (
    <div className="space-y-6">
      {/* STATUS */}
      <div className="bg-black/60 p-4 rounded-xl border border-gray-800">
        <h3 className="text-white font-semibold mb-4">Account Status</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* TIER */}
          <div className="bg-black/40 p-3 rounded-lg border border-gray-800 hover:border-brand transition">
            <p className="text-gray-400 text-xs flex items-center gap-1">
              Tier <Tooltip text="Your subscription level" />
            </p>
            <p className="text-white font-semibold">
              {safeProfile.premium ? "Premium" : "Freemium"}
            </p>
            <p className="text-gray-400 text-xs">Type: {safeProfile.accountType}</p>

            {!safeProfile.premium && (
              <a
                href="/premium"
                className="mt-2 inline-block text-xs bg-brand hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
              >
                Upgrade
              </a>
            )}
          </div>

          {/* VERIFIED */}
          <div
            onClick={!safeProfile.verified ? () => setKycOpen(true) : undefined}
            className={`bg-black/40 p-3 rounded-lg border border-gray-800 transition ${!safeProfile.verified && "cursor-pointer hover:border-brand"
              }`}
          >
            <p className="text-gray-400 text-xs flex items-center gap-1">
              Verification <Tooltip text="Upload ID documents to verify" />
            </p>
            {safeProfile.verified ? (
              <p className="text-brand flex items-center gap-1 font-medium">
                <FaCheckCircle /> Verified
              </p>
            ) : (
              <p className="text-brand flex items-center gap-1">
                <FaUpload /> Verify Now
              </p>
            )}
          </div>

          {/* STATUS */}
          <div className="bg-black/40 p-3 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-xs">Status</p>
            <p className="text-white">
              {safeProfile.premium ? "Active" : "Free Plan"}
            </p>
          </div>
        </div>
      </div>

      {/* AVAILABILITY */}
      <div className="bg-black/60 p-4 rounded-xl border border-gray-800">
        <h3 className="text-white font-semibold mb-3">Availability Schedule</h3>
        <AvailabilityCalendar
          availability={safeProfile.availability}
          onChange={onUpdateAvailability}
        />
      </div>

      <KycModal open={kycOpen} onClose={() => setKycOpen(false)} />
    </div>
  );
}
