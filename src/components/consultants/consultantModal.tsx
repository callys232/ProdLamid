// components/ConsultantModal.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Shield, CheckCircle, Lock } from "lucide-react";
import Modal from "@/components/Modals/hcdModal";
import Feedback from "./feedback";
import ConsultantProfileDetails from "./consultantProfileDetails";
import type {
  Consultant,
  Project,
  Testimonial,
  CaseStudy,
  AvailabilitySlot,
} from "@/types/client";
import { useState, useEffect } from "react";
import { mockConsultants } from "@/mocks/mockConsultant";

interface ConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultant?: Consultant | null;
  isPremiumUser?: boolean;
  isEnterpriseUser?: boolean;
}

export default function ConsultantModal({
  isOpen,
  onClose,
  consultant,
  isPremiumUser = true,
  isEnterpriseUser = true,
}: ConsultantModalProps) {
  const data: Consultant = consultant ?? mockConsultants[0];

  const {
    id,
    name,
    image,
    rate,
    rating,
    email,
    skills,
    bonusSkills,
    github,
    website,
    verifiedStatus,
    location,
    preferredEngagementModel,
    insuranceCoverage,
    projects,
    testimonials,
    caseStudies,
    aiMatchScore,
    successRate,
    clientSatisfaction,
    earningsToDate,
    availability,
    certifications,
    industry,
    delivery,
    experience,
    role,
  } = data;

  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loadingHire, setLoadingHire] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserProjects();
      setSelectedProjectId("");
    }
  }, [isOpen]);

  const fetchUserProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const json = await res.json();
      if (json?.success && Array.isArray(json.data)) {
        const mapped: Project[] = json.data.map((p: unknown) => {
          const proj = p as Record<string, unknown>;
          return {
            id: String(proj._id ?? proj.id ?? ""),
            title: String(proj.title ?? "Untitled Project"),
            category: typeof proj.category === "string" ? proj.category : undefined,
            status: typeof proj.status === "string" ? proj.status : undefined,
          };
        });
        setUserProjects(mapped);
      } else {
        setUserProjects([]);
      }
    } catch {
      setUserProjects([]);
    }
  };

  const renderStars = (r: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i + 1 <= Math.round(r) ? "text-blue-500 fill-blue-500" : "text-gray-600"}`} />
    ));

  const handleHire = async () => {
    if (!selectedProjectId || selectedProjectId === "__none") {
      setFeedback({ message: "Please select a project first", type: "error" });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    setLoadingHire(true);
    try {
      const res = await fetch("/api/hire-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultantId: id,
          projectId: selectedProjectId,
          consultantEmail: email,
        }),
      });

      if (res.ok) {
        setFeedback({ message: "Hire request sent successfully!", type: "success" });
        setTimeout(() => {
          setFeedback(null);
          onClose();
        }, 1400);
      } else {
        const errJson = await res.json().catch(() => null);
        setFeedback({ message: errJson?.message || "Something went wrong. Try again.", type: "error" });
        setTimeout(() => setFeedback(null), 2500);
      }
    } catch {
      setFeedback({ message: "Network error. Please try again.", type: "error" });
      setTimeout(() => setFeedback(null), 2500);
    } finally {
      setLoadingHire(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Consultant Details" width="max-w-xl">
        <div className="grid grid-cols-12 gap-4">
          {/* Left column: gated features */}
          <aside className="col-span-12 sm:col-span-4 space-y-4">
            {/* Premium block */}
            <div
              className="p-3 rounded-md border border-dashed border-blue-200 bg-blue-50
                         hover:shadow-lg hover:bg-blue-100/30 hover:border-blue-300
                         transition-all duration-200 ease-in-out cursor-default"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Premium
                </h4>
              </div>

              <div className="mt-3 text-sm text-gray-700 space-y-2">
                <p className="text-xs text-gray-600">Performance metrics and AI analytics</p>

                {isPremiumUser ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-800 font-medium">Success Rate</div>
                    <div className="text-lg text-blue-600 font-semibold">{successRate ?? "—"}%</div>

                    <div className="text-sm text-gray-800 font-medium">AI Match</div>
                    <div className="text-lg text-blue-600 font-semibold">{aiMatchScore ?? "—"}%</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">Unlock predictive scoring, trend charts, and risk alerts.</p>
                    <Link href="/pricing" className="block w-full text-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm">
                      Upgrade to Premium
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Enterprise block */}
            <div
              className="p-3 rounded-md border border-dashed border-gray-200 bg-gray-50
                         hover:shadow-lg hover:bg-white hover:border-gray-300
                         transition-all duration-200 ease-in-out cursor-default"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 text-sm">Enterprise</h4>
              </div>

              <div className="mt-3 text-sm text-gray-700 space-y-2">
                <p className="text-xs text-gray-600">Case studies, testimonials, and detailed availability.</p>

                {isEnterpriseUser ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-800 font-medium">Testimonials</div>
                    <div className="text-sm text-gray-700">{testimonials?.length ?? 0} available</div>

                    <div className="text-sm text-gray-800 font-medium mt-2">Case Studies</div>
                    <div className="text-sm text-gray-700">{caseStudies?.length ?? 0} available</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">Unlock client stories and full availability for enterprise customers.</p>
                    <Link href="/contact-sales" className="block w-full text-center px-3 py-2 border border-gray-300 rounded-md text-sm">
                      Contact Sales
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick facts */}
            <div
              className="p-3 rounded-md border border-gray-100 bg-white text-sm
                         hover:shadow-md hover:bg-white/95 hover:border-gray-200
                         transition-all duration-200 ease-in-out cursor-default"
            >
              <div className="text-xs text-gray-500">Quick facts</div>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-700"><span className="font-medium">Location:</span> {location}</p>
                <p className="text-sm text-gray-700"><span className="font-medium">Engagement:</span> {preferredEngagementModel}</p>
                <p className="text-sm text-gray-700"><span className="font-medium">Insurance:</span> {insuranceCoverage}</p>
              </div>
            </div>
          </aside>

          {/* Right column: main profile */}
          <main className="col-span-12 sm:col-span-8 space-y-4">
            <header className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 shadow-sm flex-shrink-0">
                {image ? <Image src={image} alt={name} fill className="object-cover rounded-full" /> : <div className="flex items-center justify-center h-full text-2xl">👤</div>}
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                  {verifiedStatus ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 text-gray-600">
                      <Shield className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-600">{role} · {industry}</p>
                    <div className="flex items-center gap-2 mt-2" aria-label={`Rating: ${rating} out of 5`}>
                      <div className="flex">{renderStars(rating)}</div>
                      <span className="text-sm text-gray-500">· {rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Rate</p>
                    <p className="text-blue-600 font-semibold text-lg">${rate}/hr</p>
                  </div>
                </div>
              </div>
            </header>

            {/* Profile details component (skills, bonus skills, links, profile summary) */}
            <ConsultantProfileDetails
              consultant={data}
              isEnterpriseUser={isEnterpriseUser}
            />

            {/* Projects (always visible) */}
            {projects?.length ? (
              <section className="pb-2 border-b border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Projects</h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {projects.map((p: Project) => (
                    <li key={p.id}>
                      <span className="font-medium">{p.title}</span>
                      {p.category ? <span className="text-xs text-gray-500 ml-2">· {p.category}</span> : null}
                      {p.status ? <span className="text-xs text-gray-500 ml-2">({p.status})</span> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* Availability summary + enterprise detail handled inside profile details */}

            {/* Hire workflow */}
            <section className="pt-3">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Hire for Project</h4>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
                aria-label="Select project to hire for"
              >
                <option value="">-- Choose a Project --</option>
                {userProjects.length ? (
                  userProjects.map((p: Project) => (
                    <option key={p.id} value={p.id}>
                      {p.title} {p.category ? `· ${p.category}` : ""} {p.status ? `(${p.status})` : ""}
                    </option>
                  ))
                ) : (
                  <option value="__none">No projects found</option>
                )}
              </select>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-md text-sm">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleHire}
                  disabled={!selectedProjectId || selectedProjectId === "__none" || loadingHire}
                  className={`px-5 py-2 rounded-md text-sm font-semibold shadow-sm transition ${loadingHire ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                  {loadingHire ? "Processing..." : "Confirm Hire"}
                </button>
              </div>
            </section>
          </main>
        </div>
      </Modal>

      {feedback && <Feedback message={feedback.message} type={feedback.type} />}
    </>
  );
}
