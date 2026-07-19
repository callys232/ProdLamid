"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Project } from "@/types/project"; // ✅ single source of truth

export default function ProjectOverview({ project }: { project: Project }) {
  const {
    id,
    title,
    organization,
    location,
    category,
    rating = 0,
    image,
    images,
    budget,
    hourlyRate,
    tech,
    timeline,
    milestones = [],
    skills = [],
    escrow = [],
    suggestedBidRange,
    consultants = [],
    priority,
    deadline,
    status,
    teamId,
    ownerId,
    milestoneProgress,
  } = project;

  const [activeTab, setActiveTab] = useState<
    "milestones" | "skills" | "escrow"
  >("milestones");

  const fallbackImage = "/images/default-project.jpg";

  return (
    <div className="bg-[#1a0d0d] border border-[#3a1919] rounded-xl p-6 text-gray-200 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Image
          src={image || fallbackImage}
          alt={title}
          width={80}
          height={80}
          className="rounded object-cover"
        />
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-sm text-gray-400">{organization}</p>
          <p className="text-sm text-gray-400">
            {location} • {category}
          </p>
          <div className="text-blue-500 text-sm mt-1">
            {rating > 0 ? "★".repeat(rating) : "No rating"}
          </div>
        </div>
      </div>

      {/* Extra Images */}
      {images && images.length > 0 && (
        <div className="flex gap-2 mt-2">
          {images.map((img: string, i: number) => (
            <Image
              key={i}
              src={img}
              alt={`Project image ${i + 1}`}
              width={60}
              height={60}
              className="rounded object-cover"
            />
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-400">Budget</p>
          <p className="text-lg text-white">{budget || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Rate</p>
          <p className="text-lg text-white">{hourlyRate || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Tech</p>
          <p className="text-lg text-white">{tech || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Timeline</p>
          <p className="text-lg text-white">{timeline || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Project ID</p>
          <p className="text-lg text-white">{id}</p>
        </div>
        {priority && (
          <div>
            <p className="text-sm text-gray-400">Priority</p>
            <p className="text-lg text-white">{priority}</p>
          </div>
        )}
        {deadline && (
          <div>
            <p className="text-sm text-gray-400">Deadline</p>
            <p className="text-lg text-white">{deadline}</p>
          </div>
        )}
        {status && (
          <div>
            <p className="text-sm text-gray-400">Status</p>
            <p className="text-lg text-white">{status}</p>
          </div>
        )}
        {suggestedBidRange && (
          <div>
            <p className="text-sm text-gray-400">Suggested Bid Range</p>
            <p className="text-lg text-white">
              ${suggestedBidRange.min} – ${suggestedBidRange.max}
            </p>
          </div>
        )}
        {milestoneProgress !== undefined && (
          <div>
            <p className="text-sm text-gray-400">Milestone Progress</p>
            <p className="text-lg text-white">{milestoneProgress}%</p>
          </div>
        )}
        {teamId && (
          <div>
            <p className="text-sm text-gray-400">Team ID</p>
            <p className="text-lg text-white">{teamId}</p>
          </div>
        )}
        {ownerId && (
          <div>
            <p className="text-sm text-gray-400">Owner ID</p>
            <p className="text-lg text-white">{ownerId}</p>
          </div>
        )}
      </div>

      {/* Consultants */}
      {consultants.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-white">Consultants</h3>
          <ul className="list-disc pl-6 text-gray-300">
            {consultants.map((c, i) => (
              <li key={i}>{typeof c === "string" ? c : c.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mt-6">
        {["milestones", "skills", "escrow"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "milestones" &&
          (milestones.length > 0 ? (
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              {milestones.map((m, i) => (
                <li key={i}>{m.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No milestones available.</p>
          ))}

        {activeTab === "skills" &&
          (skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <span
                  key={i}
                  className="bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No skills listed.</p>
          ))}

        {activeTab === "escrow" &&
          (escrow.length > 0 ? (
            <table className="w-full text-left text-sm text-gray-300">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th>Milestone</th>
                </tr>
              </thead>
              <tbody>
                {escrow.map((tx, i) => (
                  <tr key={i}>
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td>${tx.amount.toLocaleString()}</td>
                    <td>{tx.currency}</td>
                    <td>{tx.status}</td>
                    <td>
                      {milestones.find((m) => m.id === tx.milestoneId)?.title ||
                        "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400">No escrow transactions found.</p>
          ))}
      </div>
    </div>
  );
}
