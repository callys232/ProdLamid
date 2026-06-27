"use client";

import { useState, ReactNode } from "react";
import Modal from "./modal";

interface ModalTriggerProps {
    trigger: ReactNode;
    title?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg";
}

export default function ModalTrigger({
    trigger,
    title,
    children,
    size,
}: ModalTriggerProps) {

    const [open, setOpen] = useState(false);

    return (
        <>
            <div onClick={() => setOpen(true)} className="cursor-pointer">
                {trigger}
            </div>

            <Modal open={open} onClose={() => setOpen(false)} title={title} size={size}>
                {children}
            </Modal>
        </>
    );
}