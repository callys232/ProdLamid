"use client";

import { useState } from "react";

const steps = [
  "Company Details",
  "Project Goals",
  "AI Preference Setup",
  "Invite Team Members",
];

export default function OnboardingAssistant() {
  const [step, setStep] = useState(0);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));

  return (
    <div className="p-8 bg-gray-950 rounded-lg w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-2">Welcome to Lamid 🎉</h2>
      <p className="text-gray-400 mb-6">
        Let’s set up your account to get the best consulting experience.
      </p>

      <div className="mb-6">
        <p className="text-sm mb-2 font-medium">
          Step {step + 1} of {steps.length}
        </p>
        <div className="flex gap-2 mb-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded ${
                i <= step ? "bg-red-600" : "bg-gray-700"
              }`}
            ></div>
          ))}
        </div>
        <p className="text-lg font-semibold">{steps[step]}</p>
      </div>

      <div className="bg-gray-900 rounded p-5 border border-gray-800">
        {/* You can replace these with step components later */}
        <p className="text-gray-300">Configuration coming soon...</p>
      </div>

      <button
        onClick={next}
        className="mt-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
      >
        {step === steps.length - 1 ? "Finish" : "Continue"}
      </button>
    </div>
  );
}
