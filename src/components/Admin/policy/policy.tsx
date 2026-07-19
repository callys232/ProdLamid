// PolicyCompliance.tsx
"use client";
import React, { useState, useEffect } from "react";
import Section from "../finance/section";

type Policy = {
  id: string;
  name: string;
  team: string;
  lastAudit: string;
  status: "Compliant" | "Non-Compliant" | "Pending Review";
};

export default function PolicyCompliance() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/policies", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch policies");
        const json = await res.json();
        setPolicies(json);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setPolicies([]); // fallback: empty list
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
    const interval = setInterval(fetchPolicies, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <Section title="Policy Compliance">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-300">
          <thead>
            <tr className="text-gray-400 border-b border-[#1f1f1f]">
              <th>Policy</th>
              <th>Responsible Team</th>
              <th>Last Audit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => (
              <tr
                key={p.id}
                className="border-b border-[#1f1f1f] hover:bg-[#c21229]/20 transition-colors"
              >
                <td>{p.name}</td>
                <td>{p.team}</td>
                <td>{new Date(p.lastAudit).toLocaleDateString()}</td>
                <td
                  className={
                    p.status === "Compliant"
                      ? "text-green-400"
                      : p.status === "Non-Compliant"
                      ? "text-blue-400"
                      : "text-yellow-400"
                  }
                >
                  {p.status}
                </td>
              </tr>
            ))}
            {policies.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="py-3 text-gray-400">
                  No policies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {loading && <p className="text-gray-400 text-sm">Loading policies...</p>}
      {error && (
        <p className="text-blue-400 text-sm">Failed to load policies.</p>
      )}
    </Section>
  );
}
