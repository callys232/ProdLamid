// components/profileSteps/StepReview.tsx
"use client";

import { useState } from "react";
import { FaEdit, FaInfoCircle } from "react-icons/fa";
import clsx from "clsx";

interface StepProps {
    data: Record<string, any>; // Complete form data
    onChange?: (field: string, value: any) => void;
    onJumpToStep: (index: number) => void;
}

export default function StepReview({ data, onJumpToStep }: StepProps) {
    const [hoverSection, setHoverSection] = useState<string | null>(null);

    const sections = [
        { label: "Basic Info", key: "basic", step: 0 },
        { label: "Professional Info", key: "professional", step: 1 },
        { label: "Social Media", key: "socials", step: 2 },
        { label: "Verification / Premium", key: "status", step: 3 },
    ];

    return (
        <div className="space-y-6">
            {sections.map((section) => {
                let content: React.ReactNode = null;

                switch (section.key) {
                    case "basic":
                        content = (
                            <div className="grid grid-cols-2 gap-4">
                                <p><strong>First Name:</strong> {data.firstName || "—"}</p>
                                <p><strong>Last Name:</strong> {data.lastName || "—"}</p>
                                <p><strong>Location:</strong> {data.location || "—"}</p>
                                <p><strong>Bio:</strong> {data.bio || "—"}</p>
                                <div className="col-span-2 flex items-center gap-4">
                                    <strong>Profile Photo:</strong>
                                    {data.profilePhoto ? (
                                        <img
                                            src={data.profilePhoto}
                                            className="w-32 h-32 object-cover rounded-lg mt-1 shadow-md"
                                            alt="Profile"
                                        />
                                    ) : (
                                        <span className="text-gray-400">No photo uploaded</span>
                                    )}
                                </div>
                            </div>
                        );
                        break;

                    case "professional":
                        content = (
                            <div className="grid grid-cols-2 gap-4">
                                <p><strong>Resume:</strong> {data.resumeName || "Not uploaded"}</p>
                                <p><strong>Skills:</strong> {data.skills?.join(", ") || "—"}</p>
                                <p><strong>Projects Completed:</strong> {data.projectsCompleted || 0}</p>
                                <p><strong>Earnings:</strong> ${data.earnings || 0}</p>
                            </div>
                        );
                        break;

                    case "socials":
                        content = (
                            <div className="grid grid-cols-2 gap-4">
                                <p><strong>LinkedIn:</strong> {data.linkedin || "—"}</p>
                                <p><strong>Twitter:</strong> {data.twitter || "—"}</p>
                                <p><strong>Website:</strong> {data.website || "—"}</p>
                                <p><strong>GitHub:</strong> {data.github || "—"}</p>
                            </div>
                        );
                        break;

                    case "status":
                        content = (
                            <div className="grid grid-cols-2 gap-4">
                                <p><strong>Verified:</strong> {data.verified ? "Yes" : "No"}</p>
                                <p><strong>Premium:</strong> {data.premium ? "Yes" : "No"}</p>
                                <p><strong>Certifications:</strong> {data.certifications?.join(", ") || "—"}</p>
                                <p><strong>Cover Letter:</strong> {data.coverLetterName || "Not uploaded"}</p>
                            </div>
                        );
                        break;
                }

                return (
                    <div
                        key={section.key}
                        onMouseEnter={() => setHoverSection(section.key)}
                        onMouseLeave={() => setHoverSection(null)}
                        className={clsx(
                            "bg-black/50 p-5 rounded-lg shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-xl border",
                            hoverSection === section.key
                                ? "border-[#c12129] ring-2 ring-[#c12129]/30"
                                : "border-gray-700"
                        )}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                {section.label}
                                <FaInfoCircle
                                    className="text-gray-400 hover:text-[#c12129] cursor-pointer transition"
                                    title={`Edit ${section.label}`}
                                />
                            </h3>
                            <button
                                type="button"
                                onClick={() => onJumpToStep(section.step)}
                                className="text-sm text-[#c12129] hover:text-red-500 flex items-center gap-1 transition"
                            >
                                <FaEdit /> Edit
                            </button>
                        </div>
                        <div className="text-gray-300 text-sm">{content}</div>
                    </div>
                );
            })}
        </div>
    );
}