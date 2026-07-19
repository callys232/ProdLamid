"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { MultiStepFormValues } from "@/types/userProfile";

interface Props {
    data: Partial<MultiStepFormValues>;
    onChange: <K extends keyof MultiStepFormValues>(
        field: K,
        value: MultiStepFormValues[K]
    ) => void;
}

export default function StepProfessional({ data, onChange }: Props) {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext<MultiStepFormValues>();

    /* ---------------- STATE ---------------- */
    const [skillInput, setSkillInput] = useState("");

    /* ---------------- FORM STATE (SOURCE OF TRUTH) ---------------- */
    const skills = watch("skills") || [];

    /* ---------------- ADD SKILL ---------------- */
    const handleAddSkill = () => {
        const value = skillInput.trim().toLowerCase();

        if (!value) return;
        if (skills.includes(value)) {
            setSkillInput("");
            return;
        }
        if (skills.length >= 20) return;

        onChange("skills", [...skills, value]);
        setSkillInput("");
    };

    /* ---------------- REMOVE SKILL ---------------- */
    const handleRemoveSkill = (skill: string) => {
        const updated = skills.filter((s) => s !== skill);
        onChange("skills", updated);
    };

    /* ---------------- ENTER KEY ---------------- */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddSkill();
        }
    };

    /* ---------------- RENDER ---------------- */
    return (
        <div className="space-y-6">

            {/* TITLE */}
            <div className="group relative">
                <label className="text-sm">Professional Title</label>
                <input
                    {...register("title", {
                        required: "Title is required",
                        minLength: { value: 3, message: "Too short" },
                        maxLength: { value: 60, message: "Too long" },
                    })}
                    className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md
                    focus:ring-2 focus:ring-[#2563EB] outline-none transition
                    shadow-sm group-hover:shadow-md hover:scale-[1.01]"
                    placeholder="Full Stack Developer | Fintech Specialist"
                />
                {errors.title && (
                    <p className="text-xs text-blue-500 mt-1">
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* INDUSTRY */}
            <div className="group relative">
                <label className="text-sm">Industry</label>
                <select
                    {...register("industry", {
                        required: "Industry is required",
                    })}
                    className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md
                    focus:ring-2 focus:ring-[#2563EB] outline-none transition
                    shadow-sm group-hover:shadow-md hover:scale-[1.01]"
                >
                    <option value="">Select industry</option>
                    <option value="software">Software Development</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="finance">Finance</option>
                    <option value="consulting">Consulting</option>
                </select>
                {errors.industry && (
                    <p className="text-xs text-blue-500 mt-1">
                        {errors.industry.message}
                    </p>
                )}
            </div>

            {/* EXPERIENCE */}
            <div className="group relative">
                <label className="text-sm">Years of Experience</label>
                <input
                    type="number"
                    {...register("experience", {
                        required: "Experience is required",
                        min: { value: 0, message: "Invalid value" },
                        max: { value: 50, message: "Too high" },
                        setValueAs: (v) => v === "" ? undefined : Number(v),
                    })}
                    className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md
                    focus:ring-2 focus:ring-[#2563EB] outline-none transition
                    shadow-sm group-hover:shadow-md hover:scale-[1.01]"
                    placeholder="5"
                />
                {errors.experience && (
                    <p className="text-xs text-blue-500 mt-1">
                        {errors.experience.message}
                    </p>
                )}
            </div>

            {/* RATE */}
            <div className="group relative">
                <label className="text-sm">Hourly Rate ($)</label>
                <input
                    type="number"
                    {...register("rate", {
                        required: "Rate is required",
                        min: { value: 5, message: "Too low" },
                        max: { value: 10000, message: "Too high" },
                        valueAsNumber: true,
                    })}
                    className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md
                    focus:ring-2 focus:ring-[#2563EB] outline-none transition
                    shadow-sm group-hover:shadow-md hover:scale-[1.01]"
                    placeholder="50"
                />
                {errors.rate && (
                    <p className="text-xs text-blue-500 mt-1">
                        {errors.rate.message}
                    </p>
                )}
            </div>

            {/* SKILLS */}
            <div>
                <label className="text-sm">Skills</label>

                {/* INPUT */}
                <div className="flex gap-2">
                    <input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-gray-900 border border-gray-700 px-3 py-2 rounded-md
                        focus:ring-2 focus:ring-[#2563EB] outline-none transition
                        shadow-sm hover:shadow-md hover:scale-[1.01]"
                        placeholder="e.g. React, Node.js"
                    />

                    <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-4 py-2 bg-[#2563EB] text-white rounded-md
                        hover:bg-blue-700 active:scale-95 transition shadow-md hover:shadow-lg"
                    >
                        Add
                    </button>
                </div>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill, idx) => (
                        <span
                            key={idx}
                            className="flex items-center gap-2 px-3 py-1 text-xs
                            bg-gray-800 border border-gray-700 rounded-full
                            hover:border-[#2563EB] hover:bg-[#2563EB]/10
                            hover:scale-[1.03] transition-all duration-200 shadow-sm"
                        >
                            {skill}
                            <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="text-gray-400 hover:text-blue-500 transition"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>

                {/* VALIDATION ERROR */}
                {errors.skills && (
                    <p className="text-xs text-blue-500 mt-1">
                        {errors.skills.message}
                    </p>
                )}

                <p className="text-xs text-gray-500 mt-1">
                    Max 20 skills • Press Enter to add
                </p>
            </div>
        </div>
    );
}