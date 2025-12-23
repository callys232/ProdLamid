"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";

import TrainingForm from "@/forms/trainingForm";
import RecruitmentForm from "@/forms/RecruitmentForm";
import TalentClub from "@/forms/talentClub";

type FormType = "training" | "recruitment" | "talent" | null;

const HcdTrainer: React.FC = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormType>(null);
  const [user, setUser] = useState<unknown>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  /* ESC key closes modal */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPopup(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

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

      <div className="relative min-h-screen bg-black text-white">
        {/* Background circular gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[800px] h-[800px] border border-gray-800 rounded-full opacity-50" />
            <div className="absolute w-[600px] h-[600px] border border-gray-800 rounded-full opacity-30" />
            <div className="absolute w-[400px] h-[400px] border border-gray-800 rounded-full opacity-20" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-8 py-12">
          <main className="max-w-6xl mx-auto">
            {/* ================= TRAINING ================= */}
            <section className="mb-16">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 mt-6 md:mt-12">
                  <div className="rounded-lg overflow-hidden">
                    <Image
                      src="/hcd-training-meeting.png"
                      alt="Training Session"
                      width={400}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                <div className="w-full md:w-2/3">
                  <h2 className="text-4xl font-extrabold text-orange-500 mb-4">
                    Training
                  </h2>

                  <p className="text-base text-gray-300 mb-6">
                    We are leaders in providing far-reaching range of programs
                    suited to meet the challenges of todays rapid changes.
                  </p>

                  <p className="text-sm mb-6">
                    We match clients unique circumstances with customized
                    solutions that help them adapt to global best practices.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setFormType("training");
                      setShowPopup(true);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold
                    bg-gradient-to-r from-orange-500 to-orange-700
                    hover:from-orange-600 hover:to-orange-800
                    transition focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    RESERVE A SLOT NOW!!
                  </button>
                </div>
              </div>

              {/* Tooltips */}
              <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-3xl mx-auto">
                {[
                  [
                    "BUSINESS",
                    "Corporate strategy, finance, operations",
                    "bg-gray-700",
                  ],
                  [
                    "SOFT SKILLS",
                    "Communication and teamwork",
                    "bg-orange-700",
                  ],
                  ["CLIENTS", "Customer engagement", "bg-blue-900"],
                  ["PRODUCT", "Product innovation", "bg-blue-600"],
                  ["MANAGEMENT", "Performance management", "bg-red-800"],
                  ["ENTREPRENEURSHIP", "Startup growth", "bg-purple-700"],
                  ["LEADERSHIP", "Vision and influence", "bg-green-700"],
                  ["SALES", "Negotiation and closing", "bg-gray-700"],
                ].map(([label, tooltip, color], index) => (
                  <motion.button
                    key={label}
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() =>
                      setActiveIndex(activeIndex === index ? null : index)
                    }
                    aria-label={tooltip}
                    className={`relative px-4 py-1 text-xs font-semibold rounded-full ${color}`}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </section>

            {/* ================= RECRUITMENT ================= */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-orange-500 mb-6">
                Recruitment
              </h2>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-2/3">
                  <p className="text-sm mb-6">
                    We conduct executive searches and headhunts to secure
                    top-tier talent for organizations globally.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setFormType("recruitment");
                      setShowPopup(true);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold
                    bg-gradient-to-r from-orange-500 to-orange-700
                    hover:from-orange-600 hover:to-orange-800"
                  >
                    SIGN UP HERE
                  </button>

                  <div className="flex gap-4 mt-6">
                    <a
                      href="https://lamidcareers.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm bg-orange-600 rounded hover:bg-orange-700"
                    >
                      LEARN MORE
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setFormType("talent");
                        setShowPopup(true);
                      }}
                      className="px-6 py-2 text-sm rounded-full font-semibold
                      bg-gradient-to-r from-orange-500 to-orange-700"
                    >
                      JOIN THE TALENTS CLUB
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-1/3">
                  <Image
                    src="/hcd-recruitment-meeting.png"
                    alt="Recruitment Meeting"
                    width={400}
                    height={300}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* ================= MODAL ================= */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="dialog"
              aria-modal="true"
              onClick={() => setShowPopup(false)}
            >
              <motion.div
                className="relative bg-black border border-gray-700 rounded-lg p-6 w-[90%] md:w-[50%] max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
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
