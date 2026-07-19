"use client";

import { useState } from "react";
import { Consultant } from "@/types/client";
import { Project, WorkPhase, Milestone } from "@/types/project";

interface AddConsultantFormProps {
    initialData?: Consultant;
    projects: Project[];
    onSubmit: (
        consultant: Consultant & { projectId?: string; workPhaseId?: string; milestoneId?: string }
    ) => void;
    onCancel: () => void;
}

export function AddConsultantForm({
    initialData,
    projects,
    onSubmit,
    onCancel,
}: AddConsultantFormProps) {
    const [formData, setFormData] = useState<Consultant>(
        initialData || {
            id: crypto.randomUUID(),
            name: "",
            industry: "",
            delivery: "",
            rate: "",
            rating: 0,
            role: "",
            experience: 0,
        }
    );

    const [projectId, setProjectId] = useState<string>("");
    const [workPhaseId, setWorkPhaseId] = useState<string>("");
    const [milestoneId, setMilestoneId] = useState<string>("");

    const selectedProject = projects.find((p) => p.id === projectId);
    const workPhases: WorkPhase[] = selectedProject?.workPhases || [];
    const milestones: Milestone[] = selectedProject?.milestones || [];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "rating" || name === "experience" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, projectId, workPhaseId, milestoneId });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-[#111] border border-white/20 rounded-xl p-6 space-y-4 w-full max-w-md shadow-md hover:shadow-lg transition"
        >
            <h2 className="text-xl font-semibold text-[#2563EB] mb-4">
                {initialData ? "Edit Consultant" : "Add Consultant to Project"}
            </h2>

            {/* Project Selector */}
            <div>
                <label className="block text-sm text-gray-400">Assign to Project</label>
                <select
                    value={projectId}
                    onChange={(e) => {
                        setProjectId(e.target.value);
                        setWorkPhaseId("");
                        setMilestoneId("");
                    }}
                    className="w-full mt-1 p-2 rounded bg-black text-white border border-gray-700 focus:ring-2 focus:ring-[#2563EB] hover:bg-[#1a1a1a]"
                >
                    <option value="">-- Select Project --</option>
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Work Phase Selector */}
            {projectId && (
                <div>
                    <label className="block text-sm text-gray-400">Work Phase</label>
                    <select
                        value={workPhaseId}
                        onChange={(e) => setWorkPhaseId(e.target.value)}
                        className="w-full mt-1 p-2 rounded bg-black text-white border border-gray-700 focus:ring-2 focus:ring-[#2563EB] hover:bg-[#1a1a1a]"
                    >
                        <option value="">-- Select Work Phase --</option>
                        {workPhases.map((wp) => (
                            <option key={wp.id} value={wp.id}>
                                {wp.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Milestone Selector */}
            {workPhaseId && (
                <div>
                    <label className="block text-sm text-gray-400">Milestone / Task</label>
                    <select
                        value={milestoneId}
                        onChange={(e) => setMilestoneId(e.target.value)}
                        className="w-full mt-1 p-2 rounded bg-black text-white border border-gray-700 focus:ring-2 focus:ring-[#2563EB] hover:bg-[#1a1a1a]"
                    >
                        <option value="">-- Select Milestone --</option>
                        {milestones
                            .filter((m) => m.workPhaseId === workPhaseId)
                            .map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.title}
                                </option>
                            ))}
                    </select>
                </div>
            )}

            {/* Consultant Fields */}
            <div>
                <label className="block text-sm text-gray-400">Name</label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 rounded bg-black text-white border border-gray-700 focus:ring-2 focus:ring-[#2563EB] hover:bg-[#1a1a1a]"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-400">Role</label>
                <input
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Lead Developer"
                    className="w-full mt-1 p-2 rounded bg-black text-white border border-gray-700 focus:ring-2 focus:ring-[#2563EB] hover:bg-[#1a1a1a]"
                />
            </div>

            {/* Industry, Delivery, Rate, Rating, Experience, Image */}
            {/* ... keep your existing fields here with same styling ... */}

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800 text-sm font-semibold text-white transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-sm font-semibold text-white transition transform hover:scale-105"
                >
                    {initialData ? "Save Changes" : "Add Consultant"}
                </button>
            </div>
        </form>
    );
}
