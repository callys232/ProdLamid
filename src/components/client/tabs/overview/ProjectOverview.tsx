"use client";

import { useEffect, useState } from "react";

export default function ProjectOverview() {
    const [projectInfo, setProjectInfo] = useState<any>(null);

    useEffect(() => {
        const fetchProjectInfo = async () => {
            try {
                const res = await fetch("/api/groupware/project-overview");
                if (!res.ok) throw new Error("DB failed");
                const data = await res.json();
                setProjectInfo(data);
            } catch (error) {
                console.warn("DB failed, using fallback:", error);
                const localData = localStorage.getItem("projectInfo");
                if (localData) setProjectInfo(JSON.parse(localData));
            }
        };

        fetchProjectInfo();
    }, []);

    if (!projectInfo) {
        return <p className="text-gray-400">No project overview available</p>;
    }

    return (
        <section className="bg-[#111] border border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-6 text-[#c12129]">Project Overview</h2>

            {/* Project Info */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#c12129] mb-2">Project Information</h3>
                <p><strong>Name:</strong> {projectInfo.projectName}</p>
                <p><strong>Purpose:</strong> {projectInfo.purpose}</p>
                <p>
                    <strong>Color:</strong>{" "}
                    <span
                        className="inline-block w-4 h-4 rounded-full ml-2 border border-white/30"
                        style={{ backgroundColor: projectInfo.color }}
                    ></span>
                </p>
            </div>

            {/* Skills */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#c12129] mb-2">Skills Required</h3>
                <ul className="flex flex-wrap gap-2">
                    {projectInfo.skills?.map((skill: string, idx: number) => (
                        <li
                            key={idx}
                            className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-[#c12129] hover:text-white transition"
                        >
                            {skill}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Clients */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#c12129] mb-2">Clients</h3>
                <ul className="list-disc ml-6 space-y-1">
                    {projectInfo.clients?.map((client: string, idx: number) => (
                        <li key={idx} className="hover:text-[#c12129] transition">{client}</li>
                    ))}
                </ul>
            </div>

            {/* Work Plan */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#c12129] mb-2">Work Plan</h3>
                <ol className="list-decimal ml-6 space-y-1">
                    {projectInfo.workPhases?.map((phase: any, idx: number) => (
                        <li key={idx} className="hover:text-[#c12129] transition">
                            <strong>{phase.name}</strong> — {phase.duration}
                        </li>
                    ))}
                </ol>
            </div>

            {/* Consultants */}
            <div>
                <h3 className="text-xl font-semibold text-[#c12129] mb-2">Consultants / Freelancers</h3>
                <div className="space-y-4">
                    {projectInfo.consultants?.map((c: any, idx: number) => (
                        <div
                            key={idx}
                            className="bg-gray-800 p-4 rounded-lg hover:bg-[#1a1a1a] transition"
                        >
                            <p><strong>Name:</strong> {c.name}</p>
                            <p><strong>Role:</strong> {c.role}</p>
                            <p><strong>Schedule:</strong> {c.schedule}</p>
                            <p>
                                <strong>Progress:</strong>{" "}
                                <span className="text-[#c12129] font-semibold">{c.progress}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
