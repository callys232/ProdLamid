"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function ProjectComparePanel({ selected }: any) {
    if (selected.length !== 2) return null;

    const [a, b] = selected;
    const winner =
        a.score.total > b.score.total ? a : b;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="
          mt-8 p-6 rounded-2xl
          bg-white border border-gray-200
          shadow-[0_10px_30px_rgba(0,0,0,0.08)]
        "
            >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-black">
                        Compare Projects
                    </h3>

                    <span className="text-xs text-gray-400">
                        Decision Assistant
                    </span>
                </div>

                {/* LIST */}
                <div className="space-y-3">
                    {[a, b].map((item, i) => {
                        const isWinner = item.project.id === winner.project.id;

                        return (
                            <motion.div
                                key={item.project.id}
                                whileHover={{ scale: 1.01 }}
                                className={`
                  p-4 rounded-xl flex justify-between items-center
                  transition-all

                  ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}

                  ${isWinner
                                        ? "border border-[#2563EB] shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                                        : "border border-gray-200"}
                `}
                            >
                                <div>
                                    <p className="font-medium text-black">
                                        {item.project.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {item.project.category}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-semibold text-[#2563EB]">
                                        {(item.score.total * 100).toFixed(1)}%
                                    </p>

                                    {isWinner && (
                                        <span className="text-xs text-[#2563EB] font-medium">
                                            Best Choice
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* FOOTER */}
                <div className="mt-4 text-xs text-gray-500 border-t pt-3">
                    AI recommends the project with higher success probability based on your profile.
                </div>
            </motion.div>
        </AnimatePresence>
    );
}