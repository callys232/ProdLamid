"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Detail = { title: string; value: string | number; route?: string };

export default function StatDropdown({
    label,
    value,
    details,
    isOpen,
    onToggle,
}: {
    label: string;
    value: string | number;
    details: Detail[];
    isOpen: boolean;
    onToggle: () => void;
}) {
    const router = useRouter();

    return (
        <div className="relative">
            {/* Main Stat Card */}
            <button
                onClick={onToggle}
                className={`w-full bg-gray-800 border rounded-lg p-4 shadow-md 
                   flex flex-col items-center transition 
                   ${isOpen ? "border-red-500" : "border-gray-700 hover:border-red-500"}`}
            >
                <span className="text-xl font-bold text-white">{value}</span>
                <span className="text-sm text-gray-400">{label}</span>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4 z-20"
                    >
                        {details.map((d, idx) => (
                            <div
                                key={idx}
                                onClick={() => d.route && router.push(d.route)}
                                className="flex justify-between text-sm text-gray-300 mb-2 last:mb-0 
                           hover:text-white cursor-pointer transition"
                            >
                                <span>{d.title}</span>
                                <span className="font-semibold">{d.value}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
