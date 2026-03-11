"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Head from "next/head";

// Reusable components
import FormInput from "./formInput";
import FormSelect from "./formSelect";
import FormTextArea from "./formTextarea";
import FileUpload from "./formFileupload";
import ProgressBar from "./progressBar";

export interface User {
  name: string;
  email: string;
}

export interface TalentClubProps {
  closeModal: () => void;
  user?: unknown; // Accept unknown, will validate internally
}

export interface TalentClubFormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  linkedIn: string;
  currentRole: string;
  yearsExperience: string;
  industry: string;
  modeOfWork: "Remote" | "Hybrid" | "Onsite" | "";
  // dietaryRestrictions: string;
  accessibilityNeeds: string;
  consentToRecord: "Yes" | "No" | "";
  additionalComments: string;
  motivation: string;
  cvFile: File | null;
}

const initialFormData: TalentClubFormData = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  linkedIn: "",
  currentRole: "",
  yearsExperience: "",
  industry: "",
  modeOfWork: "",
  // dietaryRestrictions: "",
  accessibilityNeeds: "",
  consentToRecord: "",
  additionalComments: "",
  motivation: "",
  cvFile: null,
};

const TalentClubForm: React.FC<TalentClubProps> = ({ closeModal, user }) => {
  const [formData, setFormData] = useState<TalentClubFormData>(initialFormData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TalentClubFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validate if user is of type User
  const typedUser: User | null =
    user && typeof user === "object" && "name" in user && "email" in user
      ? (user as User)
      : null;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "file") {
      const file = target.files?.[0] ?? null;
      setFormData((prev) => ({ ...prev, cvFile: file }));
      setErrors((prev) => ({ ...prev, cvFile: "" }));
      return;
    }

    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof TalentClubFormData, string>> = {};
    const requiredFields: (keyof TalentClubFormData)[] = [
      "fullName",
      "email",
      "country",
      "linkedIn",
      "currentRole",
      "yearsExperience",
      "industry",
      "modeOfWork",
      "consentToRecord",
      "motivation",
    ];

    requiredFields.forEach((key) => {
      const value = formData[key] ?? "";
      if (!value.toString().trim()) {
        newErrors[key] = "This field is required";
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const body = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "cvFile" && value) {
        body.append("cvFile", value);
      } else if (typeof value === "string") {
        body.append(key, value);
      }
    });

    try {
      const res = await fetch("/api/talent-club", { method: "POST", body });
      if (res.ok) {
        setShowSuccess(true);
        setFormData(initialFormData);
      } else {
        const result = await res.json();
        console.error("Submission failed:", result);
      }
    } catch (err) {
      console.error("Submission failed:", err);
    }

    setIsSubmitting(false);
  };

  const totalFields = Object.keys(formData).filter(
    (f) => f !== "cvFile"
  ).length;
  const filledFields = Object.entries(formData).filter(([key, v]) =>
    key === "cvFile" ? v !== null : typeof v === "string" && v.trim() !== ""
  ).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  return (
    <>
      <Head>
        <title>Join the Talent Club | HCD Worldwide</title>
        <meta
          name="description"
          content="Apply to join HCD Worldwide's elite Talent Club"
        />
      </Head>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-white max-w-2xl mx-auto p-6 bg-black bg-opacity-80 rounded-xl backdrop-blur-md"
        aria-label="HCD Talent Club Registration Form"
      >
        <h2 className="text-3xl font-bold text-orange-500 mb-6">
          Join the HCD Talent Club
        </h2>

        {typedUser && (
          <p className="text-sm text-gray-300 mb-4">
            Logged in as: <strong>{typedUser.name}</strong> ({typedUser.email})
          </p>
        )}

        {/* Progress Bar */}
        <ProgressBar progress={progress} />

        {/* Inputs */}
        <FormInput
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />
        <FormInput
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormInput
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <FormInput
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          error={errors.country}
        />
        <FormInput
          label="LinkedIn Profile"
          name="linkedIn"
          value={formData.linkedIn}
          onChange={handleChange}
          error={errors.linkedIn}
        />
        <FormInput
          label="Current Role"
          name="currentRole"
          value={formData.currentRole}
          onChange={handleChange}
          error={errors.currentRole}
        />
        <FormInput
          label="Years of Experience"
          name="yearsExperience"
          value={formData.yearsExperience}
          onChange={handleChange}
          error={errors.yearsExperience}
        />
        <FormInput
          label="Industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          error={errors.industry}
        />

        {/* Selects */}
        <FormSelect
          label="Mode of Work"
          name="modeOfWork"
          value={formData.modeOfWork}
          options={[
            { label: "Remote", value: "Remote" },
            // { label: "Hybrid", value: "Hybrid" },
            // { label: "Onsite", value: "Onsite" },
          ]}
          onChange={handleChange}
          error={errors.modeOfWork}
        />
        <FormSelect
          label="Consent to Record"
          name="consentToRecord"
          value={formData.consentToRecord}
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          onChange={handleChange}
          error={errors.consentToRecord}
        />

        {/* Textareas */}
        {/* <FormTextArea
          label="Dietary Restrictions"
          name="dietaryRestrictions"
          value={formData.dietaryRestrictions}
          onChange={handleChange}
        /> */}
        <FormTextArea
          label="Accessibility Needs"
          name="accessibilityNeeds"
          value={formData.accessibilityNeeds}
          onChange={handleChange}
        />
        <FormTextArea
          label="Additional Comments"
          name="additionalComments"
          value={formData.additionalComments}
          onChange={handleChange}
        />
        <FormTextArea
          label="Motivation"
          name="motivation"
          value={formData.motivation}
          onChange={handleChange}
          error={errors.motivation}
          rows={5}
        />

        {/* File Upload */}
        <FileUpload
          label="Upload CV (PDF or DOC)"
          name="cvFile"
          onChange={(file) =>
            setFormData((prev) => ({ ...prev, cvFile: file }))
          }
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all duration-300"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>

        {/* Success Message */}
        {showSuccess && (
          <p className="text-green-400 text-center mt-4">
            ✅ Thank you! Your application has been submitted successfully.
          </p>
        )}

        {/* Close Button */}
        <button
          type="button"
          onClick={closeModal}
          className="w-full py-2 mt-4 rounded-lg font-semibold bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
        >
          Close
        </button>
      </form>
    </>
  );
};

export default TalentClubForm;
