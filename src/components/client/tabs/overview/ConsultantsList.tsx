"use client";

import { Consultant } from "@/types/client";
import EmptyState from "@/components/ui/EmptyState";
import { Users } from "lucide-react";

interface ConsultantsListProps {
    consultants: Consultant[];
}

export function ConsultantsList({ consultants }: ConsultantsListProps) {
    if (!consultants || consultants.length === 0) {
        return (
            <section className="bg-[#111] border border-white/20 rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-semibold text-[#2563EB] mb-4">Consultants</h2>
                <EmptyState
                    icon={Users}
                    title="No consultants yet"
                    description="Hire a consultant to see them listed here."
                    ctaLabel="Find Consultants"
                    ctaHref="/talent"
                />
            </section>
        );
    }

    return (
        <section className="bg-[#111] border border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-[#2563EB] mb-4">Consultants</h2>
            <div className="space-y-4">
                {consultants.map((c) => (
                    <div
                        key={c.id}
                        className="bg-gray-800 p-4 rounded-lg hover:bg-[#1a1a1a] transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                        <div>
                            <p className="font-bold text-white text-lg">{c.name}</p>
                            <p className="text-sm text-gray-400">{c.role}</p>
                            <p className="text-xs text-gray-500 mt-1">{c.industry}</p>
                        </div>
                        <div className="text-left sm:text-right">
                            <div className="flex items-center gap-1 sm:justify-end">
                                <span className="text-[#2563EB] font-medium">{c.rating}</span>
                                <span className="text-yellow-500">★</span>
                            </div>
                            <p className="text-sm text-gray-300 font-medium mt-1">
                                {typeof c.rate === "number" ? `$${c.rate}/hr` : c.rate}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
