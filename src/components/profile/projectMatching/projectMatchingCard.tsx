"use client";

import { motion } from "framer-motion";
import ScoreBar from "./scoreBar";
import ExplainabilityPanel from "./explainer";

export default function ProjectMatchingCard({
    result,
    selected,
    onSelect,
    onApply,
}: any) {
    const { project, score } = result;

    return (
        <motion.div
            layout
            whileHover={{ y: -6, scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className={`
        group cursor-pointer rounded-2xl p-5 bg-white
        border border-gray-200
        transition-all duration-300

        shadow-[0_4px_12px_rgba(0,0,0,0.05)]
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]

        ${selected ? "ring-2 ring-[#2563EB] shadow-[0_0_0_3px_rgba(37,99,235,0.15)]" : ""}
      `}
        >
            {/* HEADER */}
            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-black group-hover:text-[#2563EB] transition">
                    {project.title}
                </h3>

                <span className="text-xs text-blue-400 group-hover:text-[#2563EB] transition">
                    {project.location}
                </span>
            </div>

            {/* META */}
            <p className="text-xs text-gray-500 mt-1">
                {project.category}
            </p>

            {/* MARKET SIGNALS */}
            <div className="flex justify-between mt-3 text-xs">
                <span className="px-2 py-1 rounded bg-gray-100 group-hover:bg-blue-50 transition">
                    🔥 {project.urgency || "Normal"}
                </span>
                <span className="px-2 py-1 rounded bg-gray-100 group-hover:bg-black/5 transition">
                    📊 {project.proposals || 0} bids
                </span>
            </div>

            {/* SCORES */}
            <div className="mt-4 space-y-2">
                <ScoreBar label="Fit Score" value={score.total} />
                <ScoreBar label="Skills" value={score.skillMatch} />
                <ScoreBar label="Experience" value={score.experience} />
            </div>

            {/* CTA */}
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                    e.stopPropagation();
                    onApply();
                }}
                className="
          mt-5 w-full py-2 rounded-lg font-semibold
          bg-[#2563EB] text-blue-500
          shadow-sm
          hover:bg-blue-700 hover:shadow-md
          transition-all
        "
            >
                Apply / Bid
            </motion.button>

            {/* AI EXPLAINABILITY */}
            <ExplainabilityPanel score={score} />
        </motion.div>
    );
}