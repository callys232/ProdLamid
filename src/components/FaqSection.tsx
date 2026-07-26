// components/FAQSection.tsx
"use client";

import React, { useState } from "react";

const faqs = [
  {
    question: "Why do we need Hybrid Consulting if we already do hybrid work?",
    answer:
      "Even a hybrid strategy that seems effective can carry hidden risks. Hybrid Consulting surfaces those risks, measures long-term benefits, and future-proofs your approach — with readiness assessments and tailored strategies that strengthen your model.",
  },
  {
    question: "What is your track record in hybrid work?",
    answer:
      "Our consultants combine decades of experience in management consulting and hybrid work solutions. While Hybrid Consulting may be new as a brand, our team has guided organizations worldwide in adapting to evolving workplace dynamics.",
  },
  {
    question: "What are the main benefits of hybrid work?",
    answer:
      "Hybrid work improves flexibility, productivity, and talent diversity. It allows employees to balance remote and in-office work, fostering innovation while reducing overhead costs. However, it requires clear policies and strong communication to succeed.",
  },
  {
    question: "What challenges should we expect with hybrid work?",
    answer:
      "Common challenges include technology access, cultural integration, and maintaining inclusivity. Hybrid Consulting helps organizations address these hurdles by designing policies, training programs, and communication frameworks tailored to your context.",
  },
  {
    question: "Is hybrid work suitable for every organization?",
    answer:
      "Not always. Hybrid models must be adapted to industry, workforce, and culture. We assess readiness and design strategies that align with your business goals, ensuring hybrid work adds measurable value rather than disruption.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white rounded-xl shadow-lg p-10 mb-12">
      <h2 className="text-3xl font-bold text-[#2563EB] mb-8">
        Hybrid Consulting – Frequently Asked Questions
      </h2>
      <ul className="space-y-6">
        {faqs.map((faq, idx) => (
          <li key={idx} className="border-b border-gray-200 pb-6">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left flex justify-between items-center gap-4"
            >
              <span className="text-base font-semibold text-black">{faq.question}</span>
              <span className="text-[#2563EB]">
                {openIndex === idx ? "-" : "+"}
              </span>
            </button>
            {openIndex === idx && (
              <p className="mt-4 text-[15px] text-gray-700 leading-relaxed">{faq.answer}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
