"use client";
import React, { useState } from "react";

interface Step {
  id: number;
  title: string;
  description: string;
  content: React.ReactNode;
}

interface ConversationFlowProps {
  steps: Step[];
}

export default function ConversationFlow({ steps }: ConversationFlowProps) {
  const [openStep, setOpenStep] = useState<number | null>(null);

  const toggleStep = (id: number) => {
    setOpenStep(openStep === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div
          key={step.id}
          className="bg-[#010101]/80 border border-[#1f1f1f] rounded-lg shadow-md backdrop-blur-md transition-colors hover:border-[#c21229]"
        >
          <button
            onClick={() => toggleStep(step.id)}
            className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
          >
            <div>
              <h4 className="text-white font-semibold">{step.title}</h4>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
            <span className="text-[#c21229] font-bold">
              {openStep === step.id ? "−" : "+"}
            </span>
          </button>

          {openStep === step.id && (
            <div className="p-4 border-t border-[#1f1f1f] text-gray-300">
              {step.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
