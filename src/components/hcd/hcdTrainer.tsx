"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TrainingForm from "@/forms/trainingForm";
import RecruitmentForm from "@/forms/RecruitmentForm";
import TalentClub from "@/forms/talentClub";
import LearningCTA from "@/components/learningCTA/LearningCTA";
import { useAuth } from "@/hooks/useAuth";

type FormType = "training" | "recruitment" | "talent" | null;

const RECRUIT_BADGES = [
  { label: "Instant Matching", color: "#f97316", delay: 0 },
  { label: "Verified Experts", color: "#10b981", delay: 0.07 },
  { label: "Predictive Fit Scoring", color: "#6366f1", delay: 0.14 },
  { label: "Top 1% Talent", color: "#f59e0b", delay: 0.21 },
  { label: "Hire Pipeline", color: "#c21219", delay: 0.28 },
  { label: "Vetted Consultants", color: "#3b82f6", delay: 0.35 },
  { label: "Capacity Building", color: "#8b5cf6", delay: 0.42 },
  { label: "Executive Headhunt", color: "#14b8a6", delay: 0.49 },
];

const HcdTrainer: React.FC<{ homepage?: boolean }> = ({ homepage = false }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormType>(null);
  const [activeBadge, setActiveBadge] = useState<number>(0);
  const [expandedP1, setExpandedP1] = useState<boolean>(false);
  const [expandedP3, setExpandedP3] = useState<boolean>(false);

  const { user } = useAuth();
  const router = useRouter();

  const handlePostJob = () => {
    if (!user) {
      router.push("/signup");
      return;
    }
    if (user.accountType === "Freelancer" || user.role === "seller") {
      router.push("/upgrade");
      return;
    }
    router.push("/postjobs");
  };

  /* Cycle active badge every 1.8 s */
  useEffect(() => {
    const id = setInterval(() => {
      setActiveBadge((prev) => (prev + 1) % RECRUIT_BADGES.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  /* ESC key closes modal */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPopup(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  /* Lock body scroll while modal is open */
  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPopup]);

  return (
    <>
      <Head>
        <meta
          name="description"
          content="Discover our transformative training programs and strategic recruitment services designed to equip teams with global best practices and top-tier talent."
        />
        <meta
          name="keywords"
          content="Training Programs, Executive Recruitment, Talent Development, Behavioral Transformation, Knowledge Transfer, Headhunting, Workforce Solutions"
        />
        <meta name="lamid" content="Lamid Consulting" />
        <meta
          property="og:title"
          content="Training & Recruitment | Empowering Talent for the Future"
        />
        <meta
          property="og:description"
          content="We deliver hands-on training and strategic recruitment to help organizations adapt, grow, and lead."
        />
        <meta property="og:image" content="/training-recruitment-banner.jpg" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://lamidconsulting/training-recruitment"
        />
        <link
          rel="canonical"
          href="https://lamidconsulting/training-recruitment"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative bg-black text-white">
        {/* ── Animated vector background ── */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full z-0"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Static diagonal lines */}
          <line
            x1="0"
            y1="0"
            x2="100%"
            y2="100%"
            stroke="#f97316"
            strokeWidth="0.8"
            opacity="0.1"
          />
          <line
            x1="100%"
            y1="0"
            x2="0"
            y2="100%"
            stroke="#ffffff"
            strokeWidth="0.6"
            opacity="0.05"
          />
          <line
            x1="30%"
            y1="0"
            x2="70%"
            y2="100%"
            stroke="#f97316"
            strokeWidth="0.7"
            opacity="0.08"
          />
          <line
            x1="0"
            y1="40%"
            x2="100%"
            y2="40%"
            stroke="#ffffff"
            strokeWidth="0.5"
            opacity="0.05"
          />
          <line
            x1="0"
            y1="70%"
            x2="100%"
            y2="70%"
            stroke="#f97316"
            strokeWidth="0.5"
            opacity="0.06"
          />
          <line
            x1="20%"
            y1="0"
            x2="20%"
            y2="100%"
            stroke="#f97316"
            strokeWidth="0.6"
            opacity="0.07"
          />
          <line
            x1="80%"
            y1="0"
            x2="80%"
            y2="100%"
            stroke="#ffffff"
            strokeWidth="0.5"
            opacity="0.05"
          />

          {/* Slowly rotating large ring */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50% 50%"
              to="360 50% 50%"
              dur="40s"
              repeatCount="indefinite"
            />
            <ellipse
              cx="50%"
              cy="50%"
              rx="38%"
              ry="22%"
              fill="none"
              stroke="#f97316"
              strokeWidth="0.8"
              opacity="0.1"
            />
          </g>

          {/* Second ring counter-rotating */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50% 50%"
              to="-360 50% 50%"
              dur="55s"
              repeatCount="indefinite"
            />
            <ellipse
              cx="50%"
              cy="50%"
              rx="48%"
              ry="28%"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.6"
              opacity="0.06"
            />
          </g>

          {/* Drifting dots */}
          <circle cx="15%" cy="25%" r="2.5" fill="#f97316" opacity="0.2">
            <animate
              attributeName="cy"
              values="25%;22%;25%"
              dur="6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.2;0.4;0.2"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="85%" cy="60%" r="3" fill="#f97316" opacity="0.18">
            <animate
              attributeName="cy"
              values="60%;57%;60%"
              dur="8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.18;0.35;0.18"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="50%" cy="85%" r="2" fill="#ffffff" opacity="0.1">
            <animate
              attributeName="cy"
              values="85%;82%;85%"
              dur="7s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="70%" cy="15%" r="2" fill="#f97316" opacity="0.15">
            <animate
              attributeName="cy"
              values="15%;12%;15%"
              dur="5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.15;0.3;0.15"
              dur="5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="25%" cy="75%" r="1.5" fill="#ffffff" opacity="0.1">
            <animate
              attributeName="cy"
              values="75%;72%;75%"
              dur="9s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Corner arc */}
          <path
            d="M 0 0 Q 120 0 120 120"
            fill="none"
            stroke="#f97316"
            strokeWidth="0.9"
            opacity="0.12"
          />

          {/* Static rings */}
          <circle
            cx="10%"
            cy="20%"
            r="60"
            fill="none"
            stroke="#f97316"
            strokeWidth="0.8"
            opacity="0.1"
          />
          <circle
            cx="90%"
            cy="80%"
            r="80"
            fill="none"
            stroke="#f97316"
            strokeWidth="0.7"
            opacity="0.09"
          />
        </svg>

        {/* Background rings — non-homepage only */}
        {!homepage && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[800px] h-[800px] border border-gray-800 rounded-full opacity-50" />
              <div className="absolute w-[600px] h-[600px] border border-gray-800 rounded-full opacity-30" />
              <div className="absolute w-[400px] h-[400px] border border-gray-800 rounded-full opacity-20" />
            </div>
          </div>
        )}

        <div className="relative z-10 container mx-auto px-6 py-6">
          <main className="max-w-6xl mx-auto">
            {/* ── Unified slide panel ── */}
            <div>
              {/* ================= TRAINING ================= */}
              <section className={homepage ? "p-4" : "mb-12"}>
                <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
                  {/* Illustration */}
                  <div className="w-full md:w-44 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/hcd-training-illustration.png"
                      alt="International new-age training session"
                      width={860}
                      height={460}
                      className="w-full h-auto"
                      priority
                    />
                  </div>

                  {/* Text & CTAs */}
                  <div className="flex-1 flex flex-col gap-4">
                    <h2 className="text-2xl font-extrabold text-orange-500">
                      Training
                    </h2>

                    <p className="text-sm text-gray-300 leading-relaxed">
                      We are leaders in providing far-reaching range of programs
                      suited to meet the challenges of todays rapid changes.
                    </p>

                    <p className="text-sm text-gray-400 leading-relaxed">
                      We match clients unique circumstances with customized
                      solutions that help them adapt to global best practices.
                      You achieve knowledge transfer and behavioral
                      transformation in ways that seamlessly integrate your team
                      back to the workplace, using hands-on methodologies.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setFormType("training");
                          setShowPopup(true);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold
                      bg-gradient-to-r from-orange-500 to-orange-700
                      hover:from-orange-600 hover:to-orange-800
                      transition focus:outline-none focus:ring-2 focus:ring-orange-400"
                      >
                        RESERVE A SLOT NOW!!
                      </button>

                      <a
                        href="https://learn-by-lamid.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold
                      border border-orange-500/60 text-orange-400
                      hover:bg-orange-500/10 hover:border-orange-400
                      transition focus:outline-none focus:ring-2 focus:ring-orange-400"
                      >
                        Post a Training
                      </a>
                    </div>
                  </div>
                </div>

                {/* Training tracks — full width below */}
                <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                  {[
                    {
                      label: "BUSINESS",
                      desc: "Corporate strategy, finance & operations",
                      bg: "bg-gray-700",
                      hover: "bg-gray-600",
                    },
                    {
                      label: "SOFT SKILLS",
                      desc: "Communication, teamwork & adaptability",
                      bg: "bg-orange-700",
                      hover: "bg-orange-600",
                    },
                    {
                      label: "CLIENTS",
                      desc: "Client-centred engagement & retention",
                      bg: "bg-blue-900",
                      hover: "bg-blue-800",
                    },
                    {
                      label: "PERFORMANCE",
                      desc: "Product innovation & development",
                      bg: "bg-blue-600",
                      hover: "bg-blue-500",
                    },
                    {
                      label: "MANAGEMENT",
                      desc: "Performance management & supervision",
                      bg: "bg-red-800",
                      hover: "bg-red-700",
                    },
                    {
                      label: "ENTREPRENEURSHIP",
                      desc: "Startup growth & venture building",
                      bg: "bg-purple-700",
                      hover: "bg-purple-600",
                    },
                    {
                      label: "LEADERSHIP",
                      desc: "Vision, influence & team direction",
                      bg: "bg-green-700",
                      hover: "bg-green-600",
                    },
                  ].map(({ label, desc, bg, hover }, index) => (
                    <motion.div
                      key={label}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <div
                        className={`${bg} px-4 py-1.5 text-xs font-semibold rounded-full cursor-default
                                  hover:shadow-lg hover:border hover:border-white/25 transition-all duration-300`}
                      >
                        {label}
                      </div>
                      {/* Tooltip */}
                      <div
                        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5
                                  text-xs text-white rounded-lg shadow-lg whitespace-nowrap z-20
                                  opacity-0 group-hover:opacity-100 pointer-events-none
                                  transition-opacity duration-300 ${hover}`}
                      >
                        {desc}
                        {/* Arrow */}
                        <span
                          className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${hover.replace("bg-", "border-t-")}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {homepage && <div className="border-t border-gray-800 mx-6" />}

              {/* ================= RECRUITMENT ================= */}
              <section className={homepage ? "p-6" : "mb-16"}>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {/* Left: all text content */}
                  <div className="w-full md:w-3/5 flex flex-col gap-4">
                    <h2 className="text-3xl font-bold text-orange-500">
                      Recruitment
                    </h2>

                    {/* P1 — two sentences; show first, dropdown reveals second */}
                    <div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        Leveraging cutting-edge tools, conduct executive
                        searches and headhunts to identify and secure top-tier
                        talent for permanent, temporary, and contract positions.
                        {expandedP1 && (
                          <span>
                            {" "}
                            Our approaches ensure organizations attract the
                            brightest and most dedicated professionals,
                            empowering them to succeed and thrive.
                          </span>
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => setExpandedP1((v) => !v)}
                        className="mt-1 flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition"
                      >
                        {expandedP1 ? "Show less" : "Read more"}
                        <span
                          className={`inline-block transition-transform duration-200 ${expandedP1 ? "rotate-180" : ""}`}
                        >
                          ▾
                        </span>
                      </button>
                    </div>

                    <p className="text-sm text-gray-300 leading-relaxed">
                      Explore open roles across leadership, strategy, sales and
                      more — or manage your full hiring pipeline from one place.
                    </p>

                    {/* P3 — one long sentence; show as collapsed, dropdown reveals full */}
                    <div>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        We support the effective pairing, management and
                        retention of cutting-edge expertise as a pool of
                        accessible peer mentors and leaders
                        {expandedP3 && (
                          <span>
                            , harnessing their intellectual capacity and
                            experience to transform everyday challenges into
                            opportunities that birth and launch organizations as
                            raving global successes
                          </span>
                        )}
                        .
                      </p>
                      <button
                        type="button"
                        onClick={() => setExpandedP3((v) => !v)}
                        className="mt-1 flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition"
                      >
                        {expandedP3 ? "Show less" : "Read more"}
                        <span
                          className={`inline-block transition-transform duration-200 ${expandedP3 ? "rotate-180" : ""}`}
                        >
                          ▾
                        </span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-1">
                      <Link
                        href="/hcd/recruitment"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold
                      bg-gradient-to-r from-orange-500 to-orange-700
                      hover:from-orange-600 hover:to-orange-800
                      transition focus:outline-none focus:ring-2 focus:ring-orange-400"
                      >
                        Find Your Next Great Expert →
                      </Link>

                      {!homepage && (
                        <>
                          <button
                            type="button"
                            onClick={handlePostJob}
                            className="px-4 py-2.5 text-sm bg-orange-600 rounded-full hover:bg-orange-700 transition font-semibold"
                          >
                            Post a Job
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setFormType("talent");
                              setShowPopup(true);
                            }}
                            className="px-6 py-2.5 text-sm rounded-full font-semibold
                          bg-gradient-to-r from-orange-500 to-orange-700
                          hover:from-orange-600 hover:to-orange-800 transition"
                          >
                            Get Notified About TALENTS CLUB
                          </button>

                          <Link
                            href="/hcd/recruitment"
                            className="px-5 py-2.5 text-sm rounded-full font-semibold
                          border border-orange-500/60 text-orange-400
                          hover:bg-orange-500/10 hover:border-orange-400 transition"
                          >
                            View Open Roles →
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: animated badges */}
                  <div className="w-full md:w-2/5 flex-shrink-0">
                    <div className="grid grid-cols-2 gap-2">
                      {RECRUIT_BADGES.map(({ label, color, delay }, idx) => {
                        const isActive = activeBadge === idx;
                        return (
                          <motion.div
                            key={label}
                            initial={{ opacity: 0, scale: 0.88, y: 10 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            animate={isActive ? { scale: 1.04 } : { scale: 1 }}
                            transition={{
                              delay,
                              duration: 0.5,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-2xl overflow-hidden cursor-default"
                            style={{
                              background: isActive
                                ? `linear-gradient(135deg, ${color}28 0%, ${color}0e 100%)`
                                : `linear-gradient(135deg, ${color}14 0%, #060606 85%)`,
                              border: isActive
                                ? `1px solid ${color}70`
                                : `1px solid ${color}2e`,
                              boxShadow: isActive
                                ? `0 0 12px 0 ${color}30`
                                : "none",
                            }}
                          >
                            {/* Shimmer sweep */}
                            <motion.div
                              className="absolute inset-0 w-[55%] pointer-events-none"
                              animate={{ x: ["-100%", "220%"] }}
                              transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                repeatDelay: 3.5 + delay * 2,
                                delay: delay + 1.2,
                                ease: "easeInOut",
                              }}
                              style={{
                                background: `linear-gradient(90deg, transparent 0%, ${color}22 50%, transparent 100%)`,
                              }}
                            />

                            {/* Sonar dot */}
                            <div className="relative flex-shrink-0 w-5 h-5 flex items-center justify-center">
                              <motion.div
                                className="absolute rounded-full"
                                animate={{
                                  scale: [1, 2.2, 1],
                                  opacity: [0.45, 0, 0.45],
                                }}
                                transition={{
                                  duration: 2.4 + delay * 0.35,
                                  repeat: Infinity,
                                  ease: "easeOut",
                                  delay,
                                }}
                                style={{
                                  width: 10,
                                  height: 10,
                                  backgroundColor: color,
                                }}
                              />
                              <div
                                className="relative w-2.5 h-2.5 rounded-full"
                                style={{
                                  backgroundColor: color,
                                  boxShadow: `0 0 6px 1px ${color}88`,
                                }}
                              />
                            </div>

                            {/* Label */}
                            <span className="flex-1 text-[11px] font-bold text-white/85 leading-tight tracking-wide">
                              {label}
                            </span>

                            {/* Check mark */}
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                              className="flex-shrink-0 opacity-55"
                            >
                              <path
                                d="M1.5 5L4 7.5L8.5 2.5"
                                stroke={color}
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            </div>
            {/* end unified panel */}

            {/* ================= LEARNING PLATFORM CTA ================= */}
            {!homepage && <LearningCTA className="mb-8" />}
          </main>
        </div>

        {/* ================= MODAL ================= */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center"
              style={{
                backgroundColor: "rgba(0,0,0,0.78)",
                backdropFilter: "blur(6px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              role="dialog"
              aria-modal="true"
              onClick={() => setShowPopup(false)}
            >
              <motion.div
                className="relative bg-[#0d0d0d] border border-gray-700/60
                           w-full sm:w-[92%] md:w-[65%] lg:w-[52%]
                           max-h-[92vh] sm:max-h-[85vh]
                           rounded-t-2xl sm:rounded-2xl
                           overflow-y-auto overscroll-contain"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drag handle (mobile visual cue) */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                  <div className="w-10 h-1 rounded-full bg-gray-600" />
                </div>

                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  aria-label="Close"
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10
                             flex items-center justify-center text-gray-400
                             hover:text-white hover:bg-white/20 transition-colors duration-200"
                >
                  ✕
                </button>

                {formType === "training" && (
                  <TrainingForm
                    closeModal={() => setShowPopup(false)}
                    user={user}
                  />
                )}
                {formType === "recruitment" && (
                  <RecruitmentForm
                    closeModal={() => setShowPopup(false)}
                    user={user}
                  />
                )}
                {formType === "talent" && (
                  <TalentClub
                    closeModal={() => setShowPopup(false)}
                    user={user}
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default HcdTrainer;
