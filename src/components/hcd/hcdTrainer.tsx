"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import TrainingForm from "@/forms/trainingForm";
import RecruitmentForm from "@/forms/RecruitmentForm";
import TalentClub from "@/forms/talentClub";
import LearningCTA from "@/components/learningCTA/LearningCTA";

type FormType = "training" | "recruitment" | "talent" | null;

const HcdTrainer: React.FC<{ homepage?: boolean }> = ({ homepage = false }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormType>(null);
  const [user, setUser] = useState<unknown>(null);

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
    return () => { document.body.style.overflow = ""; };
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
        {/* Background rings — subtle, don't force height */}
        {!homepage && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[800px] h-[800px] border border-gray-800 rounded-full opacity-50" />
              <div className="absolute w-[600px] h-[600px] border border-gray-800 rounded-full opacity-30" />
              <div className="absolute w-[400px] h-[400px] border border-gray-800 rounded-full opacity-20" />
            </div>
          </div>
        )}

        <div className="relative z-10 container mx-auto px-8 py-2">
          <main className="max-w-6xl mx-auto">

            {/* ── Unified slide panel ── */}
            <div>

            {/* ================= TRAINING ================= */}
            <section className={homepage ? "p-6" : "mb-16"}>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-2/5 flex-shrink-0">
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/hcd-training-meeting.png"
                      alt="Training Session"
                      width={400}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                <div className="w-full md:w-3/5 flex flex-col gap-3">
                  <h2 className="text-3xl font-extrabold text-orange-500">
                    Training
                  </h2>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    We are leaders in providing far-reaching range of programs
                    suited to meet the challenges of todays rapid changes.
                  </p>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    We match clients unique circumstances with customized
                    solutions that help them adapt to global best practices.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setFormType("training");
                      setShowPopup(true);
                    }}
                    className="self-start inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold
                    bg-gradient-to-r from-orange-500 to-orange-700
                    hover:from-orange-600 hover:to-orange-800
                    transition focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    RESERVE A SLOT NOW!!
                  </button>
                </div>
              </div>

              {/* Training tracks */}
              <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-3xl mx-auto">
                {[
                  { label: "BUSINESS",        desc: "Corporate strategy, finance & operations",     bg: "bg-gray-700",   hover: "bg-gray-600"   },
                  { label: "SOFT SKILLS",     desc: "Communication, teamwork & adaptability",       bg: "bg-orange-700", hover: "bg-orange-600" },
                  { label: "CLIENTS",         desc: "Client-centred engagement & retention",        bg: "bg-blue-900",   hover: "bg-blue-800"   },
                  { label: "PRODUCT",         desc: "Product innovation & development",             bg: "bg-blue-600",   hover: "bg-blue-500"   },
                  { label: "MANAGEMENT",      desc: "Performance management & supervision",         bg: "bg-red-800",    hover: "bg-red-700"    },
                  { label: "ENTREPRENEURSHIP",desc: "Startup growth & venture building",            bg: "bg-purple-700", hover: "bg-purple-600" },
                  { label: "LEADERSHIP",      desc: "Vision, influence & team direction",           bg: "bg-green-700",  hover: "bg-green-600"  },
                  { label: "SALES",           desc: "Negotiation, conversion & closing deals",      bg: "bg-gray-600",   hover: "bg-gray-500"   },
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
                      <span className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${hover.replace("bg-", "border-t-")}`} />
                    </div>
                  </motion.div>
                ))}
              </div>

            </section>


            {homepage && <div className="border-t border-gray-800 mx-6" />}

            {/* ================= RECRUITMENT ================= */}
            <section className={homepage ? "p-6" : "mb-16"}>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-3/5 flex flex-col gap-3">
                  <h2 className="text-3xl font-bold text-orange-500">
                    Recruitment
                  </h2>

                  <p className="text-base text-gray-300 leading-relaxed">
                    Explore open roles across leadership, strategy, sales and more — or manage your full hiring pipeline from one place.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/hcd/recruitment"
                      className="self-start inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold
                      bg-gradient-to-r from-orange-500 to-orange-700
                      hover:from-orange-600 hover:to-orange-800
                      transition focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      Find Your Next Great Expert →
                    </Link>

                    {!homepage && (
                      <>
                        <a
                          href="https://lamidcareers.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 text-sm bg-orange-600 rounded-full hover:bg-orange-700 transition"
                        >
                          LEARN MORE
                        </a>

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
                          JOIN THE TALENTS CLUB
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

                <div className="w-full md:w-2/5 flex-shrink-0">
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/hcd-recruitment-meeting.png"
                      alt="Recruitment Meeting"
                      width={400}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

            </section>

            </div>{/* end unified panel */}

            {/* ================= LEARNING PLATFORM CTA ================= */}
            {!homepage && <LearningCTA className="mb-8" />}

          </main>
        </div>

        {/* ================= MODAL ================= */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center"
              style={{ backgroundColor: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)" }}
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
                  <TrainingForm closeModal={() => setShowPopup(false)} user={user} />
                )}
                {formType === "recruitment" && (
                  <RecruitmentForm closeModal={() => setShowPopup(false)} user={user} />
                )}
                {formType === "talent" && (
                  <TalentClub closeModal={() => setShowPopup(false)} user={user} />
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
