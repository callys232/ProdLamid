"use client";

import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg";
}

export default function Modal({
    open,
    onClose,
    title,
    children,
    size = "md",
}: ModalProps) {

    // Prevent background scroll
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    const sizes = {
        sm: "max-w-md",
        md: "max-w-xl",
        lg: "max-w-2xl",
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* BACKDROP */}
                    <div
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* MODAL */}
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className={`relative w-full ${sizes[size]} bg-[#111] border border-gray-800 rounded-xl shadow-xl`}
                    >
                        {/* HEADER */}
                        {(title || true) && (
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                                <h3 className="text-lg font-semibold text-white">
                                    {title}
                                </h3>

                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* BODY */}
                        <div className="p-5 text-sm text-gray-300 leading-relaxed">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}