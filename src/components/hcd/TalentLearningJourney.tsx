"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const STEPS = [
  {
    num: "01",
    label: "Assess",
    icon: "◈",
    iconCls: "text-orange-400",
    borderCls: "border-orange-500/30",
    body: "Your AI-powered skills assessment takes 12 minutes and creates a personalized learning profile for you and your team.",
    cta: "Start Your Assessment",
    href: "/hcd/recruitment",
  },
  {
    num: "02",
    label: "Learn",
    icon: "⬡",
    iconCls: "text-violet-400",
    borderCls: "border-violet-500/30",
    body: "Your learning path is built around your goals, your gaps, and your timeline. AI-personalized. Expert-designed. Adjust it anytime.",
    cta: "Explore Programs",
    href: "/hcd/recruitment",
  },
  {
    num: "03",
    label: "Certify",
    icon: "⚡",
    iconCls: "text-emerald-400",
    borderCls: "border-emerald-500/30",
    body: "Earn globally recognized LAMID ONE certifications. Download your credential, share on LinkedIn, and unlock your updated capability profile.",
    cta: "View Certifications",
    href: "/hcd/recruitment",
  },
];

const DIFFERENTIATORS = [
  { icon: "◈", iconCls: "text-orange-400", title: "AI-Personalized", body: "Every learning path is built around individual goals, gaps, and pace." },
  { icon: "✦", iconCls: "text-violet-400", title: "AI Coach Included", body: "A dedicated AI coach checks in at every milestone — warm, intelligent, and specific to your progress." },
  { icon: "⬡", iconCls: "text-blue-400", title: "Expert-Designed Curriculum", body: "Programs built by practitioners with decades of real-world consulting and leadership experience." },
  { icon: "▣", iconCls: "text-emerald-400", title: "Built for Teams", body: "Enroll entire cohorts. Each team member receives a personalized path based on their own assessment." },
];

const PROGRAMS = [
  "Leadership & Management",
  "Soft Skills & Communication",
  "Marketing & Brand",
  "Entrepreneurship & Sales",
  "Digital Transformation",
  "Strategy & Innovation",
];

const IMPACT = [
  { value: "3×", label: "Faster capability development vs. traditional training" },
  { value: "60%", label: "Higher knowledge retention with AI-supported learning" },
  { value: "92%", label: "Of participants apply skills within 30 days" },
];

export default function TalentLearningJourney() {
  return (
    <>
      {/* Talent Imperative */}
      <section className="bg-black text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-orange-500 text-[10px] tracking-[0.35em] uppercase font-bold mb-3">
              The Talent Imperative
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-5">
              The Most Valuable Investment{" "}
              <span className="text-orange-400">Is Your People.</span>
            </h2>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-4">
              In a rapidly changing world, the organizations that win are the ones that build capability faster than the competition. Talent development is no longer a training budget line — it is a strategic imperative.
            </p>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">
              LAMID TALENT delivers AI-personalized learning, expert coaching, and globally recognized certifications — designed for professionals who move fast and organizations that think ahead.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3-Step Journey */}
      <section className="bg-black text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-orange-500 text-[10px] tracking-[0.35em] uppercase font-bold mb-3">
              Your Learning Journey
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Three Steps to Capability.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.42 }}
                className={`bg-white/[0.025] border rounded-2xl p-7 flex flex-col ${step.borderCls}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] font-bold text-white/25">{step.num}</span>
                  <span className={`text-2xl ${step.iconCls}`}>{step.icon}</span>
                  <span className={`text-lg font-bold ${step.iconCls}`}>{step.label}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed flex-1 mb-5">{step.body}</p>
                <Link
                  href={step.href}
                  className={`text-xs font-semibold hover:opacity-80 transition-opacity ${step.iconCls}`}
                >
                  {step.cta} →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Differentiators */}
      <section className="bg-black text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p className="text-orange-500 text-[10px] tracking-[0.35em] uppercase font-bold mb-3">
              What Makes It Different
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Intelligence Built Into Every Step.
            </h2>
            <div className="mt-5 h-px bg-gradient-to-r from-orange-500/40 via-white/10 to-transparent" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DIFFERENTIATORS.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.38 }}
                className="flex items-start gap-4 bg-white/[0.025] border border-white/8 rounded-xl px-6 py-5"
              >
                <span className={`text-2xl shrink-0 mt-0.5 ${d.iconCls}`}>{d.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{d.title}</h3>
                  <p className="text-white/55 text-xs leading-relaxed">{d.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Categories */}
      <section className="bg-black text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-orange-500 text-[10px] tracking-[0.35em] uppercase font-bold mb-6">
            Program Categories
          </p>
          <div className="flex flex-wrap gap-3 mb-5">
            {PROGRAMS.map((p) => (
              <Link
                key={p}
                href="/hcd/recruitment"
                className="px-4 py-2 rounded-full border border-orange-500/30 text-orange-400 text-xs font-medium hover:bg-orange-500/10 transition-colors"
              >
                {p}
              </Link>
            ))}
            <Link
              href="/contact"
              className="px-4 py-2 rounded-full border border-white/15 text-white/50 text-xs font-medium hover:border-orange-500/40 hover:text-orange-400 transition-colors"
            >
              Enterprise Custom Program →
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-black text-white py-10 px-4 border-y border-white/8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {IMPACT.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span className="text-4xl font-bold text-orange-400 block mb-2">{stat.value}</span>
                <span className="text-white/50 text-xs leading-snug">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Cohort Banner */}
      <section className="bg-black text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-white/[0.03] border border-orange-500/25 rounded-2xl px-8 py-7"
          >
            <div>
              <h3 className="text-base font-bold text-white mb-1">Enrolling a team?</h3>
              <p className="text-white/55 text-sm max-w-lg">
                Each member receives a personalized learning path based on their individual assessment. Enterprise cohort pricing available.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 px-6 py-3 rounded-full text-sm font-bold bg-orange-500 text-black hover:bg-orange-400 transition-colors"
            >
              Talk to an Expert →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-black text-white py-10 px-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-white/40 text-sm italic"
        >
          The capability your organization needs is 12 minutes away.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mt-4"
        >
          <Link
            href="/hcd/recruitment"
            className="px-7 py-3 rounded-full text-sm font-bold bg-orange-500 text-black hover:bg-orange-400 transition-colors"
          >
            Start Your Assessment →
          </Link>
        </motion.div>
      </section>
    </>
  );
}
