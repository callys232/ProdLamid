"use client";

import React from "react";

interface SectionWrapperProps {
    title: string;
    gradient?: string;
    children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
    title,
    gradient = "bg-black",
    children,
}) => {
    return (
        <section className={`rounded-xl p-6 shadow-xl ${gradient}`}>
            <header className="mb-6 border-b border-gray-700 pb-3 relative group">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                    {title}
                </h2>
                <div
                    className="
            h-1 w-16 bg-[#2563EB] mt-2 rounded 
            transform scale-x-0 group-hover:scale-x-100 
            transition-transform duration-300 origin-left
          "
                />
            </header>
            {children}
        </section>
    );
};

export default SectionWrapper;
