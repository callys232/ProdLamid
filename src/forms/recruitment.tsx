"use client";

import React, { useState } from "react";
import Head from "next/head";
import { User } from "@/types/user";
import FormInput from "./formInput";
import FormSelect from "./formSelect";
import FormTextarea from "./formTextarea";
import FormFileUpload from "./formFileupload";
import ProgressBar from "./progressBar";

export interface RecruitmentFormProps {
  closeModal?: () => void;
  user?: User | null;
}

export interface RecruitmentFormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  department: string;
  recruitmentTrack: string;
  preferredDate: string;
  modeOfWork: string;
  dietaryRestrictions: string;
  accessibilityNeeds: string;
  consent: string;
  comments: string;
  linkedIn: string;
  yearsOfExperience: string;
  certifications: string;
  whyInterested: string;
}

const initialFormState: RecruitmentFormData = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  jobTitle: "",
  department: "",
  recruitmentTrack: "",
  preferredDate: "",
  modeOfWork: "",
  dietaryRestrictions: "",
  accessibilityNeeds: "",
  consent: "",
  comments: "",
  linkedIn: "",
  yearsOfExperience: "",
  certifications: "",
  whyInterested: "",
};

const RecruitmentForm: React.FC<RecruitmentFormProps> = ({
  closeModal,
  user = null,
}) => {
  const [formData, setFormData] = useState<RecruitmentFormData>(() => ({
    ...initialFormState,
    fullName: user?.name ?? "",
    email: user?.email ?? "",
  }));

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RecruitmentFormData, string>>
  >({});

  // Type-safe universal change handler — handles text/select/textarea and file (via FormFileUpload)
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, type, value } = e.target;

    if (type === "file") {
      // If you ever use a native file input, handle it here (we use FormFileUpload which passes File directly)
      const file = (e.target as HTMLInputElement).files?.[0] ?? null;
      // name must be a key of the form state if you want to store file there; we store separately in cvFile
      setCvFile(file);
      setErrors((prev) => ({
        ...prev,
        [name as keyof RecruitmentFormData]: "",
      }));
      return;
    }

    // default text/select/textarea handling
    setFormData((prev) => ({
      ...prev,
      [name as keyof RecruitmentFormData]: value,
    }));
    setErrors((prev) => ({ ...prev, [name as keyof RecruitmentFormData]: "" }));
  };

  // File input handler used by FormFileUpload (receives File | null)
  const handleFileChange = (file: File | null): void => {
    setCvFile(file);
  };

  const validate = (): Partial<Record<keyof RecruitmentFormData, string>> => {
    const required: Array<keyof RecruitmentFormData> = [
      "fullName",
      "email",
      "company",
      "recruitmentTrack",
      "preferredDate",
      "modeOfWork",
      "consent",
      "whyInterested",
    ];

    const newErrors: Partial<Record<keyof RecruitmentFormData, string>> = {};

    required.forEach((k) => {
      if (!formData[k] || formData[k].toString().trim() === "") {
        newErrors[k] = "This field is required";
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^\+?\d{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    return newErrors;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();

      // Append all string fields explicitly (type-safety)
      const fields: (keyof RecruitmentFormData)[] = [
        "fullName",
        "email",
        "phone",
        "company",
        "jobTitle",
        "department",
        "recruitmentTrack",
        "preferredDate",
        "modeOfWork",
        "dietaryRestrictions",
        "accessibilityNeeds",
        "consent",
        "comments",
        "linkedIn",
        "yearsOfExperience",
        "certifications",
        "whyInterested",
      ];

      fields.forEach((field) => {
        payload.append(field, formData[field] ?? "");
      });

      // Append file if present
      if (cvFile) {
        payload.append("cv", cvFile, cvFile.name);
      }

      // Optionally include user metadata
      if (user) {
        if (user.id) payload.append("userId", user.id);
        if (user.email) payload.append("userEmail", user.email);
      }

      // POST to your NextAPI route that will use Prisma to save to Postgres
      const res = await fetch("/api/recruitment", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        // try to parse message but keep typed
        const text = await res.text();
        throw new Error(`Server error: ${res.status} ${text}`);
      }

      setShowSuccess(true);
      setFormData(initialFormState);
      setCvFile(null);

      // close modal if provided
      if (closeModal) closeModal();
    } catch (error) {
      // keep error typed as unknown then log
      if (error instanceof Error) {
        console.error("Submission failed:", error.message);
      } else {
        console.error("Submission failed:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalFields = Object.keys(formData).length;
  const filledFields = Object.values(formData).filter(
    (v) => v.toString().trim() !== ""
  ).length;
  const progress = Math.round((filledFields / Math.max(totalFields, 1)) * 100);

  return (
    <>
      <Head>
        <title>HCD Recruitment Registration</title>
      </Head>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-white max-w-2xl mx-auto p-6 bg-black bg-opacity-80 rounded-xl backdrop-blur-md"
        aria-label="HCD Recruitment Registration Form"
      >
        <h2 className="text-3xl font-bold text-orange-500 mb-6">
          HCD Recruitment Registration
        </h2>

        <ProgressBar progress={progress} />

        {/* Text inputs */}
        <FormInput
          name="fullName"
          label="Full Name"
          value={formData.fullName}
          placeholder="Full name"
          onChange={handleChange}
          error={errors.fullName}
        />

        <FormInput
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          placeholder="you@example.com"
          onChange={handleChange}
          error={errors.email}
        />

        <FormInput
          name="phone"
          label="Phone Number"
          value={formData.phone}
          placeholder="+234..."
          onChange={handleChange}
          error={errors.phone}
        />

        <FormInput
          name="company"
          label="Company Name"
          value={formData.company}
          placeholder="Company"
          onChange={handleChange}
          error={errors.company}
        />

        <FormInput
          name="jobTitle"
          label="Job Title"
          value={formData.jobTitle}
          placeholder="Job title"
          onChange={handleChange}
        />

        <FormInput
          name="department"
          label="Department"
          value={formData.department}
          placeholder="Department"
          onChange={handleChange}
        />

        <FormInput
          name="linkedIn"
          label="LinkedIn Profile"
          value={formData.linkedIn}
          placeholder="https://linkedin.com/in/..."
          onChange={handleChange}
        />

        <FormInput
          name="yearsOfExperience"
          label="Years of Experience"
          value={formData.yearsOfExperience}
          placeholder="e.g. 5"
          onChange={handleChange}
        />

        <FormInput
          name="certifications"
          label="Certifications"
          value={formData.certifications}
          placeholder="List relevant certifications"
          onChange={handleChange}
        />

        {/* Select: Recruitment Track */}
        <FormSelect
          label="Recruitment Track"
          name="recruitmentTrack"
          value={formData.recruitmentTrack}
          onChange={handleChange}
          options={[
            {
              label: "Leadership Development",
              value: "Leadership Development",
            },
            { label: "Project Management", value: "Project Management" },
            { label: "Sales Enablement", value: "Sales Enablement" },
            {
              label: "Digital Transformation",
              value: "Digital Transformation",
            },
          ]}
          error={errors.recruitmentTrack}
        />

        {/* Preferred Date */}
        <FormInput
          name="preferredDate"
          label="Preferred Date"
          type="date"
          value={formData.preferredDate}
          onChange={handleChange}
          error={errors.preferredDate}
        />

        {/* Mode of Work */}
        <FormSelect
          label="Mode of Work"
          name="modeOfWork"
          value={formData.modeOfWork}
          onChange={handleChange}
          options={[
            { label: "Remote", value: "Remote" },
            { label: "Hybrid", value: "Hybrid" },
            { label: "Onsite", value: "Onsite" },
          ]}
          error={errors.modeOfWork}
        />

        <FormInput
          name="dietaryRestrictions"
          label="Dietary Restrictions"
          value={formData.dietaryRestrictions}
          placeholder="Any dietary restrictions"
          onChange={handleChange}
        />

        <FormInput
          name="accessibilityNeeds"
          label="Accessibility Needs"
          value={formData.accessibilityNeeds}
          placeholder="Any accessibility requirements"
          onChange={handleChange}
        />

        <FormSelect
          label="Consent to Record"
          name="consent"
          value={formData.consent}
          onChange={handleChange}
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          error={errors.consent}
        />

        <FormTextarea
          name="comments"
          label="Additional Comments"
          placeholder="Any additional comments or questions"
          value={formData.comments}
          onChange={handleChange}
          rows={3}
        />

        <FormTextarea
          name="whyInterested"
          label="Why are you interested in this track?"
          placeholder="Tell us why you're interested"
          value={formData.whyInterested}
          onChange={handleChange}
          rows={5}
          error={errors.whyInterested}
        />

        <FormFileUpload
          label="Upload CV (PDF or DOC)"
          name="cv"
          onChange={handleFileChange}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all duration-300"
          aria-label="Submit recruitment application"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>

        {showSuccess && (
          <p className="text-green-400 text-center mt-4">
            ✅ Thank you! Your application has been submitted successfully.
          </p>
        )}
      </form>
    </>
  );
};

export default RecruitmentForm;
