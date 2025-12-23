"use client";

import React, { useState } from "react";
import Head from "next/head";

interface TrainingFormProps {
  closeModal?: () => void;
  user?: unknown; // Replace with your User type if available
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  department: string;
  trainingTrack: string;
  preferredDate: string;
  attendanceMode: string;
  dietaryNeeds: string;
  accessibility: string;
  paymentAgreement: string;
  consentToRecord: string;
  comments: string;
}

const TrainingForm: React.FC<TrainingFormProps> = ({ closeModal, user }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    department: "",
    trainingTrack: "",
    preferredDate: "",
    attendanceMode: "",
    dietaryNeeds: "",
    accessibility: "",
    paymentAgreement: "",
    consentToRecord: "",
    comments: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const validate = (): Partial<FormData> => {
    const newErrors: Partial<FormData> = {};
    const requiredFields: (keyof FormData)[] = [
      "fullName",
      "email",
      "company",
      "trainingTrack",
      "preferredDate",
      "attendanceMode",
      "paymentAgreement",
      "consentToRecord",
    ];

    requiredFields.forEach((key) => {
      if (!formData[key]?.trim()) {
        newErrors[key] = "This field is required";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Replace URL with your API endpoint that saves to DB
      const res = await fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setShowSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        jobTitle: "",
        department: "",
        trainingTrack: "",
        preferredDate: "",
        attendanceMode: "",
        dietaryNeeds: "",
        accessibility: "",
        paymentAgreement: "",
        consentToRecord: "",
        comments: "",
      });

      setErrors({});
      if (closeModal) closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalFields = Object.keys(formData).length;
  const filledFields = Object.values(formData).filter(
    (v) => v.trim() !== ""
  ).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  return (
    <>
      <Head>
        <title>HCD Training Registration</title>
      </Head>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-white max-w-2xl mx-auto p-6 bg-black bg-opacity-80 rounded-xl backdrop-blur-md"
      >
        <h2 className="text-3xl font-bold text-orange-500 mb-6">
          HCD Training Registration
        </h2>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="w-full bg-white/20 rounded-full h-4">
            <div
              className="bg-orange-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-white text-right mt-1">
            {progress}% completed
          </p>
        </div>

        {/* Input fields */}
        {[
          ["fullName", "Full Name"],
          ["email", "Email Address"],
          ["phone", "Phone Number"],
          ["company", "Company Name"],
          ["jobTitle", "Job Title"],
          ["department", "Department"],
        ].map(([name, placeholder]) => (
          <div key={name}>
            <input
              type="text"
              name={name}
              value={formData[name as keyof FormData]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            />
            {errors[name as keyof FormData] && (
              <p className="text-red-400 text-sm">
                {errors[name as keyof FormData]}
              </p>
            )}
          </div>
        ))}

        {/* Select Training Track */}
        <select
          aria-label="trainingtrack"
          name="trainingTrack"
          value={formData.trainingTrack}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
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

        {/* Date */}
        <input
          aria-label="preferreddate"
          type="date"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        />
        {errors.preferredDate && (
          <p className="text-red-400 text-sm">{errors.preferredDate}</p>
        )}

        {/* Attendance Mode */}
        <select
          aria-label="attendancemode"
          name="attendanceMode"
          value={formData.attendanceMode}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        >
          <option value="">Mode of Attendance</option>
          <option value="Online">Online</option>
          <option value="In-Person">In-Person</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        {errors.attendanceMode && (
          <p className="text-red-400 text-sm">{errors.attendanceMode}</p>
        )}

        {/* Optional fields */}
        <input
          type="text"
          name="dietaryNeeds"
          value={formData.dietaryNeeds}
          onChange={handleChange}
          placeholder="Dietary Restrictions (if any)"
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        />
        <input
          type="text"
          name="accessibility"
          value={formData.accessibility}
          onChange={handleChange}
          placeholder="Accessibility Needs (if any)"
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        />

        {/* Payment Agreement */}
        <select
          aria-label="paymentagreement"
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
          aria-label="consenttorecord"
          name="consentToRecord"
          value={formData.consentToRecord}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        >
          <option value="">Consent to Record</option>
          <option value="Yes, I consent to being recorded">
            Yes, I consent to being recorded
          </option>
          <option value="No, I do not consent">No, I do not consent</option>
        </select>
        {errors.consentToRecord && (
          <p className="text-red-400 text-sm">{errors.consentToRecord}</p>
        )}

        <textarea
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          placeholder="Additional Comments (optional)"
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        />

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

        {showSuccess && (
          <p className="text-green-400 text-center mt-4">
            ✅ Your registration was submitted successfully!
          </p>
        )}
      </form>
    </>
  );
};

export default TrainingForm;
