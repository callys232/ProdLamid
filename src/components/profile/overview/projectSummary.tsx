"use client";
import { useEffect, useState } from "react";
import { Project, ProjectConsultant } from "@/types/project";
import { mockClients } from "@/mocks/mockClient";

export default function ProjectSummary({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<"available" | "allocated">("available");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error("Backend not ok");

        const { data } = await res.json();
        setProject({ ...data, id: data._id || data.id });
      } catch {
        const fallbackProject = mockClients[0].projects.find(
          (p) => p.id === projectId || p._id === projectId
        );
        if (fallbackProject) {
          setProject({
            ...fallbackProject,
            id: fallbackProject._id || fallbackProject.id,
          });
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [projectId]);

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-900 rounded-xl" />;
  }

  if (!project) {
    return (
      <div className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg">
        <p className="text-gray-400 text-sm">No project summary available.</p>
      </div>
    );
  }

  const consultants = project.assignedConsultants || [];

  return (
    <div
      className="bg-black border border-gray-700 rounded-xl p-6 grid grid-cols-2 gap-4 shadow-lg 
                 transition transform hover:scale-[1.02] hover:bg-gray-900 
                 hover:border-[#2563EB] relative group"
    >
      {/* Basic project info */}
      <div>
        <p className="text-sm text-gray-400">Budget</p>
        <p className="text-white">
          {project.currency ? `${project.currency} ` : ""}{project.budget ?? "N/A"}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Hourly Rate</p>
        <p className="text-white">
          {project.currency ? `${project.currency} ` : ""}{project.hourlyRate ?? "N/A"}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Portfolio/Tech Stack</p>
        <p className="text-white">{project.tech ?? "N/A"}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Deadline</p>
        <p className="text-white">{project.deadline ?? "N/A"}</p>
      </div>

      {/* Tabs for freelancer time slots */}
      <div className="col-span-2 mt-4">
        <div className="flex gap-4 mb-2">
          <button
            onClick={() => setActiveTab("available")}
            className={`px-3 py-1 rounded text-sm ${activeTab === "available"
              ? "bg-[#2563EB] text-white"
              : "bg-gray-800 text-gray-300"
              }`}
          >
            Available Time
          </button>
          <button
            onClick={() => setActiveTab("allocated")}
            className={`px-3 py-1 rounded text-sm ${activeTab === "allocated"
              ? "bg-[#2563EB] text-white"
              : "bg-gray-800 text-gray-300"
              }`}
          >
            Allocated Time
          </button>
        </div>

        {/* Dropdown */}
        <select
          className="w-full bg-gray-900 text-white text-sm rounded px-3 py-2 border border-gray-700 focus:outline-none focus:border-[#2563EB] mb-4"
        >
          {consultants.length ? (
            consultants.map((c: ProjectConsultant) =>
              activeTab === "available"
                ? c.availability.map((slot, idx) => (
                  <option key={`${c.id}-avail-${idx}`} value={slot}>
                    {c.name} — {slot}
                  </option>
                ))
                : c.calendarEvents?.map((ev, idx) => (
                  <option key={`${c.id}-alloc-${idx}`} value={ev.start_at}>
                    {c.name} — {new Date(ev.start_at).toLocaleString()} → {new Date(ev.end_at).toLocaleString()}
                  </option>
                ))
            )
          ) : (
            <option>No time slots listed</option>
          )}
        </select>

        {/* Calendar grid view */}
        <div className="grid grid-cols-7 gap-2 text-xs text-gray-400">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="bg-gray-900 rounded p-2 min-h-[60px]">
              <p className="text-center text-white font-semibold mb-1">{day}</p>
              {consultants.map((c) =>
                activeTab === "available"
                  ? c.availability
                    .filter((slot) => slot.includes(day))
                    .map((slot, idx) => (
                      <p key={`${c.id}-avail-${day}-${idx}`} className="text-green-400">
                        {c.name}: {slot}
                      </p>
                    ))
                  : c.calendarEvents
                    ?.filter((ev) =>
                      new Date(ev.start_at).toLocaleDateString("en-US", { weekday: "short" }) === day
                    )
                    .map((ev, idx) => (
                      <p key={`${c.id}-alloc-${day}-${idx}`} className="text-blue-400">
                        {c.name}: {new Date(ev.start_at).toLocaleTimeString()} → {new Date(ev.end_at).toLocaleTimeString()}
                      </p>
                    ))
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <span className="bg-[#2563EB] text-white text-xs px-2 py-1 rounded shadow-md">
          Project Summary
        </span>
      </div>

      {/* Error badge */}
      {error && (
        <div className="col-span-2 text-xs text-blue-500 mt-2">
          Showing fallback data
        </div>
      )}
    </div>
  );
}
