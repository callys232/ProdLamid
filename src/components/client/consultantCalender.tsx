"use client";

import { motion } from "framer-motion";
import { ProjectConsultant } from "@/types/project";

const statusColors: Record<string, string> = {
  active: "bg-[#2563EB]",       // red accent for active
  paused: "bg-yellow-600",
  completed: "bg-green-600",
};

export default function ConsultantCalendar({
  consultant,
  premiumUser = false, // flag to enable reminders/alerts
}: {
  consultant: ProjectConsultant;
  premiumUser?: boolean;
}) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-[#2563EB] text-white mb-4 shadow-md transition-colors hover:bg-gray-800">
      {/* Consultant Info */}
      <div className="flex justify-between items-center">
        <p className="font-semibold">
          {consultant.name} <span className="text-gray-400">({consultant.role})</span>
        </p>
        {consultant.status === "active" && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-[#2563EB] text-white">
            Active
          </span>
        )}
      </div>
      <p className="text-xs text-gray-300 mt-1">Schedule: {consultant.schedule}</p>
      <p className="text-xs text-gray-300">Progress: {consultant.progress}% | Status: {consultant.status}</p>

      {/* Weekly Availability */}
      <div className="grid grid-cols-7 gap-1 mt-3 text-xs">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => (
          <div
            key={day}
            className={`p-2 rounded text-center font-semibold transition-colors hover:bg-[#2563EB]/70 ${
              statusColors[consultant.status || "active"]
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Hours Logged */}
      <div className="mt-3">
        <p className="text-xs text-gray-400">Hours Logged</p>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="bg-[#2563EB] h-full"
            style={{ width: `${consultant.progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${consultant.progress}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* Premium Reminders/Alerts */}
      {premiumUser && (
        <div className="mt-3 bg-gray-800 p-2 rounded border border-[#2563EB]">
          <p className="text-xs text-[#2563EB] font-semibold">Premium Alerts</p>
          <ul className="text-xs text-gray-300 list-disc list-inside">
            <li>Upcoming milestone review: {consultant.assignedAt || "N/A"}</li>
            <li>Next availability check: {consultant.schedule}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
