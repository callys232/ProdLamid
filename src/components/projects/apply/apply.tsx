"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ApplyForm from "./applyform";
import BidSummary from "./bidSummary";
import ApplySuccess from "./applySucces";
import {
  teamProjects,
  individualProjects,
  mockActivity,
} from "@/mocks/mockClient";

export default function ApplyPage({ params }: { params: { id: string } }) {
  const [submitted, setSubmitted] = useState(false);
  const [bidDetails, setBidDetails] = useState<{
    name: string;
    email: string;
    cvFile?: File | null;
    amount: string;
    timeline: string;
  } | null>(null);

  // Find project by id from mock data
  const project =
    teamProjects.find((p) => p.id === params.id) ||
    individualProjects.find((p) => p.id === params.id) ||
    teamProjects[0]; // fallback

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Left: Application Form */}
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-6 flex items-center gap-3">
          <span className="text-[#c21219]">🚀</span> Apply / Bid for Project
        </h1>
        <ApplyForm
          project={project}
          onSubmit={(details) => {
            setBidDetails(details);

            mockActivity.unshift({
              id: String(mockActivity.length + 1),
              action: "Bid Placed",
              user: "You",
              timestamp: new Date().toISOString(),
              details: `Proposed ${details.amount} with ${details.timeline} delivery`,
            });

            setSubmitted(true);
          }}
        />
      </div>

      {/* Right: Project Summary */}
      <div className="w-96 bg-white/10 backdrop-blur-xl border border-white/20 rounded-l-2xl p-6 shadow-xl">
        <BidSummary projectId={params.id} project={project} />
      </div>

      {/* Success Modal */}
      {submitted && (
        <ApplySuccess
          onClose={() => setSubmitted(false)}
          bidDetails={bidDetails || undefined}
        />
      )}
    </motion.div>
  );
}
