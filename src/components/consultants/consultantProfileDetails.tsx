// components/ConsultantProfileDetails.tsx
"use client";

import Link from "next/link";
import type { Consultant, Testimonial, CaseStudy, AvailabilitySlot } from "@/types/client";
import { ExternalLink } from "lucide-react";

interface Props {
    consultant: Consultant;
    isEnterpriseUser?: boolean;
}

export default function ConsultantProfileDetails({ consultant, isEnterpriseUser = false }: Props) {
    const {
        id,
        skills = [],
        bonusSkills = [],
        github,
        website,
        testimonials,
        caseStudies,
        availability,
        certifications,
        experience,
        email,
        role,
    } = consultant;

    return (
        <section className="pb-2 border-b border-gray-100">
            {/* Profile summary + visit profile */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">Profile</h4>
                    <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">{role}</span>
                        {experience ? <span className="text-xs text-gray-500 ml-2">· {experience} yrs</span> : null}
                    </p>
                    <div className="flex items-center gap-2">
                        {github && (
                            <a href={github} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline flex items-center gap-1">
                                GitHub <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                        {website && (
                            <a href={website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline flex items-center gap-1">
                                Website <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                        <Link href={`/consultants/${id}`} className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
                            Visit Profile
                        </Link>
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Skills</h5>
                <div className="flex flex-wrap gap-2">
                    {skills.length ? (
                        skills.map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                {s}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-500">No skills listed.</span>
                    )}
                </div>
            </div>

            {/* Bonus skills (optional) */}
            {bonusSkills?.length ? (
                <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Bonus Skills</h5>
                    <div className="flex flex-wrap gap-2">
                        {bonusSkills.map((b) => (
                            <span key={b} className="px-2 py-0.5 bg-yellow-50 text-yellow-800 rounded-full text-xs font-medium">
                                {b}
                            </span>
                        ))}
                    </div>
                </div>
            ) : null}

            {/* Certifications */}
            {certifications?.length ? (
                <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Certifications</h5>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                        {certifications.map((c) => (
                            <li key={c}>{c}</li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {/* Availability: summary visible to all, detailed for enterprise */}
            <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Availability</h5>

                {availability?.length ? (
                    <>
                        <div className="text-sm text-gray-700 mb-2">
                            {availability.slice(0, 2).map((a: AvailabilitySlot, idx: number) => (
                                <div key={idx}>
                                    <span className="font-medium">{a.day}:</span> {a.slots.slice(0, 2).join(", ")}
                                    {a.slots.length > 2 ? <span className="text-xs text-gray-500"> +{a.slots.length - 2} more</span> : null}
                                </div>
                            ))}
                        </div>

                        {isEnterpriseUser ? (
                            <ul className="text-sm text-gray-700 space-y-1">
                                {availability.map((a: AvailabilitySlot, idx: number) => (
                                    <li key={idx}>
                                        <span className="font-medium">{a.day}:</span> {a.slots.join(", ")}
                                        {a.timezone ? <span className="text-xs text-gray-500 ml-2">· {a.timezone}</span> : null}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="mt-2">
                                <Link href="/pricing" className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">
                                    View full availability — Upgrade
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-sm text-gray-600">No availability provided.</div>
                )}
            </div>

            {/* Enterprise-only: testimonials & case studies teaser */}
            {isEnterpriseUser ? (
                <>
                    {testimonials?.length ? (
                        <div className="mt-3">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">Testimonials</h5>
                            <ul className="space-y-2 text-sm text-gray-700">
                                {testimonials.map((t: Testimonial, i: number) => (
                                    <li key={i} className="bg-gray-50 p-2 rounded">
                                        <p className="italic">“{t.feedback}”</p>
                                        <p className="text-xs text-gray-500 mt-1">— {t.client}, {t.rating}/5</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {caseStudies?.length ? (
                        <div className="mt-3">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">Case Studies</h5>
                            <ul className="list-disc list-inside text-sm text-gray-700">
                                {caseStudies.map((c: CaseStudy, i: number) => (
                                    <li key={i}>
                                        <span className="font-medium">{c.title}</span> — {c.summary}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </>
            ) : null}
        </section>
    );
}
