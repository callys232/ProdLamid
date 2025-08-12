"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import TrainingForm from "@/forms/trainingForm";
import RecruitmentForm from "@/forms/RecruitmentForm"; // Adjust path if needed
import TalentClub from "@/forms/talentClub"; // Adjust path if needed
import Head from "next/head";

const HcdTrainer = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formType, setFormType] = useState(null);
  const [user, setUser] = useState(null); // Optional: for future login integration
  const [activeIndex, setActiveIndex] = useState(null);

  {
    /*esc btn closes modal*/
  }
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setShowPopup(false);
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
          <div className="w-full h-full relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gray-800 rounded-full opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gray-800 rounded-full opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-gray-800 rounded-full opacity-20"></div>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-8 py-12">
          <main className="max-w-6xl mx-auto">
            {/* Training Section */}
            <section className="mb-16">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Image */}
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

                {/* Text + Button */}
                <div className="w-full md:w-2/3">
                  <h2 className="text-4xl font-extrabold tracking-tight text-orange-500 mb-4">
                    Training
                  </h2>
                  <p className="text-base leading-relaxed text-gray-300 mb-6">
                    We are leaders in providing far-reaching range of programs
                    suited to meet the challenges of today's rapid changes.
                  </p>
                  <p className="text-sm mb-6">
                    We match clients' unique circumstances with customized
                    solutions that help them adapt to global best practices. You
                    achieve knowledge transfer and behavioral transformation in
                    ways that seamlessly integrate your team back to the
                    workplace, using hands-on methodologies.
                  </p>

                  <button
                    onClick={() => {
                      setFormType("training");
                      setShowPopup(true);
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                    </svg>
                    RESERVE A SLOT NOW!!
                  </button>
                </div>
              </div>

              {/* tooltips section */}
              <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-3xl mx-auto">
                {[
                  {
                    text: "BUSINESS",
                    color: "bg-gray-700",
                    tooltip: "Corporate strategy, finance, and operations",
                  },
                  {
                    text: "SOFT SKILLS",
                    color: "bg-orange-700",
                    tooltip: "Communication, teamwork, emotional intelligence",
                  },
                  {
                    text: "CLIENTS",
                    color: "bg-blue-900",
                    tooltip: "Customer engagement and relationship management",
                  },
                  {
                    text: "PRODUCT",
                    color: "bg-blue-600",
                    tooltip: "Product development, innovation, and delivery",
                  },
                  {
                    text: "MANAGEMENT",
                    color: "bg-red-800",
                    tooltip: "Project, people, and performance management",
                  },
                  {
                    text: "ENTREPRENEURSHIP",
                    color: "bg-purple-700",
                    tooltip: "Startup strategy, funding, and growth",
                  },
                  {
                    text: "LEADERSHIP",
                    color: "bg-green-700",
                    tooltip: "Vision, influence, and team empowerment",
                  },
                  {
                    text: "SALES",
                    color: "bg-gray-700",
                    tooltip: "Sales strategy, negotiation, and closing deals",
                  },
                ].map((item, index) => (
                  <div key={index} className="relative">
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() =>
                        setActiveIndex(activeIndex === index ? null : index)
                      }
                      className={`group px-4 py-1 text-xs font-semibold tracking-wide ${item.color} rounded-full shadow-sm cursor-pointer transition-all duration-200 focus:outline-none`}
                      aria-label={item.tooltip}
                    >
                      {item.text}
                      <div
                        className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-white text-xs rounded px-2 py-1 shadow-lg z-50 whitespace-nowrap ${
                          item.color
                        } bg-opacity-90
            ${
              activeIndex === index
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-1"
            }
            md:opacity-0 md:group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0
            transition-all duration-300`}
                      >
                        {item.tooltip}
                        <div
                          className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${item.color} bg-opacity-90`}
                        />
                      </div>
                    </motion.button>
                  </div>
                ))}
              </div>
            </section>

            {/* Recruitment Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-orange-500">
                Recruitment
              </h2>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-2/3">
                  <p className="text-sm mb-6">
                    Leveraging cutting-edge tools, we conduct executive searches
                    and headhunts to identify and secure top-tier talent for
                    permanent, temporary, and contract positions. Our approaches
                    ensure organizations attract the brightest and most
                    dedicated professionals, empowering them to succeed and
                    thrive.
                  </p>

                  <div className="mb-6">
                    <button
                      onClick={() => {
                        setFormType("recruitment");
                        setShowPopup(true);
                      }}
                      className="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <span className="group-hover:scale-105 transition-transform duration-300">
                        SIGN UP HERE
                      </span>
                      {/* Rocket SVG appears only on hover */}
                      <svg
                        className="w-4 h-4 hidden group-hover:inline-block transition-transform duration-300 transform group-hover:translate-x-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M12 2a1 1 0 00-.894.553L9.382 6H6a1 1 0 00-.894.553l-2 4A1 1 0 003 11h3v3a1 1 0 001 1h3v3a1 1 0 001.447.894l4-2A1 1 0 0018 17v-3.382l3.447-1.724A1 1 0 0022 11V6a1 1 0 00-.553-.894l-4-2A1 1 0 0016 3h-3.382L12.447 2.553A1 1 0 0012 2z" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-sm mt-8 mb-4">
                    We support the effective pairing, management and retention
                    of cutting-edge expertise as a pool of accessible peer
                    mentors and leaders, leveraging their intellectual capacity
                    and experience to transform everyday challenges into
                    opportunities that birth and launch organizations as raving
                    global successes.
                  </p>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <a
                      href="https://lamidcareers.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded text-sm uppercase border border-orange-700 hover:bg-orange-700 transition-colors"
                    >
                      LEARN MORE
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M12.293 3.293a1 1 0 011.414 0L18 7.586a1 1 0 010 1.414l-4.293 4.293a1 1 0 01-1.414-1.414L15.586 9H6a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" />
                      </svg>
                    </a>

                    <button
                      onClick={() => {
                        setFormType("talent");
                        setShowPopup(true);
                      }}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 
           0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                        />
                      </svg>
                      JOIN THE TALENTS' CLUB
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-1/3">
                  <div className="rounded-lg overflow-hidden">
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
          </main>
        </div>

        {/* Popup Modal */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[999999] flex items-center justify-center bg-gradient-to-br from-black/70 to-gray-900/70 backdrop-blur-md px-4 py-8"
              onClick={() => setShowPopup(false)}
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg shadow-2xl border border-gray-600 w-[90%] sm:w-[70%] md:w-[50%] max-h-[80vh] overflow-y-auto relative p-6"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="TrainingFormTitle"
              >
                <svg
                  onClick={() => setShowPopup(false)}
                  className="absolute top-3 right-3 w-5 h-5 text-orange-500 hover:text-red-500 cursor-pointer transition"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-label="Close popup"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>

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
