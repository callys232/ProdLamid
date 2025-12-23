"use client";

import React, { useEffect, useState } from "react";

interface Campaign {
  subject: string;
  content: string;
  recipients: string[];
}

interface OutreachData {
  campaigns: Campaign[];
  keywords: string[];
}

export default function OutreachSEOAgent({ projectId }: { projectId: string }) {
  const [data, setData] = useState<OutreachData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local draft state
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    async function fetchOutreach() {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${projectId}/outreach`);
        if (!res.ok) throw new Error("Failed to fetch outreach data");
        const backendData: OutreachData = await res.json();
        setData(backendData);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Error fetching outreach, using mock data", message);
        setError(message);
        // Fallback mock
        setData({
          campaigns: [
            {
              subject: "November Promo",
              content: "Save 20% on premium plans this month!",
              recipients: ["marketing@company.com", "sales@company.com"],
            },
          ],
          keywords: ["AI Copilot", "Project Analytics", "Lamid Premium"],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchOutreach();
  }, [projectId]);

  const handleAddRecipient = () => {
    if (newRecipient.trim()) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient("");
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && data) {
      setData({ ...data, keywords: [...data.keywords, newKeyword] });
      setNewKeyword("");
    }
  };

  return (
    <div className="bg-[#010101] p-6 rounded-lg border border-[#1f1f1f] space-y-6">
      <h3 className="text-lg font-semibold text-white">
        📢 Outreach & SEO Agent
      </h3>

      {loading ? (
        <p className="text-gray-400">Loading outreach data...</p>
      ) : error ? (
        <p className="text-red-400">Error: {error}</p>
      ) : data ? (
        <>
          {/* Campaign Builder */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold">Campaign Builder</h4>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 rounded bg-[#0f0f0f] text-white focus:outline-none focus:border-[#c21229] border border-[#1f1f1f]"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 rounded bg-[#0f0f0f] text-white h-32 focus:outline-none focus:border-[#c21229] border border-[#1f1f1f]"
            />
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
            <ul className="text-gray-300 text-sm mt-2">
              {recipients.map((r, i) => (
                <li key={i}>📧 {r}</li>
              ))}
            </ul>
          </div>

          {/* Keyword Tracking */}
          <div>
            <h4 className="text-white font-semibold mb-2">Keyword Tracking</h4>
            <ul className="text-gray-300 space-y-1">
              {data.keywords.map((k, i) => (
                <li key={i}>🔍 {k}</li>
              ))}
            </ul>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Add keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="p-2 rounded bg-[#0f0f0f] text-white flex-1 focus:outline-none focus:border-[#c21229] border border-[#1f1f1f]"
              />
              <button
                onClick={handleAddKeyword}
                className="px-3 py-1 bg-[#c21229] text-white rounded transition-transform transform hover:scale-105 hover:bg-red-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Flyer/Email Preview */}
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

          {/* Admin Controls */}
          <div>
            <h4 className="text-white font-semibold mb-2">Admin Controls</h4>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-[#c21229] text-white rounded transition-transform transform hover:scale-105 hover:bg-red-700">
                Approve Draft
              </button>
              <button className="px-3 py-1 bg-[#c21229] text-white rounded transition-transform transform hover:scale-105 hover:bg-red-700">
                Manage Mailing Lists
              </button>
              <button className="px-3 py-1 bg-[#c21229] text-white rounded transition-transform transform hover:scale-105 hover:bg-red-700">
                Adjust Keywords
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
