"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Step {
    ref: React.RefObject<HTMLElement>;
    title: string;
    description: string;
}

interface ProfileTourProps {
    open: boolean;
    onClose: () => void;
    steps: Step[];
}

export default function ProfileTour({
    open,
    onClose,
    steps,
}: ProfileTourProps) {
    const [stepIndex, setStepIndex] = useState(0);
    const [rect, setRect] = useState<DOMRect | null>(null);

    /* Lock scroll */
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    /* Update spotlight */
    useEffect(() => {
        if (!open) return;

        const current = steps[stepIndex];
        if (!current?.ref.current) return;

        const r = current.ref.current.getBoundingClientRect();
        setRect(r);
    }, [open, stepIndex, steps]);

    const next = () => {
        if (stepIndex < steps.length - 1) {
            setStepIndex((prev) => prev + 1);
        } else {
            onClose();
            setStepIndex(0);
        }
    };

    const prev = () => {
        if (stepIndex > 0) setStepIndex((prev) => prev - 1);
    };

    return (
        <AnimatePresence>
            {open && rect && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/70 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Spotlight */}
                    <div
                        className="fixed z-50 pointer-events-none border-2 border-red-500 rounded-xl"
                        style={{
                            top: rect.top - 8,
                            left: rect.left - 8,
                            width: rect.width + 16,
                            height: rect.height + 16,
                        }}
                    />

                    {/* Tooltip */}
                    <motion.div
                        className="fixed z-50 bg-gray-900 border border-red-600 p-4 rounded-xl w-80 shadow-xl"
                        style={{
                            top: rect.bottom + 15,
                            left: rect.left,
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white font-semibold">
                                {steps[stepIndex].title}
                            </h3>
                            <button onClick={onClose}>
                                <X size={16} className="text-gray-400" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-400 mb-4">
                            {steps[stepIndex].description}
                        </p>

                        <div className="flex justify-between">
                            <button
                                onClick={prev}
                                disabled={stepIndex === 0}
                                className="text-sm text-gray-400"
                            >
                                Previous
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={onClose}
                                    className="text-sm text-gray-400"
                                >
                                    Skip
                                </button>

                                <button
                                    onClick={next}
                                    className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                    {stepIndex === steps.length - 1
                                        ? "Finish"
                                        : "Next"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}