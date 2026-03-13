// components/LogoutButton.tsx
"use client";

import React, { useState } from "react";
import { LogOut } from "lucide-react";
import LogoutConfirmModal from "./logoutConfirmation";
import type { Role } from "@/lib/auth";

export default function LogoutButton({ className = "", role = "client" as Role }: { className?: string; role?: Role }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${className} bg-transparent hover:bg-gray-800 border border-gray-700`}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-label="Sign out"
            >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
            </button>

            {open && <LogoutConfirmModal onClose={() => setOpen(false)} role={role} />}
        </>
    );
}
