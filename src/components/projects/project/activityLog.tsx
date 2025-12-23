"use client";

import { formatDistanceToNow } from "date-fns";

export interface ActivityItem {
  id: string;
  action: string; // e.g. "Bid Placed", "Milestone Updated"
  user?: string; // optional actor
  timestamp: string; // ISO date string
  details?: string; // optional extra info
}

interface ActivityLogProps {
  items: ActivityItem[];
}

const cardClass =
  "bg-[#1a0d0d] border border-red-600 rounded-lg p-6 shadow-md transition transform hover:-translate-y-1 hover:shadow-red-700/40 hover:border-red-500 hover:bg-[#2a0d0d]";

export default function ActivityLog({ items }: ActivityLogProps) {
  return (
    <div className={cardClass}>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        📜 Activity Log
      </h2>
      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="bg-[#0c0000] p-4 rounded-md border border-[#3a1919]"
            >
              <p className="font-semibold text-red-400">{item.action}</p>
              {item.user && (
                <p className="text-sm text-gray-300">By: {item.user}</p>
              )}
              {item.details && (
                <p className="text-sm text-gray-400">{item.details}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(item.timestamp), {
                  addSuffix: true,
                })}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No recent activity.</p>
      )}
    </div>
  );
}
