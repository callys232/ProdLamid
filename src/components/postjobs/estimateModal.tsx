"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export function Modal({
    open,
    onClose,
    title,
    children,
    maxWidth = "max-w-3xl",
}: ModalProps) {

    // ESC close + scroll lock
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>

            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >

                    {/* MODAL CARD */}
                    <motion.div
                        className={`w-full ${maxWidth} bg-white rounded-2xl shadow-2xl relative overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.96, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.96, opacity: 0, y: 10 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                    >

                        {/* HEADER */}
                        <div className="flex items-center justify-between px-5 py-4 border-b">

                            <h3 className="text-sm font-semibold text-gray-800">
                                {title}
                            </h3>

                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-black transition transform hover:scale-110"
                            >
                                ✕
                            </button>

                        </div>

                        {/* CONTENT */}
                        <div className="p-5">
                            {children}
                        </div>

                    </motion.div>

                </motion.div>
            )}

        </AnimatePresence>
    );
}