"use client";
import React from "react";

export default function PreviewCard({
  subject,
  content,
  recipients,
}: {
  subject: string;
  content: string;
  recipients: string[];
}) {
  return (
    <div>
      <h4 className="text-white font-semibold mb-2">Preview</h4>
      <div className="bg-[#0f0f0f] p-4 rounded border border-[#1f1f1f] hover:border-[#c21229] transition-colors">
        <h5 className="text-[#c21229]">{subject || "Draft Subject"}</h5>
        <p className="text-gray-300">
          {content || "Draft content goes here..."}
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Recipients: {recipients.length || 0}
        </p>
      </div>
    </div>
  );
}
