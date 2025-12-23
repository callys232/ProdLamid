"use client";
import React, { useState } from "react";

interface CampaignBuilderProps {
  subject: string;
  setSubject: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  recipients: string[];
  setRecipients: (val: string[]) => void;
}

export default function CampaignBuilder({
  subject,
  setSubject,
  content,
  setContent,
  recipients,
  setRecipients,
}: CampaignBuilderProps) {
  const [newRecipient, setNewRecipient] = useState("");

  const handleAddRecipient = () => {
    if (newRecipient.trim()) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient("");
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-white font-semibold">Campaign Builder</h4>

      {/* Subject input */}
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-2 rounded bg-[#0f0f0f] text-white focus:outline-none focus:border-[#c21229] border border-[#1f1f1f]"
      />

      {/* Content input */}
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 rounded bg-[#0f0f0f] text-white h-32 focus:outline-none focus:border-[#c21229] border border-[#1f1f1f]"
      />

      {/* Recipient input */}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="Add recipient"
          value={newRecipient}
          onChange={(e) => setNewRecipient(e.target.value)}
          className="p-2 rounded bg-[#0f0f0f] text-white flex-1 focus:outline-none focus:border-[#c21229] border border-[#1f1f1f]"
        />
        <button
          onClick={handleAddRecipient}
          className="px-3 py-1 bg-[#c21229] text-white rounded transition-transform transform hover:scale-105 hover:bg-red-700"
        >
          Add
        </button>
      </div>

      {/* Recipient list */}
      <ul className="text-gray-300 text-sm mt-2">
        {recipients.map((r, i) => (
          <li key={i}>📧 {r}</li>
        ))}
      </ul>
    </div>
  );
}
