"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { User } from "@/types/user";

export interface TrainingFormProps {
  closeModal: () => void;
  user: User | null;
}

interface TrainingFormData {
  fullName: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle: string;
  department: string;
  trainingTrack: string;
  preferredDate: string;
  modeOfAttendance: string;
  dietaryRestrictions?: string;
  accessibilityNeeds?: string;
  paymentAgreement: string;
  consent: string;
  comments?: string;
}

const initialData: TrainingFormData = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  jobTitle: "",
  department: "",
  trainingTrack: "",
  preferredDate: "",
  modeOfAttendance: "",
  dietaryRestrictions: "",
  accessibilityNeeds: "",
  paymentAgreement: "",
  consent: "",
  comments: "",
};

export default function TrainingForm({ closeModal, user }: TrainingFormProps) {
  const [formData, setFormData] = useState<TrainingFormData>(initialData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TrainingFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof TrainingFormData, string>> = {};
    const requiredFields: (keyof TrainingFormData)[] = [
      "fullName",
      "email",
      "company",
      "trainingTrack",
      "preferredDate",
      "modeOfAttendance",
      "paymentAgreement",
      "consent",
    ];

    requiredFields.forEach((key) => {
      if (!formData[key]?.trim()) newErrors[key] = "This field is required";
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^\+?\d{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0)
      return setErrors(validationErrors);

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/training/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setShowSuccess(true);
      setFormData(initialData);
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 text-white max-w-2xl mx-auto p-6 bg-black bg-opacity-80 rounded-xl backdrop-blur-md"
    >
      <h2 className="text-3xl font-bold text-orange-500 mb-6">
        HCD Training Registration
      </h2>

      {user && (
        <p className="text-sm text-gray-300 mb-4">
          Logged in as: <strong>{user.name}</strong> ({user.email})
        </p>
      )}

      {Object.entries({
        fullName: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        company: "Company Name",
        jobTitle: "Job Title",
        department: "Department",
      }).map(([key, placeholder]) => (
        <div key={key}>
          <input
            type="text"
            name={key}
            value={formData[key as keyof TrainingFormData]}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
          />
          {errors[key as keyof TrainingFormData] && (
            <p className="text-red-400 text-sm">
              {errors[key as keyof TrainingFormData]}
            </p>
          )}
        </div>
      ))}

      {/* Training Track */}
      <select
        aria-label="trainintrack"
        name="trainingTrack"
        value={formData.trainingTrack}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange-500 transition-all duration-200"
      >
        <option value="">Select Training Track</option>
        <option value="Leadership Development">Leadership Development</option>
        <option value="Project Management">Project Management</option>
        <option value="Sales Enablement">Sales Enablement</option>
        <option value="Digital Transformation">Digital Transformation</option>
      </select>
      {errors.trainingTrack && (
        <p className="text-red-400 text-sm">{errors.trainingTrack}</p>
      )}

      {/* Preferred Date */}
      <input
        aria-label="preffereddate"
        type="date"
        name="preferredDate"
        value={formData.preferredDate}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
      />
      {errors.preferredDate && (
        <p className="text-red-400 text-sm">{errors.preferredDate}</p>
      )}

      {/* Mode of Attendance */}
      <select
        aria-label="modeofattending"
        name="modeOfAttendance"
        value={formData.modeOfAttendance}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
      >
        <option value="">Mode of Attendance</option>
        <option value="Online">Online</option>
        <option value="In-Person">In-Person</option>
        <option value="Hybrid">Hybrid</option>
      </select>
      {errors.modeOfAttendance && (
        <p className="text-red-400 text-sm">{errors.modeOfAttendance}</p>
      )}

      {/* Payment Agreement */}
      <select
        aria-label="paymetntype"
        name="paymentAgreement"
        value={formData.paymentAgreement}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
      >
        <option value="">Payment Agreement</option>
        <option value="I agree to pay the training fee">
          I agree to pay the training fee
        </option>
        <option value="My organization will cover the fee">
          My organization will cover the fee
        </option>
      </select>
      {errors.paymentAgreement && (
        <p className="text-red-400 text-sm">{errors.paymentAgreement}</p>
      )}

      {/* Consent */}
      <select
        aria-label="consent"
        name="consent"
        value={formData.consent}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
      >
        <option value="">Consent to Record</option>
        <option value="Yes">Yes, I consent</option>
        <option value="No">No, I do not consent</option>
      </select>
      {errors.consent && (
        <p className="text-red-400 text-sm">{errors.consent}</p>
      )}

      {/* Comments */}
      <textarea
        name="comments"
        value={formData.comments || ""}
        onChange={handleChange}
        placeholder="Additional Comments (optional)"
        rows={4}
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 mt-4 rounded-lg font-bold text-lg transition-all duration-300 ${
          isSubmitting
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit Registration"}
      </button>

      {/* Success Message */}
      {showSuccess && (
        <p className="text-green-400 text-center mt-4">
          ✅ Your registration was submitted successfully!
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
  );
}
