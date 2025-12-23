"use client";

import Image from "next/image";
import { Project } from "@/types/project";

interface JobCardProps {
  job: Project;
  onClick: (job: Project) => void;
  isActive?: boolean; // highlight active card
}

export default function JobCard({ job, onClick, isActive }: JobCardProps) {
  return (
    <div
      className={`bg-black/10 backdrop-blur-sm border rounded-xl p-4 text-gray-100 shadow-md transition-all duration-200 cursor-pointer
        ${
          isActive
            ? "border-[#c21219] shadow-lg ring-2 ring-[#c21219]"
            : "border-white/20 hover:border-[#c21219] hover:shadow-lg"
        }`}
      onClick={() => onClick(job)}
    >
      <div className="relative w-full h-40 overflow-hidden rounded-lg mb-3 bg-black/30">
        <Image
          src={job.image || "/placeholder-job.jpg"}
          alt={job.title}
          width={640}
          height={320}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
        />
      </div>

      <h3
        className={`text-lg font-semibold transition-colors duration-200 ${
          isActive ? "text-[#c21219]" : "text-white hover:text-[#c21219]"
        }`}
      >
        {job.title}
      </h3>

      <p className="text-xs text-gray-400 mt-1">
        {job.organization} {job.location && `— ${job.location}`}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {job.category} {job.tech && `| ${job.tech}`}
      </p>

      <div className="mt-3 flex gap-3 text-sm">
        {job.budget && (
          <span className="px-2 py-1 bg-white/10 rounded-md border border-white/20">
            Budget:{" "}
            <span className="text-[#c21219] font-semibold">{job.budget}</span>
          </span>
        )}
        {job.hourlyRate && (
          <span className="px-2 py-1 bg-white/10 rounded-md border border-white/20">
            Rate:{" "}
            <span className="text-[#c21219] font-semibold">
              {job.hourlyRate}
            </span>
          </span>
        )}
      </div>

      {job.description && (
        <p className="text-sm text-gray-300 mt-3 line-clamp-3">
          {job.description}
        </p>
      )}
    </div>
  );
}
