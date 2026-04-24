"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle, FaShieldAlt, FaBolt, FaRobot,
  FaUsers, FaChartLine, FaHeadset, FaCode,
} from "react-icons/fa";

const features = [
  { icon: <FaRobot />, title: "AI-Powered Matching", desc: "Proprietary AI matches your project with the top 1% of 5,000+ vetted consultants in under 60 seconds." },
  { icon: <FaShieldAlt />, title: "Milestone Escrow", desc: "Every payment is held in escrow and released only when you approve the deliverable. Zero financial risk." },
  { icon: <FaUsers />, title: "Dedicated Account Team", desc: "A senior account director and two project coordinators assigned exclusively to your organisation." },
  { icon: <FaCode />, title: "White-Label Platform", desc: "Deploy a fully branded version of our platform for your internal teams or client-facing projects." },
  { icon: <FaChartLine />, title: "Real-Time Analytics", desc: "Executive dashboards tracking project velocity, spend, milestone completion, and consultant performance." },
  { icon: <FaBolt />, title: "Priority Deployment", desc: "48-hour consultant deployment SLA. Emergency staffing available within 6 hours for critical projects." },
  { icon: <FaHeadset />, title: "24/7 Priority Support", desc: "Dedicated Slack channel, phone line, and guaranteed 1-hour response time around the clock." },
  { icon: <FaCheckCircle />, title: "Compliance & Legal Cover", desc: "Full MSA, IP assignment, NDAs, and GDPR-compliant data handling included at no extra cost." },
];

const included = [
  "Up to 12 active projects simultaneously",
  "Unlimited consultant search & AI matching",
  "Escrow management for all project payments",
  "Custom contract & legal templates",
  "Executive reporting dashboard",
  "Dedicated Slack workspace with your team",
  "White-label portal for internal use",
  "Quarterly strategy review with senior leadership",
  "Access to all 20 specialist categories",
  "Priority placement in consultant bidding queue",
  "Paystack & Stripe payment integration",
  "99.9% uptime SLA with dedicated infrastructure",
];

const stats = [
  { value: "$420M+", label: "Managed through escrow" },
  { value: "5,000+", label: "Vetted consultants" },
  { value: "98%", label: "Client satisfaction rate" },
  { value: "48hr", label: "Avg. consultant deployment" },
];

export default function SaasPricingSection() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");

  const price = billingCycle === "annual" ? 200000 : 18500;
  const saving = billingCycle === "annual" ? "Save $22,000 vs. monthly" : null;

  return (
    <section className="bg-black py-24 px-4 text-white" id="enterprise">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <span className="inline-block mb-4 rounded-full border border-red-600/40 bg-red-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-400">
          Enterprise SaaS
        </span>
        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          The complete consulting
          <br />
          <span className="text-red-500">operating system</span> for your organisation.
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          One platform. Vetted talent. Secure payments. Full legal coverage.
          Everything your business needs to source, manage, and pay expert consultants — at enterprise scale.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-white/5 p-5 text-center"
            >
              <p className="text-2xl font-bold text-red-500">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Card */}
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-red-600/30 bg-gradient-to-br from-[#0d0d0d] to-[#1a0505] p-8 md:p-12 shadow-2xl shadow-red-900/20"
        >
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                billingCycle === "monthly"
                  ? "bg-red-600 text-white"
                  : "border border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                billingCycle === "annual"
                  ? "bg-red-600 text-white"
                  : "border border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              Annual
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Left — Price & CTA */}
            <div className="md:w-2/5 flex-shrink-0">
              <div className="mb-2 text-sm text-gray-500 uppercase tracking-widest">
                Starting from
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-6xl font-black text-white">
                  ${price.toLocaleString()}
                </span>
                <span className="text-gray-400 text-lg mb-2">
                  /{billingCycle === "annual" ? "yr" : "mo"}
                </span>
              </div>
              {saving && (
                <p className="text-green-500 text-sm font-semibold mb-6">{saving}</p>
              )}
              {!saving && <div className="mb-6" />}

              <a
                href="/contact"
                className="block w-full text-center rounded-xl bg-red-600 hover:bg-red-700 px-6 py-4 text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-95 mb-4"
              >
                Book a Discovery Call
              </a>
              <a
                href="/contact"
                className="block w-full text-center rounded-xl border border-white/10 hover:border-white/30 px-6 py-4 text-sm font-semibold text-gray-400 hover:text-white transition"
              >
                Request a Demo
              </a>

              <p className="text-center text-xs text-gray-600 mt-4">
                Custom pricing available for 50+ projects/year.
                All plans include a 30-day money-back guarantee.
              </p>
            </div>

            {/* Right — Included Features */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-5">
                Everything included
              </h3>
              <ul className="space-y-2.5">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <FaCheckCircle className="mt-0.5 flex-shrink-0 text-red-500" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-5xl mx-auto mt-20">
        <h3 className="text-center text-2xl font-bold mb-12">
          Built for enterprises that move fast
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-red-600/40 hover:bg-red-600/5 transition-all"
            >
              <div className="mb-3 text-red-500 text-xl">{f.icon}</div>
              <h4 className="font-semibold text-white text-sm mb-1.5">{f.title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-2xl mx-auto text-center mt-20">
        <p className="text-gray-400 text-sm mb-6">
          Trusted by PE-backed companies, Fortune 500 divisions, and high-growth startups across 24 countries.
        </p>
        <a
          href="/contact"
          className="inline-block rounded-full bg-red-600 hover:bg-red-700 px-10 py-4 text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
        >
          Talk to Enterprise Sales →
        </a>
      </div>
    </section>
  );
}
