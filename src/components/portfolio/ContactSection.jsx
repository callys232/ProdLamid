"use client";

import { useState } from "react";
import Image from "next/image";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setSubmitStatus({ success: true, message: result.message });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(result.message || "Something went wrong.");
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error.message || "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  return (
    <section className="bg-black text-white w-full flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold inline-block border border-blue-600 rounded-xl px-6 py-3 mb-12 animate-glitch">
          CONTACT US
        </h2>

        <div className="relative">
          <div className="hidden sm:block absolute left-0 bottom-0 w-1/2 h-full z-0">
            <div className="relative w-full h-full group">
              <Image
                src="/contact-illustration.png"
                alt="Contact illustration"
                width={400}
                height={300}
                className="glow-circle object-contain object-left-bottom transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
            </div>
          </div>

          <div className="relative z-10 sm:ml-auto sm:w-3/5 bg-black">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="NAME:"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-300 text-gray-800 placeholder-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 hover:ring hover:ring-blue-400 hover:ring-offset-2 transition duration-300"
              />

              <input
                type="email"
                name="email"
                placeholder="EMAIL:"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-300 text-gray-800 placeholder-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 hover:ring hover:ring-blue-400 hover:ring-offset-2 transition duration-300"
              />

              <textarea
                name="message"
                placeholder="MESSAGE:"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 bg-gray-300 text-gray-800 placeholder-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 hover:ring hover:ring-blue-400 hover:ring-offset-2 transition duration-300 resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 px-12 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? "SENDING..." : "SEND"}
              </button>

              {submitStatus && (
                <div
                  className={`mt-4 p-3 rounded-xl ${
                    submitStatus.success ? "bg-green-700" : "bg-blue-700"
                  } text-white`}
                >
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
