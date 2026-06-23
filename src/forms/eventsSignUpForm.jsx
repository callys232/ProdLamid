import { useState } from "react";
import Head from "next/head";

export default function EventSignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    event: "",
    date: "",
    mode: "",
    // dietary: "",
    accessibility: "",
    consent: false,
    comments: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add backend integration here
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Sign Up for Talent Development Events | Leadership & Innovation</title>
        <meta
          name="description"
          content="Register for Talent Development Worldwide's upcoming leadership, innovation, and transformation events. Secure your spot today."
        />
        <meta
          name="keywords"
          content="Talent Development events, leadership workshops, innovation sessions, professional development, register for event"
        />
        <meta name="author" content="Talent Development Worldwide" />
        <meta
          property="og:title"
          content="Sign Up for Talent Development Events | Leadership & Innovation"
        />
        <meta
          property="og:description"
          content="Join Talent Development's global events and connect with visionary professionals."
        />
        <meta property="og:url" content="https://hcdworldwide.com/events" />
        <meta
          property="og:image"
          content="https://hcdworldwide.com/images/event-banner.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://hcdworldwide.com/events" />
      </Head>

      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
        <h1 className="text-2xl font-bold mb-4 text-center">
          🎟️ Event Sign-Up Form
        </h1>
        {submitted ? (
          <div className="text-green-600 text-center font-semibold">
            Thank you for signing up! We'll be in touch soon.
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
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <select
              name="event"
              required
              value={formData.event}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Event Track</option>
              <option value="Leadership">Leadership</option>
              <option value="Innovation">Innovation</option>
              <option value="Transformation">Transformation</option>
            </select>

            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <select
              name="mode"
              required
              value={formData.mode}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Mode of Attendance</option>
              <option value="Online">Online</option>
              {/* <option value="In-person">In-person</option>
              <option value="Hybrid">Hybrid</option> */}
            </select>

            {/* <input
              type="text"
              name="dietary"
              placeholder="Dietary Restrictions (optional)"
              value={formData.dietary}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            /> */}
            <input
              type="text"
              name="accessibility"
              placeholder="Accessibility Needs (optional)"
              value={formData.accessibility}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
              />
              <span>I agree to receive updates about future events</span>
            </label>

            <textarea
              name="comments"
              placeholder="Any comments or expectations?"
              value={formData.comments}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={4}
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
}
