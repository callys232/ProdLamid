"use client";

import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AnalyticsSectionProps {
    analytics: {
        projects: number;
        consultants: number;
        budget: number;
        workphrase: number;
    };
}

export function AnalyticsSection({ analytics }: AnalyticsSectionProps) {
    const data = {
        labels: ["Projects", "Consultants", "Budget", "Workphrases"],
        datasets: [
            {
                data: [
                    analytics.projects,
                    analytics.consultants,
                    analytics.budget,
                    analytics.workphrase,
                ],
                backgroundColor: [
                    "#c12129", // red accent
                    "#1a1a1a", // dark gray
                    "#444",    // medium gray
                    "#888",    // light gray
                ],
                borderColor: ["#d40707ff", "#fff", "#fff", "#fff"],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                labels: {
                    color: "#fff",
                    font: { size: 14 },
                },
            },
        },
    };

    return (
        <section className="bg-[#111] border border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-[#c12129] mb-6">Analytics project Overview</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="w-64 h-64">
                    <Pie data={data} options={options} />
                </div>
                <div className="space-y-2 text-white">
                    <p><strong>Projects:</strong> {analytics.projects}</p>
                    <p><strong>Consultants:</strong> {analytics.consultants}</p>
                    <p><strong>Budget:</strong> ${analytics.budget}</p>
                    <p><strong>Workphrase:</strong> {analytics.workphrase}</p>
                </div>
            </div>
        </section>
    );
}
