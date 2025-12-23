// AdminActivityLog.tsx
"use client";
import React, { useState, useEffect } from "react";
import Section from "../finance/section";

type LogEntry = {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  resource: string;
  status: "Success" | "Failed" | "Pending";
};

export default function AdminActivityLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/activity-log", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch activity log");
        const json = await res.json();
        setLogs(json);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setLogs([]); // fallback: empty list
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <Section title="Admin Activity Log">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-300">
          <thead>
            <tr className="text-gray-400 border-b border-[#1f1f1f]">
              <th>Timestamp</th>
              <th>Admin</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-[#1f1f1f] hover:bg-[#c21229]/20 transition-colors"
              >
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.admin}</td>
                <td>{log.action}</td>
                <td>{log.resource}</td>
                <td
                  className={
                    log.status === "Success"
                      ? "text-green-400"
                      : log.status === "Failed"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }
                >
                  {log.status}
                </td>
              </tr>
            ))}
            {logs.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="py-3 text-gray-400">
                  No activity recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {loading && (
        <p className="text-gray-400 text-sm">Loading activity log...</p>
      )}
      {error && (
        <p className="text-red-400 text-sm">Failed to load activity log.</p>
      )}
    </Section>
  );
}
