"use client";

import React, { useState } from "react";

interface Consultant {
  name: string;
  rating: number;
  availability: "Available" | "Limited" | "Unavailable";
}

interface Milestone {
  title: string;
  deadline: string;
  progress: number; // percentage
}

export default function ProjectAgent() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [newMilestone, setNewMilestone] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newConsultant, setNewConsultant] = useState("");

  const handleAddMilestone = () => {
    if (!newMilestone.trim()) return;
    setMilestones([
      ...milestones,
      { title: newMilestone, deadline: newDeadline || "TBD", progress: 0 },
    ]);
    setNewMilestone("");
    setNewDeadline("");
  };

  const handleAddConsultant = () => {
    if (!newConsultant.trim()) return;
    setConsultants([
      ...consultants,
      { name: newConsultant, rating: 0, availability: "Available" },
    ]);
    setNewConsultant("");
  };

  return (
    <div className="bg-[#010101] p-6 rounded-lg border border-[#1f1f1f]">
      <h3 className="text-lg font-semibold mb-3">
        🚀 Project Onboarding Assistant
      </h3>

      {/* Step 1: Milestone Onboarding */}
      {milestones.length === 0 ? (
        <div className="bg-[#1a1a1a] p-4 rounded border border-[#374151] mb-4">
          <h4 className="text-white font-semibold mb-2">
            🎯 Let’s start with your first milestone
          </h4>
          <p className="text-gray-400 text-sm mb-3">
            What’s the first big goal for your project?
          </p>
          <input
            type="text"
            placeholder="Milestone title"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            className="w-full mb-2 p-2 rounded bg-[#0f0f0f] text-white text-sm"
          />
          <input
            type="text"
            placeholder="Deadline (e.g. 2 weeks)"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            className="w-full mb-2 p-2 rounded bg-[#0f0f0f] text-white text-sm"
          />
          <button
            type="button"
            onClick={handleAddMilestone}
            className="px-3 py-1 bg-[#3b82f6] text-white rounded"
          >
            Add Milestone
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-2">📂 Your Milestones</h4>
          {milestones.map((m, i) => (
            <div
              key={i}
              className="bg-[#1a1a1a] p-4 rounded border border-[#374151] mb-3"
            >
              <h4 className="font-semibold text-white">{m.title}</h4>
              <p className="text-sm text-gray-400">Deadline: {m.deadline}</p>
              <div className="bg-[#333] h-2 rounded mt-3">
                <div
                  className="bg-[#3b82f6] h-2 rounded"
                  style={{ width: `${m.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Consultant Onboarding */}
      {milestones.length > 0 && consultants.length === 0 && (
        <div className="bg-[#1a1a1a] p-4 rounded border border-[#374151] mb-4">
          <h4 className="text-white font-semibold mb-2">
            👥 Add a consultant to your project
          </h4>
          <p className="text-gray-400 text-sm mb-3">
            Who’s helping you with this milestone?
          </p>
          <input
            type="text"
            placeholder="Consultant name"
            value={newConsultant}
            onChange={(e) => setNewConsultant(e.target.value)}
            className="w-full mb-2 p-2 rounded bg-[#0f0f0f] text-white text-sm"
          />
          <button
            type="button"
            onClick={handleAddConsultant}
            className="px-3 py-1 bg-[#3b82f6] text-white rounded"
          >
            Add Consultant
          </button>
        </div>
      )}

      {/* Step 3: Suggestions */}
      {consultants.length > 0 && (
        <div className="mt-6 bg-[#1a1a1a] p-4 rounded border border-[#374151]">
          <h4 className="text-white font-semibold mb-2">💡 Suggestions</h4>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>⚡ Assign Aisha N. to Website Redesign for faster progress.</li>
            <li>⏳ Content Migration deadline is approaching, add support.</li>
            <li>📘 Connect to Learning Agent for training resources.</li>
          </ul>
        </div>
      )}

      {/* Step 4: Transition */}
      {consultants.length > 0 && (
        <div className="mt-6 text-sm text-gray-400">
          <p>Would you like to:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Continue managing projects here</li>
            <li>Switch to the Support Agent for troubleshooting</li>
            <li>Explore the Creative Agent for design ideas</li>
          </ul>
        </div>
      )}
    </div>
  );
}
