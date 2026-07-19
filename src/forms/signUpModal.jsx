"use client";

import React, { useState, useEffect } from "react";

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSfRcq3sQk_7EZfiSHelTdJxm5VfvT1De7VnedGor9rpybkmZg/formResponse";

const SignupModal = ({ isOpen, onClose, event }) => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    "entry.479301265": "",
    "entry.155639182": "",
    "entry.2092238618": "",
    "entry.1753222212": "",
    "entry.588393791": "",
    "entry.2109138769": "",
  });

  const successAudio =
    typeof window !== "undefined" ? new Audio("/success.mp3") : null;

  useEffect(() => {
    if (showSuccessPopup) {
      successAudio
        ?.play()
        .catch((err) => console.warn("Audio playback failed:", err));

      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData["entry.479301265"].trim())
      newErrors["entry.479301265"] = "Name is required";
    if (!formData["entry.155639182"].trim()) {
      newErrors["entry.155639182"] = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData["entry.155639182"])) {
      newErrors["entry.155639182"] = "Email is invalid";
    }
    if (!formData["entry.1753222212"])
      newErrors["entry.1753222212"] = "Please select a day";
    if (!formData["entry.588393791"])
      newErrors["entry.588393791"] = "Please select a dietary option";
    if (!formData["entry.2109138769"])
      newErrors["entry.2109138769"] = "Please confirm payment agreement";
    return newErrors;
  };

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

  const resetForm = () => {
    setFormData({
      "entry.479301265": "",
      "entry.155639182": "",
      "entry.2092238618": "",
      "entry.1753222212": "",
      "entry.588393791": "",
      "entry.2109138769": "",
    });
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

      setShowSuccessPopup(true);
      resetForm(); // ✅ Clear form after successful submission
    } catch (err) {
      console.error("Google Form submission failed:", err);
      setErrors((prev) => ({
        ...prev,
        submit: "Something went wrong submitting the form. Please try again.",
      }));
    }

    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md animate-fadeIn px-4"
        onClick={onClose}
      >
        <div
          className="relative bg-white/10 text-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-white/20 backdrop-blur-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-blue-500 text-xl"
            aria-label="Close signup modal"
          >
            &times;
          </button>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-center">
              Sign Up for {event?.title}
            </h2>

            {[
              {
                name: "entry.479301265",
                placeholder: "Name",
              },
              {
                name: "entry.155639182",
                placeholder: "Email",
                type: "email",
              },
              {
                name: "entry.2092238618",
                placeholder: "Organization",
              },
            ].map(({ name, placeholder, type = "text" }) => (
              <div key={name}>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-4 py-2 rounded border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors[name] && (
                  <p className="text-blue-400 text-sm">{errors[name]}</p>
                )}
              </div>
            ))}

            <select
              name="entry.1753222212"
              value={formData["entry.1753222212"]}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-white/30 bg-white/10 text-white focus:outline-none"
            >
              <option value="">Select days</option>
              <option value="Day 1">Day 1</option>
              <option value="Day 2">Day 2</option>
              <option value="Day 3">Day 3</option>
            </select>
            {errors["entry.1753222212"] && (
              <p className="text-blue-400 text-sm">
                {errors["entry.1753222212"]}
              </p>
            )}

            <select
              name="entry.588393791"
              value={formData["entry.588393791"]}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-white/30 bg-white/10 text-white focus:outline-none"
            >
              <option value="">Dietary restrictions</option>
              <option value="None">None</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten-free">Gluten-free</option>
              <option value="Other">Other</option>
            </select>
            {errors["entry.588393791"] && (
              <p className="text-blue-400 text-sm">
                {errors["entry.588393791"]}
              </p>
            )}

            <select
              name="entry.2109138769"
              value={formData["entry.2109138769"]}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-white/30 bg-white/10 text-white focus:outline-none"
            >
              <option value="">Do you agree to payment?</option>
              <option value="Yes">Yes</option>
            </select>
            {errors["entry.2109138769"] && (
              <p className="text-blue-400 text-sm">
                {errors["entry.2109138769"]}
              </p>
            )}

            {errors.submit && (
              <p className="text-blue-400 text-sm text-center">
                {errors.submit}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded font-semibold transition ${
                isSubmitting
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Register"}
            </button>
          </form>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="fixed bottom-4 right-4 bg-white/10 text-white px-4 py-2 rounded shadow-lg border border-white/20 backdrop-blur-md animate-fadeIn">
          🎉 Your seat has been reserved!
        </div>
      )}
    </>
  );
};

export default SignupModal;
