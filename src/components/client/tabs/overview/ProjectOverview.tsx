"use client";

import { useEffect, useState } from "react";
import BidsList from "@/components/projects/project/BidsList";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function ProjectOverview() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedBids, setExpandedBids] = useState<Record<string, boolean>>({});

    const toggleBids = (projectId: string) => {
        setExpandedBids(prev => ({ ...prev, [projectId]: !prev[projectId] }));
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/projects?role=owner");
                const result = await res.json();
                if (!res.ok) throw new Error(result.message || "Fetch failed");
                setProjects(result.data || []);
            } catch (error: any) {
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return <p className="text-gray-400">Loading projects...</p>;

    if (projects.length === 0) {
        return (
            <section className="bg-[#111] border border-white/20 rounded-xl p-8 text-center shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-[#2563EB]">Your Projects</h2>
                <p className="text-gray-400 mb-6">You haven't posted any projects yet.</p>
                <a
                    href="/postjobs"
                    className="inline-block bg-[#2563EB] px-6 py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition"
                >
                    Post First Project
                </a>
            </section>
        );
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-[#2563EB]">Project Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.map((project) => (
                    <section
                        key={project._id || project.id}
                        className="bg-[#111] border border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white hover:text-[#2563EB] transition">
                                    {project.title}
                                </h3>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${project.status === 'open' ? 'bg-green-900/50 text-green-400 border border-green-700' :
                                    project.status === 'ongoing' ? 'bg-blue-900/50 text-blue-400 border border-blue-700' :
                                        'bg-gray-800 text-gray-400 border border-gray-700'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-300 mb-4">
                                <p><strong>Category:</strong> {project.category}</p>
                                <p><strong>Budget:</strong> {project.budget ? `$${project.budget}` : project.hourlyRate ? `$${project.hourlyRate}/hr` : 'Not specified'}</p>
                                <p><strong>Deadline:</strong> {project.deadline || 'No deadline'}</p>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-tight">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(project.skills || []).slice(0, 3).map((skill: string, idx: number) => (
                                        <span key={idx} className="px-2 py-0.5 bg-gray-800 rounded text-xs border border-gray-700">
                                            {skill}
                                        </span>
                                    ))}
                                    {project.skills?.length > 3 && (
                                        <span className="text-xs text-gray-500">+{project.skills.length - 3} more</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                            <div className="flex -space-x-2">
                                {(project.consultants || []).length > 0 ? (
                                    project.consultants.map((c: any, i: number) => (
                                        <div key={i} title={c.username || c.name} className="w-8 h-8 rounded-full bg-[#2563EB] border-2 border-[#111] flex items-center justify-center text-[10px] font-bold cursor-default">
                                            {c.username?.substring(0, 2).toUpperCase() || c.name?.substring(0, 2).toUpperCase() || '??'}
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-500 italic">No consultants assigned</span>
                                )}
                            </div>
                            <div className="flex gap-4 items-center">
                                <button
                                    onClick={() => toggleBids(project._id || project.id)}
                                    className="text-sm flex items-center gap-1 text-gray-400 hover:text-white transition font-medium"
                                >
                                    {expandedBids[project._id || project.id] ? <FaChevronUp /> : <FaChevronDown />}
                                    Review Bids
                                </button>
                                <a
                                    href={`/projects/${project._id || project.id}`}
                                    className="text-sm text-[#2563EB] hover:underline font-semibold"
                                >
                                    Manage Project →
                                </a>
                            </div>
                        </div>

                        {/* Expandable Bids List */}
                        {expandedBids[project._id || project.id] && (
                            <div className="mt-6 pt-6 border-t border-dashed border-white/10">
                                <BidsList projectId={project._id || project.id} />
                            </div>
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
}
