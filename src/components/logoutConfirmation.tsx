// components/logout/LogoutConfirmModal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { signOut, Role } from "@/lib/auth";

type Props = {
    onClose: () => void;
    role?: Role;
    sessionId?: string;
    redirectTo?: string;
    ssoLogoutUrl?: string;
};

export default function LogoutConfirmModal({
    onClose,
    role = "client",
    sessionId,
    redirectTo,
    ssoLogoutUrl,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // focus the modal container for accessibility
        containerRef.current?.focus();

        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    async function handleConfirm() {
        setError(null);
        setLoading(true);

        try {
            // optional analytics hook (non-blocking)
            try {
                // analytics.track("logout_initiated", { role });
            } catch { }

            await signOut({ role, sessionId, redirectTo, ssoLogoutUrl });

            // signOut will redirect; if it returns, close modal as fallback
            try {
                // analytics.track("logout_completed", { role });
            } catch { }

            onClose();
        } catch (err: any) {
            setError(err?.message ?? "Logout failed. Please try again.");
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60"
                onClick={() => {
                    if (!loading) onClose();
                }}
                aria-hidden
            />

            <motion.div
                ref={containerRef}
                tabIndex={-1}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                className="relative z-10 w-full max-w-md bg-gray-900 rounded-lg border border-gray-700 p-6 shadow-lg"
                role="dialog"
                aria-modal="true"
                aria-labelledby="logout-title"
            >
                <h3 id="logout-title" className="text-lg font-semibold text-white">
                    Sign out
                </h3>

                <p className="text-sm text-gray-400 mt-2">
                    You are signed in as{" "}
                    <span className="text-gray-200 font-medium">{role}</span>. Signing out will end your session and return you to the sign in page.
                </p>

                {error && (
                    <div className="mt-3 text-xs text-blue-400" role="alert">
                        {error}
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={() => !loading && onClose()}
                        className="px-3 py-2 rounded-md bg-gray-800 text-sm text-gray-200 hover:bg-gray-700"
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        className="px-3 py-2 rounded-md bg-blue-600 text-sm text-white hover:bg-blue-500 disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Signing out…" : "Sign out"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
