"use client";

import { useState, useRef, useCallback } from "react";
import { FaCloudUploadAlt, FaCheckCircle, FaTimesCircle, FaSpinner, FaFile } from "react-icons/fa";

interface Props {
  milestoneId: string;
  projectId: string;
  milestoneTitle: string;
  milestoneDescription: string;
  onSubmitted?: (result: any) => void;
}

interface UploadedFile {
  name: string;
  url: string;
  size: number;
}

interface SubmitResult {
  aiCertified: boolean;
  aiCertificationScore?: number;
  aiCertificationSummary?: string;
  unmet_requirements?: string[];
  message?: string;
}

export default function DeliverableSubmitForm({
  milestoneId,
  projectId,
  milestoneTitle,
  milestoneDescription,
  onSubmitted,
}: Props) {
  const [notes, setNotes] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  const handleFiles = useCallback(async (files: FileList) => {
    const validFiles = Array.from(files).filter((f) => ALLOWED_TYPES.includes(f.type));
    if (validFiles.length === 0) {
      setUploadError("Only PDF, DOC, DOCX, and image files are accepted.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      validFiles.forEach((f) => formData.append("files[]", f));

      const res = await fetch("/api/escrow/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed. Please try again.");
      }

      const data = await res.json();
      const newFiles: UploadedFile[] = (data.urls || data.files || []).map(
        (item: any, i: number) => ({
          name: validFiles[i]?.name || item.name || `File ${i + 1}`,
          url: typeof item === "string" ? item : item.url,
          size: validFiles[i]?.size || 0,
        })
      );

      setUploadedFiles((prev) => [...prev, ...newFiles]);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (notes.trim().length < 50) {
      setFormError("Delivery notes must be at least 50 characters.");
      return;
    }

    if (uploadedFiles.length === 0) {
      setFormError("Please upload at least one deliverable file.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `/api/projects/${projectId}/milestones/${milestoneId}/submit`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deliverableUrls: uploadedFiles.map((f) => f.url),
            deliverableNotes: notes.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Submission failed.");
      }

      setSubmitResult(data);
      onSubmitted?.(data);
    } catch (err: any) {
      setFormError(err.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Result screen ──────────────────────────────────────────────────────────
  if (submitResult) {
    return (
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          {submitResult.aiCertified ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <FaCheckCircle className="text-emerald-400 text-xl" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">AI Certified ✓</h3>
                <p className="text-emerald-400 text-sm">Your deliverables passed verification.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <FaTimesCircle className="text-red-400 text-xl" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Issues Found</h3>
                <p className="text-red-400 text-sm">Your submission needs revisions.</p>
              </div>
            </div>
          )}
        </div>

        {submitResult.aiCertified && submitResult.aiCertificationScore !== undefined && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">AI Confidence Score</span>
              <span className="text-emerald-400 font-bold">{submitResult.aiCertificationScore}/100</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-emerald-400 h-2 rounded-full transition-all duration-700"
                style={{ width: `${submitResult.aiCertificationScore}%` }}
              />
            </div>
            {submitResult.aiCertificationSummary && (
              <p className="text-gray-300 text-sm mt-2">{submitResult.aiCertificationSummary}</p>
            )}
          </div>
        )}

        {!submitResult.aiCertified && submitResult.unmet_requirements && submitResult.unmet_requirements.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-2">
            <p className="text-red-400 text-sm font-semibold">Requirements not met:</p>
            <ul className="space-y-1">
              {submitResult.unmet_requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!submitResult.aiCertified && (
          <button
            onClick={() => {
              setSubmitResult(null);
              setFormError(null);
            }}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ backgroundColor: "#C12129" }}
          >
            Revise & Resubmit
          </button>
        )}
      </div>
    );
  }

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (isSubmitting) {
    return (
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 min-h-[220px]">
        <FaSpinner className="text-[#C12129] text-3xl animate-spin" />
        <p className="text-white font-semibold text-lg">AI is reviewing your deliverables...</p>
        <p className="text-gray-500 text-sm text-center max-w-xs">
          Our AI agent is checking your submission against milestone requirements. This usually takes under 30 seconds.
        </p>
      </div>
    );
  }

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-white font-bold text-xl">Submit Deliverables</h2>
        <p className="text-gray-400 text-sm mt-1">{milestoneTitle}</p>
        {milestoneDescription && (
          <p className="text-gray-500 text-xs mt-1">{milestoneDescription}</p>
        )}
      </div>

      {/* Delivery Notes */}
      <div className="space-y-2">
        <label className="text-gray-300 text-sm font-medium">
          Delivery Notes <span className="text-[#C12129]">*</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe what you delivered — what was built, key decisions made, how to review it, any known limitations..."
          rows={5}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 text-sm resize-none focus:outline-none focus:border-[#C12129] transition-colors"
        />
        <div className="flex justify-between">
          <span className="text-xs text-gray-600">Minimum 50 characters</span>
          <span className={`text-xs ${notes.length >= 50 ? "text-emerald-400" : "text-gray-600"}`}>
            {notes.length} chars
          </span>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-3">
        <label className="text-gray-300 text-sm font-medium">Deliverable Files</label>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
            isDragging
              ? "border-[#C12129] bg-[#C12129]/5"
              : "border-gray-700 hover:border-gray-600 bg-gray-900/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          {isUploading ? (
            <>
              <FaSpinner className="text-[#C12129] text-2xl animate-spin" />
              <p className="text-gray-400 text-sm">Uploading files...</p>
            </>
          ) : (
            <>
              <FaCloudUploadAlt
                className={`text-3xl ${isDragging ? "text-[#C12129]" : "text-gray-600"}`}
              />
              <div className="text-center">
                <p className="text-gray-300 text-sm font-medium">
                  Drop files here or <span className="text-[#C12129]">browse</span>
                </p>
                <p className="text-gray-600 text-xs mt-1">PDF, DOC, DOCX, PNG, JPG, GIF, WEBP</p>
              </div>
            </>
          )}
        </div>

        {uploadError && (
          <p className="text-red-400 text-sm flex items-center gap-2">
            <FaTimesCircle className="flex-shrink-0" /> {uploadError}
          </p>
        )}

        {/* Uploaded file pills */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FaFile className="text-emerald-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{file.name}</p>
                    {file.size > 0 && (
                      <p className="text-gray-500 text-xs">{formatFileSize(file.size)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <FaCheckCircle className="text-emerald-400" />
                  <button
                    onClick={() => removeFile(i)}
                    className="text-gray-600 hover:text-red-400 transition-colors text-xs"
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {formError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
          <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-400 text-sm">{formError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isUploading || isSubmitting}
        className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ backgroundColor: "#C12129" }}
      >
        Submit &amp; Request AI Verification
      </button>
    </div>
  );
}
