"use client";

import React, { useState } from "react";
import FAQSection from "./FaqSection";

export default function ContactPage() {
  const [chatExpanded, setChatExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-black py-12 px-6 relative">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* FAQ Section */}
        <FAQSection />

        {/* Chatbot trigger */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#c12129] mb-6">
            Need More Help?
          </h2>
          <button
            onClick={() => setChatExpanded(!chatExpanded)}
            className="bg-[#c12129] text-white py-3 px-6 rounded hover:bg-black transition"
          >
            {chatExpanded ? "Hide Chat" : "Chat with Bot"}
          </button>
        </section>
      </div>
    </div>
  );
}
