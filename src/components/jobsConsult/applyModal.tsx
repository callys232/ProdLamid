"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Project } from "@/types/project";
import { Consultant, ClientProfile } from "@/types/client";
import BidSection from "./bidSection";

interface Bid {
  amount: number;
  date: string;
}

interface ApplyModalProps {
  job: Project;
  consultant?: Consultant; // logged-in user
  client?: ClientProfile;
  isRegisteredUser?: boolean;
  bids?: Bid[];
  onClose: () => void;
  onSubmit: (payload: {
    job: Project;
    consultant?: Consultant;
    coverLetter: string;
    description: string;
    comments: string;
    resumeFile?: File | null;
    bidAmount: number;
  }) => void;
  onBid: (job: Project, amount: number) => void;
}

export default function ApplyModal({
  job,
  consultant,
  client,
  isRegisteredUser,
  bids = [],
  onClose,
  onSubmit,
  onBid,
}: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [latestBid, setLatestBid] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const jobSkills = job.skills || [];
  const consultantSkills = consultant?.skills || [];

  /* ---------- Basic input sanitization ---------- */
  const sanitize = (str: string) =>
    str
      .replace(/<[^>]*>?/gm, "") // strip HTML
      .replace(/script/gi, "") // strip script keyword
      .replace(/['";]/g, "") // strip quotes
      .trim();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpeg",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowed.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          resume: "Unsupported file type. Upload PDF, DOC, DOCX, JPG, or PNG.",
        }));
        return;
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          resume: "File too large. Max size is 5MB.",
        }));
        return;
      }

      setErrors((prev) => {
        const clone = { ...prev };
        delete clone.resume;
        return clone;
      });
    }

    setResumeFile(file);
  };

  const hasEscrow =
    (job.escrow && job.escrow.length > 0) ||
    (client?.escrowTransactions && client.escrowTransactions.length > 0);

  const meetsSkill = (skill: string) =>
    consultantSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase());

  /* ---------- Validation ---------- */
  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const cl = sanitize(coverLetter);

    if (!cl || cl.length < 50) {
      nextErrors.coverLetter =
        "Cover letter must be at least 50 characters (after formatting).";
    }

    if (!resumeFile) {
      nextErrors.resume = "Resume / CV is required.";
    }

    if (latestBid === null) {
      nextErrors.bid = "You must place at least one bid before applying.";
    }

    if (description && sanitize(description).length > 2000) {
      nextErrors.description = "Description is too long (max 2000 characters).";
    }

    if (comments && sanitize(comments).length > 1000) {
      nextErrors.comments = "Comments are too long (max 1000 characters).";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePreview = () => {
    if (!validate()) return;
    setPreviewMode(true);
  };

  const handleSubmit = async () => {
    if (!validate() || latestBid === null) return;

    setSubmitting(true);
    try {
      onSubmit({
        job,
        consultant,
        coverLetter: sanitize(coverLetter),
        description: sanitize(description),
        comments: sanitize(comments),
        resumeFile,
        bidAmount: latestBid,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const jobAndOrg = `${job.title} ${
    job.organization ? `– ${job.organization}` : ""
  }`;

  /* ---------- Shared Header ---------- */
  const Header = (
    <div className="mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
        {previewMode ? "Review your application" : `Apply for ${job.title}`}
      </h2>
      <p className="text-sm text-gray-300">
        {job.organization} {job.location && `• ${job.location}`}
      </p>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-8 max-w-4xl w-full text-gray-100 relative max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl font-light"
          >
            ×
          </button>

          {Header}

          {/* Switch view: edit vs preview */}
          {!previewMode ? (
            /* ---------- EDIT MODE ---------- */
            <motion.div
              key="edit-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid md:grid-cols-[2fr,1.3fr] gap-6 md:gap-8">
                {/* Left column – main form */}
                <div className="space-y-5">
                  {/* Cover letter */}
                  <FieldSection
                    title="Cover letter"
                    required
                    error={errors.coverLetter}
                  >
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#c21219]"
                      placeholder="Explain why you're a great fit for this project..."
                    />
                  </FieldSection>

                  {/* Resume upload */}
                  <FieldSection title="Resume / CV" error={errors.resume}>
                    <label className="flex items-center justify-between px-3 py-2 bg-white/10 border border-dashed border-white/30 rounded-lg text-sm cursor-pointer hover:bg-white/15 transition">
                      <span className="text-gray-200">
                        {resumeFile
                          ? resumeFile.name
                          : "Upload PDF, DOCX, or image"}
                      </span>
                      <span className="px-3 py-1 rounded-md bg-white/10 text-xs">
                        Choose file
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      />
                    </label>
                  </FieldSection>

                  {/* Description */}
                  <FieldSection
                    title="Project understanding / approach"
                    error={errors.description}
                  >
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#c21219]"
                      placeholder="Share how you would approach this work, methodology, timeline, or key ideas..."
                    />
                  </FieldSection>

                  {/* Comments / additions */}
                  <FieldSection
                    title="Comments / additions"
                    error={errors.comments}
                  >
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#c21219]"
                      placeholder="Any constraints, assumptions, or additional notes you'd like the client to know?"
                    />
                  </FieldSection>

                  {/* Bid Section */}
                  <FieldSection title="Your bid" error={errors.bid}>
                    <BidSection
                      job={job}
                      isRegisteredUser={isRegisteredUser ? true : false}
                      onBid={onBid}
                      initialBids={bids}
                      onLatestBidChange={setLatestBid}
                    />
                  </FieldSection>
                </div>

                {/* Right column – meta info */}
                <div className="space-y-5">
                  {/* Prequalification / job requirements */}
                  <FieldSection title="Pre-qualification for this project">
                    {jobSkills.length === 0 ? (
                      <p className="text-sm text-gray-400">
                        This project does not specify explicit skill
                        requirements.
                      </p>
                    ) : (
                      <ul className="space-y-2 text-sm">
                        {jobSkills.map((skill) => {
                          const ok = meetsSkill(skill);
                          return (
                            <li
                              key={skill}
                              className="flex items-center justify-between"
                            >
                              <span className="text-gray-200">{skill}</span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  ok
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                    : "bg-red-500/10 text-red-300 border border-red-500/30"
                                }`}
                              >
                                {ok ? "Matched" : "Not in profile"}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </FieldSection>

                  {/* Expertise (from consultant profile) */}
                  <FieldSection title="Your expertise">
                    {consultantSkills.length === 0 ? (
                      <p className="text-sm text-gray-400">
                        Add your skills to your profile to strengthen your
                        applications.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {consultantSkills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-gray-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </FieldSection>

                  {/* About client */}
                  {client && (
                    <FieldSection title="About the client">
                      <div className="px-3 py-3 bg白/10 border border-white/20 rounded-lg text-sm space-y-1">
                        <p className="text-white font-semibold">
                          {client.name || client.companyname}
                        </p>
                        {client.industry && (
                          <p className="text-gray-300">
                            Industry: {client.industry}
                          </p>
                        )}
                        {client.location && (
                          <p className="text-gray-300">
                            Location: {client.location}
                          </p>
                        )}
                        <p className="text-gray-400 text-xs">
                          Projects posted: {client.projects?.length ?? 0} •
                          Consultants engaged: {client.consultants?.length ?? 0}
                        </p>
                        {client.isPremium && (
                          <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full bg-amber-500/20 text-amber-300 text-xs border border-amber-500/40">
                            Premium client
                          </span>
                        )}
                      </div>
                    </FieldSection>
                  )}

                  {/* Payment & escrow badge */}
                  <FieldSection title="Payment & security">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-emerald-300 font-semibold">
                          Payment secured
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-200">
                          Escrow protected
                        </span>
                        {hasEscrow && (
                          <span className="text-xs text-gray-300">
                            Escrow activity detected for this client or project.
                          </span>
                        )}
                      </div>
                    </div>
                  </FieldSection>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-white/25 text-sm text-gray-200 hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePreview}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/30 text-gray-100 transition"
                >
                  Preview application
                </button>
              </div>
            </motion.div>
          ) : (
            /* ---------- PREVIEW MODE ---------- */
            <motion.div
              key="preview-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-6 text-sm">
                {/* Summary header */}
                <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl">
                  <p className="text-gray-300 mb-1">
                    You’re about to submit an application for:
                  </p>
                  <p className="text-white font-semibold">{jobAndOrg}</p>
                  {latestBid !== null && (
                    <p className="text-emerald-300 text-xs mt-1">
                      Bid amount:{" "}
                      <span className="font-semibold">${latestBid}</span>
                    </p>
                  )}
                </div>

                {/* Cover letter */}
                <PreviewBlock title="Cover letter">
                  <p className="whitespace-pre-wrap text-gray-100">
                    {sanitize(coverLetter)}
                  </p>
                </PreviewBlock>

                {/* Resume */}
                <PreviewBlock title="Resume / CV">
                  <p className="text-gray-200">
                    {resumeFile ? resumeFile.name : "No file selected"}
                  </p>
                </PreviewBlock>

                {/* Description */}
                {description && (
                  <PreviewBlock title="Project understanding / approach">
                    <p className="whitespace-pre-wrap text-gray-200">
                      {sanitize(description)}
                    </p>
                  </PreviewBlock>
                )}

                {/* Comments */}
                {comments && (
                  <PreviewBlock title="Comments / additions">
                    <p className="whitespace-pre-wrap text-gray-200">
                      {sanitize(comments)}
                    </p>
                  </PreviewBlock>
                )}

                {/* Skills match */}
                <PreviewBlock title="Pre-qualification and expertise">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase text-gray-400 mb-2">
                        Project requirements
                      </p>
                      {jobSkills.length === 0 ? (
                        <p className="text-gray-400 text-sm">
                          No specific skills listed for this project.
                        </p>
                      ) : (
                        <ul className="space-y-1 text-sm">
                          {jobSkills.map((skill) => (
                            <li key={skill} className="flex items-center gap-2">
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                  meetsSkill(skill)
                                    ? "bg-emerald-400"
                                    : "bg-red-400"
                                }`}
                              />
                              <span className="text-gray-200">{skill}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-400 mb-2">
                        Your expertise
                      </p>
                      {consultantSkills.length === 0 ? (
                        <p className="text-gray-400 text-sm">
                          No skills found on your profile.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {consultantSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-gray-100"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </PreviewBlock>

                {/* Client + escrow */}
                {client && (
                  <PreviewBlock title="Client & payment security">
                    <div className="space-y-3">
                      <div className="px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-sm space-y-1">
                        <p className="text-white font-semibold">
                          {client.name || client.companyname}
                        </p>
                        {client.industry && (
                          <p className="text-gray-300">
                            Industry: {client.industry}
                          </p>
                        )}
                        {client.location && (
                          <p className="text-gray-300">
                            Location: {client.location}
                          </p>
                        )}
                        <p className="text-gray-400 text-xs">
                          Projects posted: {client.projects?.length ?? 0} •
                          Consultants engaged: {client.consultants?.length ?? 0}
                        </p>
                        {client.isPremium && (
                          <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full bg-amber-500/20 text-amber-300 text-xs border border-amber-500/40">
                            Premium client
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-emerald-300 font-semibold">
                            Payment secured
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-200">
                            Escrow protected
                          </span>
                          {hasEscrow && (
                            <span className="text-xs text-gray-300">
                              Escrow activity detected for this client or
                              project.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </PreviewBlock>
                )}
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-between gap-3">
                <button
                  onClick={() => setPreviewMode(false)}
                  className="px-4 py-2 rounded-lg border border-white/25 text-sm text-gray-200 hover:bg-white/10 transition"
                >
                  Back to edit
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-white/25 text-sm text-gray-200 hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition shadow-md ${
                      submitting
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-[#c21219] hover:bg-red-700 text-white"
                    }`}
                  >
                    {submitting ? "Submitting..." : "Submit application"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------- Shared small components ---------- */

function FieldSection({
  title,
  required,
  error,
  children,
}: {
  title: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {required && (
          <span className="text-xs text-red-400 font-medium">*</span>
        )}
      </div>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function PreviewBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <div className="px-3 py-3 bg-white/10 border border-white/20 rounded-lg">
        {children}
      </div>
    </div>
  );
}
