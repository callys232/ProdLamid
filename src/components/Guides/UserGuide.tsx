// components/UserGuide.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GuideStep {
    title: string;
    description: string;
}

interface UserGuideProps {
    steps: GuideStep[];
    storageKey: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export function UserGuide({
    steps,
    storageKey,
    isOpen,
    onClose,
}: UserGuideProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const controlled = typeof isOpen === "boolean";
    const open = controlled ? isOpen : internalOpen;

    useEffect(() => {
        if (!controlled) {
            const dismissed = localStorage.getItem(storageKey);
            if (!dismissed) setInternalOpen(true);
        }
    }, [storageKey, controlled]);

    const closeGuide = (persist = true) => {
        if (persist) {
            localStorage.setItem(storageKey, "dismissed");
        }

        if (controlled && onClose) {
            onClose();
        } else {
            setInternalOpen(false);
        }

        setCurrentStep(0);
    };

    const next = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            closeGuide();
        }
    };

    const previous = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    if (!open) return null;

    const step = steps[currentStep];

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-gray-900 text-white w-[420px] rounded-xl shadow-xl p-6 border border-gray-700"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-gray-400">
                            Step {currentStep + 1} of {steps.length}
                        </span>

                        <button
                            onClick={() => closeGuide()}
                            className="text-gray-400 hover:text-red-500 text-sm"
                        >
                            Skip
                        </button>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">{step.title}</h2>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            {step.description}
                        </p>
                    </div>

                    {/* Footer Controls */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={previous}
                            disabled={currentStep === 0}
                            className="px-4 py-2 text-sm border border-gray-600 rounded-lg disabled:opacity-30 hover:border-red-500 transition"
                        >
                            Previous
                        </button>

                        <button
                            onClick={next}
                            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg transition"
                        >
                            {currentStep === steps.length - 1 ? "Finish" : "Next"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}