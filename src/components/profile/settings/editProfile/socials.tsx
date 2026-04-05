"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { FaLinkedin, FaGithub, FaTwitter, FaGlobe } from "react-icons/fa";

interface Props {
    data: any;
    onChange: (field: string, value: any) => void;
}

export default function StepSocials({ data, onChange }: Props) {
    const {
        register,
        formState: { errors },
        setValue,
        watch,
    } = useFormContext();

    /* ---------------- WATCH VALUES ---------------- */
    const linkedin = watch("linkedin");
    const github = watch("github");
    const twitter = watch("twitter");
    const website = watch("website");

    /* ---------------- URL VALIDATOR ---------------- */
    const validateURL = (value: string) => {
        if (!value) return true;

        try {
            const url = new URL(value);
            return !!url;
        } catch {
            return "Invalid URL format";
        }
    };

    /* ---------------- NORMALIZE URL ---------------- */
    const normalizeURL = (value: string) => {
        if (!value) return value;

        if (!value.startsWith("http://") && !value.startsWith("https://")) {
            return `https://${value}`;
        }
        return value;
    };

    /* ---------------- HANDLE BLUR NORMALIZATION ---------------- */
    const handleBlur = (field: string, value: string) => {
        const normalized = normalizeURL(value);
        setValue(field as any, normalized, { shouldValidate: true });
        onChange(field, normalized);
    };

    /* ---------------- SOCIAL INPUT COMPONENT ---------------- */
    const SocialInput = ({
        label,
        field,
        icon,
        placeholder,
        value,
        hoverColor,
    }: any) => (
        <div className="space-y-1">
            <label className="text-sm text-gray-300">{label}</label>

            <div
                className={`
          flex items-center gap-3 px-3 py-2 rounded-md border
          bg-gray-900 border-gray-700
          transition-all duration-200
          hover:border-[#c12129]
          focus-within:ring-2 focus-within:ring-[#c12129]
        `}
            >
                <span className={`text-gray-400 ${hoverColor} transition`}>
                    {icon}
                </span>

                <input
                    {...register(field, { validate: validateURL })}
                    defaultValue={value}
                    onBlur={(e) => handleBlur(field, e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-500"
                    placeholder={placeholder}
                />
            </div>

            {errors[field] && (
                <p className="text-xs text-red-500">
                    {errors[field]?.message as string}
                </p>
            )}
        </div>
    );

    /* ---------------- RENDER ---------------- */
    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h3 className="text-lg font-semibold">Social Presence</h3>
                <p className="text-xs text-gray-500">
                    Add your professional links to boost trust and improve AI insights.
                </p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <SocialInput
                    label="LinkedIn"
                    field="linkedin"
                    icon={<FaLinkedin size={18} />}
                    value={linkedin}
                    placeholder="linkedin.com/in/yourname"
                    hoverColor="group-hover:text-blue-500"
                />

                <SocialInput
                    label="GitHub"
                    field="github"
                    icon={<FaGithub size={18} />}
                    value={github}
                    placeholder="github.com/username"
                    hoverColor="group-hover:text-gray-200"
                />

                <SocialInput
                    label="Twitter / X"
                    field="twitter"
                    icon={<FaTwitter size={18} />}
                    value={twitter}
                    placeholder="twitter.com/handle"
                    hoverColor="group-hover:text-blue-400"
                />

                <SocialInput
                    label="Personal Website"
                    field="website"
                    icon={<FaGlobe size={18} />}
                    value={website}
                    placeholder="yourportfolio.com"
                    hoverColor="group-hover:text-green-400"
                />
            </div>

            {/* PREVIEW */}
            <div className="pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500 mb-2">Live Preview</p>

                <div className="flex gap-4 text-gray-400">
                    {linkedin && (
                        <a
                            href={linkedin}
                            target="_blank"
                            className="hover:text-blue-500 hover:scale-110 transition"
                        >
                            <FaLinkedin size={20} />
                        </a>
                    )}
                    {github && (
                        <a
                            href={github}
                            target="_blank"
                            className="hover:text-white hover:scale-110 transition"
                        >
                            <FaGithub size={20} />
                        </a>
                    )}
                    {twitter && (
                        <a
                            href={twitter}
                            target="_blank"
                            className="hover:text-blue-400 hover:scale-110 transition"
                        >
                            <FaTwitter size={20} />
                        </a>
                    )}
                    {website && (
                        <a
                            href={website}
                            target="_blank"
                            className="hover:text-green-400 hover:scale-110 transition"
                        >
                            <FaGlobe size={20} />
                        </a>
                    )}
                </div>
            </div>

        </div>
    );
}