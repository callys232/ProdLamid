"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GuideStep {
    title: string;
    description: string;
    target?: string; // data-guide attribute
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
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const controlled = typeof isOpen === "boolean";
    const open = controlled ? isOpen : internalOpen;

    // Auto open if not dismissed
    useEffect(() => {
        if (!controlled) {
            const dismissed = localStorage.getItem(storageKey);
            if (!dismissed) setInternalOpen(true);
        }
    }, [storageKey, controlled]);

    // Handle spotlight target
    useEffect(() => {
        if (!open) return;

        const step = steps[currentStep];
        if (!step?.target) {
            setTargetRect(null);
            return;
        }

        const el = document.querySelector(
            `[data-guide="${step.target}"]`
        ) as HTMLElement;

        if (!el) {
            setTargetRect(null);
            return;
        }

        const updateRect = () => {
            setTargetRect(el.getBoundingClientRect());
        };

        updateRect();
        el.scrollIntoView({ behavior: "smooth", block: "center" });

        window.addEventListener("resize", updateRect);
        window.addEventListener("scroll", updateRect);

        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("resize", updateRect);
            window.removeEventListener("scroll", updateRect);
            document.body.style.overflow = "auto";
        };
    }, [currentStep, open, steps]);

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
        setTargetRect(null);
        document.body.style.overflow = "auto";
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
            <>
                {/* Overlay */}
                <motion.div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />

                {/* Spotlight */}
                {targetRect && (
                    <div
                        className="fixed z-50 border-2 border-red-500 rounded-xl pointer-events-none transition-all duration-200"
                        style={{
                            top: targetRect.top,
                            left: targetRect.left,
                            width: targetRect.width,
                            height: targetRect.height,
                        }}
                    />
                )}

                {/* Arrow */}
                {targetRect && (
                    <div
                        className="fixed z-50 w-4 h-4 bg-red-600 rotate-45"
                        style={{
                            top: targetRect.bottom + 8,
                            left: targetRect.left + 24,
                        }}
                    />
                )}

                {/* Guide Card */}
                <motion.div
                    className="fixed z-50 bg-gray-900 text-white w-[420px] max-w-[90%] rounded-xl shadow-xl p-6 border border-gray-700"
                    style={{
                        top: targetRect
                            ? targetRect.bottom + 20
                            : "50%",
                        left: targetRect
                            ? targetRect.left
                            : "50%",
                        transform: targetRect
                            ? "none"
                            : "translate(-50%, -50%)",
                    }}
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
                        <h2 className="text-lg font-semibold mb-2">
                            {step.title}
                        </h2>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            {step.description}
                        </p>
                    </div>

                    {/* Footer */}
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
                            {currentStep === steps.length - 1
                                ? "Finish"
                                : "Next"}
                        </button>
                    </div>
                </motion.div>
            </>
        </AnimatePresence>
    );
}