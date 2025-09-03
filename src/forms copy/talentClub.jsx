"use client";

import React, { useState } from "react";
import Head from "next/head";

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse"; // Replace with your actual form URL

const TalentClubForm = () => {
  const [formData, setFormData] = useState({
    "entry.111111111": "", // Full Name
    "entry.222222222": "", // Email
    "entry.333333333": "", // Phone
    "entry.444444444": "", // Country of Residence
    "entry.555555555": "", // LinkedIn Profile
    "entry.666666666": "", // Current Role
    "entry.777777777": "", // Years of Experience
    "entry.888888888": "", // Industry
    "entry.999999999": "", // Mode of Work
    "entry.101010101": "", // Dietary Restrictions
    "entry.121212121": "", // Accessibility Needs
    "entry.141414141": "", // Consent to Record
    "entry.151515151": "", // Additional Comments
    "entry.191919191": "", // Why Interested in Talent Club
  });

  const [cvFile, setCvFile] = useState(null);
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
      "entry.444444444", // Country
      "entry.555555555", // LinkedIn
      "entry.666666666", // Role
      "entry.777777777", // Experience
      "entry.888888888", // Industry
      "entry.999999999", // Mode
      "entry.141414141", // Consent
      "entry.191919191", // Motivation
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

    if (cvFile) {
      data.append("cv", cvFile);
    }

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
      setCvFile(null);
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
        <title>Join the Global Talent Club | HCD Worldwide</title>
        <meta
          name="description"
          content="Apply to join HCD Worldwide's elite Talent Club — a global network of professionals driving innovation and leadership."
        />
        <meta
          name="keywords"
          content="global talent network, join innovation club, professional leadership community, HCD Worldwide talent club"
        />
        <meta name="author" content="HCD Worldwide" />
        <meta
          property="og:title"
          content="Join the Global Talent Club | HCD Worldwide"
        />
        <meta
          property="og:description"
          content="Become part of HCD's exclusive Talent Club and connect with visionary leaders shaping the future."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://hcdworldwide.com/join-talent-club"
        />
        <meta
          property="og:image"
          content="https://hcdworldwide.com/images/talent-club-banner.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Join the Global Talent Club | HCD Worldwide"
        />
        <meta
          name="twitter:description"
          content="Apply now to HCD's Talent Club and take the next step in your professional journey."
        />
        <meta
          name="twitter:image"
          content="https://hcdworldwide.com/images/talent-club-banner.jpg"
        />
        <link
          rel="canonical"
          href="https://hcdworldwide.com/join-talent-club"
        />
      </Head>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-white max-w-2xl mx-auto p-6 bg-black bg-opacity-80 rounded-xl backdrop-blur-md"
      >
        <h2 className="text-3xl font-bold text-orange-500 mb-6">
          Join the HCD Talent Club
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
          "entry.444444444": "Country of Residence",
          "entry.555555555": "LinkedIn Profile",
          "entry.666666666": "Current Role",
          "entry.777777777": "Years of Experience",
          "entry.888888888": "Industry",
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
          name="entry.999999999"
          value={formData["entry.999999999"]}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        >
          <option value="">Mode of Work</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Onsite">Onsite</option>
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
          name="entry.141414141"
          value={formData["entry.141414141"]}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-orange focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        >
          <option value="">Consent to Record</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        {errors["entry.141414141"] && (
          <p className="text-red-400 text-sm">{errors["entry.141414141"]}</p>
        )}

        <textarea
          name="entry.151515151"
          value={formData["entry.151515151"]}
          onChange={handleChange}
          placeholder="Additional Comments or Questions"
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        />

        <textarea
          name="entry.191919191"
          value={formData["entry.191919191"]}
          onChange={handleChange}
          placeholder="Why are you interested in joining the Talent Club?"
          rows={5}
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        />
        {errors["entry.191919191"] && (
          <p className="text-red-400 text-sm">{errors["entry.191919191"]}</p>
        )}

        <div>
          <label className="block text-white mb-2">
            Upload CV (PDF or DOC)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCvFile(e.target.files[0])}
            className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white file:text-white file:bg-orange-500 file:border-none file:px-4 file:py-2 file:rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all duration-300"
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

export default TalentClubForm;
