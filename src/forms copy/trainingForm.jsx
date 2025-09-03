"use client";

import React, { useState } from "react";
import Head from "next/head";

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse"; // Replace with your actual form URL

const TrainingForm = () => {
  const [formData, setFormData] = useState({
    "entry.111111111": "", // Full Name
    "entry.222222222": "", // Email
    "entry.333333333": "", // Phone
    "entry.444444444": "", // Company Name
    "entry.555555555": "", // Job Title
    "entry.666666666": "", // Department
    "entry.777777777": "", // Training Track
    "entry.888888888": "", // Preferred Date
    "entry.999999999": "", // Mode of Attendance
    "entry.101010101": "", // Dietary Restrictions
    "entry.121212121": "", // Accessibility Needs
    "entry.131313131": "", // Payment Agreement
    "entry.141414141": "", // Consent to Record
    // "entry.151515151": "", // Comments
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validate = () => {
    const requiredFields = [
      "entry.111111111", // Name
      "entry.222222222", // Email
      "entry.444444444", // Company
      "entry.777777777", // Track
      "entry.888888888", // Date
      "entry.999999999", // Mode
      "entry.131313131", // Payment
      "entry.141414141", // Consent
    ];
    const newErrors = {};

    requiredFields.forEach((key) => {
      if (!formData[key]?.trim()) {
        newErrors[key] = "This field is required";
      }
    });

    const email = formData["entry.222222222"];
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors["entry.222222222"] = "Invalid email format";
    }

    const phone = formData["entry.333333333"];
    if (phone && !/^\+?\d{7,15}$/.test(phone)) {
      newErrors["entry.333333333"] = "Invalid phone number";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        body: data,
      });
      setShowSuccess(true);
      setFormData(
        Object.fromEntries(Object.keys(formData).map((k) => [k, ""]))
      );
    } catch (err) {
      console.error("Submission failed:", err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
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
        <meta
          name="description"
          content="Register for HCD's leadership, project management, and digital transformation training tracks."
        />
        <meta
          name="keywords"
          content="HCD training, leadership development, project management, digital transformation, registration"
        />
        <meta name="author" content="HCD Nigeria" />
        <meta property="og:title" content="HCD Training Registration" />
        <meta
          property="og:description"
          content="Join our expert-led training sessions and boost your career."
        />
        <meta property="og:type" content="website" />
      </Head>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-white max-w-2xl mx-auto p-6 bg-black bg-opacity-80 rounded-xl backdrop-blur-md"
      >
        <h2 className="text-3xl font-bold text-orange-500 mb-6">
          HCD Training Registration
        </h2>

        <div className="mb-4">
          <div className="w-full bg-white/20 rounded-full h-4">
            <div
              className="bg-orange-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-white text-right mt-1">
            {progress}% completed
          </p>
        </div>

        {Object.entries({
          "entry.111111111": "Full Name",
          "entry.222222222": "Email Address",
          "entry.333333333": "Phone Number",
          "entry.444444444": "Company Name",
          "entry.555555555": "Job Title",
          "entry.666666666": "Department",
        }).map(([name, placeholder]) => (
          <div key={name}>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            />
            {errors[name] && (
              <p className="text-red-400 text-sm">{errors[name]}</p>
            )}
          </div>
        ))}

        <select
          name="entry.777777777"
          value={formData["entry.777777777"]}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange-500 transition-all duration-200"
        >
          <option value="">Select Training Track</option>
          <option value="Leadership Development">Leadership Development</option>
          <option value="Project Management">Project Management</option>
          <option value="Sales Enablement">Sales Enablement</option>
          <option value="Digital Transformation">Digital Transformation</option>
        </select>
        {errors["entry.777777777"] && (
          <p className="text-red-400 text-sm">{errors["entry.777777777"]}</p>
        )}

        <input
          type="date"
          name="entry.888888888"
          value={formData["entry.888888888"]}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        />
        {errors["entry.888888888"] && (
          <p className="text-red-400 text-sm">{errors["entry.888888888"]}</p>
        )}

        <select
          name="entry.999999999"
          value={formData["entry.999999999"]}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        >
          <option value="">Mode of Attendance</option>
          <option value="Online">Online</option>
          <option value="In-Person">In-Person</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        {errors["entry.999999999"] && (
          <p className="text-red-400 text-sm">{errors["entry.999999999"]}</p>
        )}

        <input
          type="text"
          name="entry.101010101"
          value={formData["entry.101010101"]}
          onChange={handleChange}
          placeholder="Dietary Restrictions (if any)"
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        />

        <input
          type="text"
          name="entry.121212121"
          value={formData["entry.121212121"]}
          onChange={handleChange}
          placeholder="Accessibility Needs (if any)"
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        />

        <select
          name="entry.131313131"
          value={formData["entry.131313131"]}
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
        {errors["entry.131313131"] && (
          <p className="text-red-400 text-sm">{errors["entry.131313131"]}</p>
        )}

        <select
          name="entry.141414141"
          value={formData["entry.141414141"]}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        >
          <option value="">Consent to Record</option>
          <option value="Yes, I consent to being recorded">
            Yes, I consent to being recorded
          </option>
          <option value="No, I do not consent">No, I do not consent</option>
        </select>
        {errors["entry.141414141"] && (
          <p className="text-red-400 text-sm">{errors["entry.141414141"]}</p>
        )}

        {/* Optional Comments Field */}
        <textarea
          name="entry.151515151"
          value={formData["entry.151515151"] || ""}
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
