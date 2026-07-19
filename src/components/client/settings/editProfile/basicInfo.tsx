"use client";

import { useState, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { MultiStepFormValues } from "@/types/userProfile";

/* ================= TYPES ================= */

type OnChange = <K extends keyof MultiStepFormValues>(
    field: K,
    value: MultiStepFormValues[K]
) => void;

interface Props {
    data: MultiStepFormValues;
    onChange: OnChange;
}

/* ================= COMPONENT ================= */

export default function StepBasicInfo({ data, onChange }: Props) {
    const {
        register,
        formState: { errors, isSubmitted },
        watch,
    } = useFormContext<MultiStepFormValues>();

    /* ---------------- WATCH ---------------- */

    const bioValue = watch("bio") || "";

    /* ---------------- IMAGE STATE ---------------- */

    const [preview, setPreview] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);

    /* ---------------- SYNC PREVIEW ---------------- */

    useEffect(() => {
        if (!data?.photo) {
            setPreview(null);
            return;
        }

        if (data.photo instanceof File) {
            const url = URL.createObjectURL(data.photo);
            setPreview(url);

            return () => URL.revokeObjectURL(url);
        }

        setPreview(String(data.photo));
    }, [data.photo]);

    /* ---------------- FILE HANDLER ---------------- */

    const handleFile = useCallback(
        (file: File) => {
            if (!file) return;

            // type validation
            if (!file.type.startsWith("image/")) {
                return;
            }

            // size validation (5MB)
            if (file.size > 5 * 1024 * 1024) {
                return;
            }

            onChange("photo", file);
        },
        [onChange]
    );

    /* ---------------- DRAG HANDLERS ---------------- */

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    /* ---------------- INPUT HANDLER ---------------- */

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    /* ---------------- ERROR RENDER ---------------- */

    const renderError = (field: keyof MultiStepFormValues) => {
        const error = errors[field];

        if (!error) return null;

        // show after submit OR when field has value interaction
        if (!isSubmitted && !watch(field)) return null;

        return (
            <p className="text-xs text-blue-500 mt-1 animate-fadeIn">
                {error.message as string}
            </p>
        );
    };

    /* ---------------- RENDER ---------------- */

    return (
        <div className="space-y-6">
            {/* PROFILE IMAGE */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative flex flex-col items-center justify-center
          h-36 border-2 border-dashed rounded-xl cursor-pointer
          transition-all duration-300 ease-out
          ${dragging
                        ? "border-[#2563EB] bg-[#2563EB]/10 scale-[1.02] shadow-lg"
                        : "border-gray-700 hover:border-[#2563EB] hover:scale-[1.01] hover:shadow-md"
                    }
        `}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />

                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="
              w-24 h-24 object-cover rounded-full
              border-2 border-[#2563EB]
              shadow-md
              transition-transform duration-300
              hover:scale-105
            "
                    />
                ) : (
                    <span className="text-gray-400 text-sm">
                        Drag & drop or click to upload profile photo (optional)
                    </span>
                )}
            </div>

            {/* NAME */}
            <div className="grid grid-cols-2 gap-4">
                <div className="group">
                    <label className="text-sm">First Name</label>
                    <input
                        {...register("firstName", {
                            required: "First name is required",
                            minLength: {
                                value: 2,
                                message: "First name must be at least 2 characters",
                            },
                        })}
                        className="
              w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md
              focus:ring-2 focus:ring-[#2563EB] outline-none transition
              group-hover:shadow-md hover:scale-[1.01]
            "
                        placeholder="John"
                    />
                    {renderError("firstName")}
                </div>

                <div className="group">
                    <label className="text-sm">Last Name</label>
                    <input
                        {...register("lastName", {
                            required: "Last name is required",
                            minLength: {
                                value: 2,
                                message: "Last name must be at least 2 characters",
                            },
                        })}
                        className="
              w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md
              focus:ring-2 focus:ring-[#2563EB] outline-none transition
              group-hover:shadow-md hover:scale-[1.01]
            "
                        placeholder="Doe"
                    />
                    {renderError("lastName")}
                </div>
            </div>

            {/* LOCATION */}
            <div className="group">
                <label className="text-sm">Location</label>
                <input
                    {...register("location", {
                        required: "City is required",
                        minLength: {
                            value: 2,
                            message: "Location must be at least 2 characters",
                        },
                    })}
                    className="
            w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md
            focus:ring-2 focus:ring-[#2563EB] outline-none transition
            group-hover:shadow-md hover:scale-[1.01]
          "
                    placeholder="Lagos, Nigeria"
                />
                {renderError("location")}
            </div>

            {/* TITLE */}
            <div className="group">
                <label className="text-sm">Professional Title</label>
                <input
                    {...register("title", {
                        required: "Professional title is required",
                        minLength: {
                            value: 2,
                            message: "Title must be at least 2 characters",
                        },
                    })}
                    className="
            w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md
            focus:ring-2 focus:ring-[#2563EB] outline-none transition
            group-hover:shadow-md hover:scale-[1.01]
          "
                    placeholder="Software Engineer"
                />
                {renderError("title")}
            </div>

            {/* BIO */}
            <div className="group">
                <label className="text-sm">Bio</label>
                <textarea
                    {...register("bio", {
                        required: "Bio is required",
                        minLength: {
                            value: 10,
                            message: "Bio must be at least 10 characters",
                        },
                        maxLength: {
                            value: 500,
                            message: "Bio must be less than 500 characters",
                        },
                    })}
                    rows={4}
                    className="
            w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md
            focus:ring-2 focus:ring-[#2563EB] outline-none resize-none transition
            group-hover:shadow-md hover:scale-[1.01]
          "
                    placeholder="Describe your expertise, experience, and what you bring..."
                />

                <div className="text-xs text-gray-500 mt-1 text-right">
                    {bioValue.length}/500
                </div>

                {renderError("bio")}
            </div>
        </div>
    );
}