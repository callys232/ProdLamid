"use client";

import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import JobCard, { type JobOpeningData } from "./JobCard";
import ApplyModal   from "./ApplyModal";
import PostJobModal from "./PostJobModal";

const ENTERPRISE_TYPES = ["Enterprise", "Concierge", "Admin"];

const MOCK_JOBS: JobOpeningData[] = [
  {
    _id:         "mock-1",
    title:       "Head of Sales Enablement",
    department:  "Sales & Business Development",
    track:       "Sales Enablement",
    type:        "full-time",
    delivery:    "Hybrid",
    location:    "Lagos, Nigeria",
    skills:      ["Sales Strategy", "CRM", "Team Leadership", "Negotiation"],
    applicantCount: 12,
    deadline:    new Date(Date.now() + 14 * 86_400_000).toISOString(),
    description: "Lead our sales enablement function to accelerate revenue growth.",
  },
  {
    _id:         "mock-2",
    title:       "Leadership Development Specialist",
    department:  "Human Capital",
    track:       "Leadership Development",
    type:        "contract",
    delivery:    "Remote",
    location:    "Pan-Africa",
    skills:      ["Facilitation", "Executive Coaching", "OD", "L&D"],
    applicantCount: 8,
    deadline:    new Date(Date.now() + 21 * 86_400_000).toISOString(),
    description: "Design and deliver bespoke leadership programs.",
  },
  {
    _id:         "mock-3",
    title:       "Digital Transformation Consultant",
    department:  "Strategy & Operations",
    track:       "Digital Transformation",
    type:        "full-time",
    delivery:    "Remote",
    location:    "Abuja or Remote",
    skills:      ["Change Management", "Agile", "Process Design", "Stakeholder Mgmt"],
    applicantCount: 5,
    deadline:    new Date(Date.now() + 30 * 86_400_000).toISOString(),
    salaryRange: { min: 3_500_000, max: 6_000_000, currency: "NGN" },
    description: "Guide enterprise clients through digital and organizational transformation.",
  },
  {
    _id:         "mock-4",
    title:       "Project Management Trainer",
    department:  "Training & Capacity Building",
    track:       "Project Management",
    type:        "part-time",
    delivery:    "Onsite",
    location:    "Port Harcourt, Nigeria",
    skills:      ["PMP", "Agile/Scrum", "Training Delivery", "MS Project"],
    applicantCount: 3,
    deadline:    new Date(Date.now() + 10 * 86_400_000).toISOString(),
    description: "Facilitate project management certification programs for corporate cohorts.",
  },
];

const TRACKS    = ["All Tracks", "Leadership Development", "Project Management", "Sales Enablement", "Digital Transformation", "General"];
const TYPES     = ["All Types", "full-time", "part-time", "contract", "freelance", "internship"];
const DELIVERIES = ["All Modes", "Remote", "Onsite", "Hybrid"];

export default function JobsTab() {
  const { user }  = useAuth();
  const isEnterprise = ENTERPRISE_TYPES.includes(user?.accountType ?? "");

  const [jobs,      setJobs]      = useState<JobOpeningData[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [trackFilt, setTrackFilt] = useState("All Tracks");
  const [typeFilt,  setTypeFilt]  = useState("All Types");
  const [delFilt,   setDelFilt]   = useState("All Modes");
  const [applyJob,  setApplyJob]  = useState<JobOpeningData | null>(null);
  const [postOpen,  setPostOpen]  = useState(false);

  const fetchJobs = async () => {
    try {
      const res  = await fetch("/api/recruitment/jobs");
      const data = await res.json();
      setJobs(data.success && data.data.length > 0 ? data.data : MOCK_JOBS);
    } catch {
      setJobs(MOCK_JOBS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const filtered = jobs.filter((j) => {
    if (search && !`${j.title} ${j.department} ${j.skills.join(" ")}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (trackFilt !== "All Tracks" && j.track    !== trackFilt) return false;
    if (typeFilt  !== "All Types"  && j.type     !== typeFilt)  return false;
    if (delFilt   !== "All Modes"  && j.delivery !== delFilt)   return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles, skills…"
            className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm
                       text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition"
          />
        </div>

        {[
          [trackFilt, setTrackFilt, TRACKS],
          [typeFilt,  setTypeFilt,  TYPES],
          [delFilt,   setDelFilt,   DELIVERIES],
        ].map(([val, setter, opts], i) => (
          <select
            key={i}
            value={val as string}
            onChange={(e) => (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)}
            className="bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200
                       focus:outline-none focus:border-orange-500/50 transition"
          >
            {(opts as string[]).map((o) => <option key={o} value={o} className="bg-[#111111] text-gray-200">{o}</option>)}
          </select>
        ))}

        {isEnterprise && (
          <button
            onClick={() => setPostOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold
                       bg-orange-500 hover:bg-orange-600 text-white transition ml-auto"
          >
            <Plus className="w-3.5 h-3.5" />Post New Role
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
          <Search className="w-8 h-8 opacity-30" />
          <p className="text-sm">No open roles match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <JobCard key={job._id} job={job} onApply={setApplyJob} />
          ))}
        </div>
      )}

      <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} onSuccess={fetchJobs} />
      <PostJobModal open={postOpen} onClose={() => setPostOpen(false)} onSuccess={fetchJobs} />
    </div>
  );
}
