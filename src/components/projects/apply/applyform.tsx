"use client";

import { useState } from "react";
import BidMeter from "./bidMeter";
import {
  FaUser,
  FaEnvelope,
  FaFileUpload,
  FaDollarSign,
  FaClock,
} from "react-icons/fa";
import { Project } from "@/types/project";

interface ApplyFormProps {
  project: Project;
  onSubmit: (bidDetails: {
    name: string;
    email: string;
    cvFile?: File | null;
    amount: string;
    timeline: string;
  }) => void;
}

export default function ApplyForm({ project, onSubmit }: ApplyFormProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  const [timeline, setTimeline] = useState("");

  const { min, max } = project.suggestedBidRange || { min: 0, max: 0 };

  const getConfidenceLevel = (bid: number) => {
    if (bid < min * 0.8)
      return { label: "Too Low", color: "bg-red-500", score: 20 };
    if (bid >= min && bid <= max)
      return { label: "Competitive", color: "bg-green-500", score: 80 };
    if (bid > max * 1.2)
      return { label: "Too High", color: "bg-yellow-500", score: 40 };
    return { label: "Moderate", color: "bg-blue-500", score: 60 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate backend call
    setTimeout(() => {
      setLoading(false);
      onSubmit({ name, email, cvFile, amount, timeline });
    }, 1200);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white/5 p-6 rounded-xl shadow-lg border border-white/20"
    >
      {/* Name */}
      <div className="flex items-center gap-3">
        <FaUser className="text-[#c21219]" />
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-transparent border-b border-gray-500 focus:border-[#c21219] outline-none py-2"
          required
        />
      </div>

      {/* Email */}
      <div className="flex items-center gap-3">
        <FaEnvelope className="text-[#c21219]" />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-transparent border-b border-gray-500 focus:border-[#c21219] outline-none py-2"
          required
        />
      </div>

      {/* CV Upload */}
      <div className="flex items-center gap-3">
        <FaFileUpload className="text-[#c21219]" />
        <input
          aria-label="file"
          type="file"
          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
          className="flex-1 text-gray-300"
        />
      </div>

      {/* Bid Amount */}
      <div className="flex items-center gap-3">
        <FaDollarSign className="text-[#c21219]" />
        <input
          type="number"
          placeholder="Your Bid Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 bg-transparent border-b border-gray-500 focus:border-[#c21219] outline-none py-2"
          required
        />
      </div>

      {/* Timeline */}
      <div className="flex items-center gap-3">
        <FaClock className="text-[#c21219]" />
        <input
          type="text"
          placeholder="Proposed Timeline (e.g. 3 weeks)"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          className="flex-1 bg-transparent border-b border-gray-500 focus:border-[#c21219] outline-none py-2"
          required
        />
      </div>

      {/* Confidence Meter */}
      {amount && <BidMeter amount={Number(amount)} min={min} max={max} />}

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-[#c21219]/80 hover:bg-[#c21219] text-white font-semibold shadow-lg transition"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
