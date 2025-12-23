"use client";

import { useState } from "react";

interface EventSignupFormProps {
  eventId: number;
  eventTitle: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function EventSignupForm({
  eventId,
  eventTitle,
  onSuccess,
  onCancel,
}: EventSignupFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    event: eventTitle,
    date: "",
    mode: "",
    dietary: "",
    accessibility: "",
    consent: false,
    comments: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: send to backend

    setSubmitted(true);

    setTimeout(() => {
      onSuccess();
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-md border border-orange-500">
      <h1 className="text-xl font-bold mb-4 text-center text-orange-600">
        Sign Up for {eventTitle}
      </h1>

      {submitted ? (
        <div className="text-green-600 text-center font-semibold">
          Thank you for signing up! Well be in touch soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-orange-500 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-orange-500 rounded"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-orange-500 rounded"
          />

          <input
            aria-label="date"
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border border-orange-500 rounded"
          />

          <select
            aria-label="mode"
            name="mode"
            required
            value={formData.mode}
            onChange={handleChange}
            className="w-full p-3 border border-orange-500 rounded bg-white"
          >
            <option value="">Mode of Attendance</option>
            <option value="Online">Online</option>
            <option value="In-person">In-person</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <input
            type="text"
            name="dietary"
            placeholder="Dietary Restrictions (optional)"
            value={formData.dietary}
            onChange={handleChange}
            className="w-full p-3 border border-orange-500 rounded"
          />

          <input
            type="text"
            name="accessibility"
            placeholder="Accessibility Needs (optional)"
            value={formData.accessibility}
            onChange={handleChange}
            className="w-full p-3 border border-orange-500 rounded"
          />

          <label className="flex items-center space-x-2 text-gray-700">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="accent-orange-600"
            />
            <span>I agree to receive updates about future events</span>
          </label>

          <textarea
            name="comments"
            placeholder="Any comments or expectations?"
            value={formData.comments}
            onChange={handleChange}
            className="w-full p-3 border border-orange-500 rounded"
            rows={4}
          />

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded font-semibold hover:bg-orange-700 transition"
          >
            Submit
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full mt-2 border border-orange-500 text-orange-600 py-3 rounded font-semibold hover:bg-orange-50 transition"
            >
              Cancel
            </button>
          )}
        </form>
      )}
    </div>
  );
}
