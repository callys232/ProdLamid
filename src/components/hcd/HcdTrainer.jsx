"use client";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const HcdTrainer = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
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
              <div className="w-full md:w-1/3">
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
                <h2 className="text-3xl font-bold mb-4 text-orange-500">
                  Training
                </h2>
                <p className="text-sm mb-4">
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
                {/* <div className="mt-4 mb-6">
                  <button className="px-4 py-2 bg-orange-600 text-white rounded text-sm uppercase border border-orange-700 hover:bg-orange-700 transition-colors">
                    RESERVE A SLOT NOW!
                  </button>
                </div> */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <button
                    onClick={() => setShowPopup(true)}
                    className="bg-orange-500 hover:bg-orange-700 text-white px-6 py-2 rounded-md text-xs md:text-sm transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    aria-label="Sign up for Training"
                  >
                    RESERVE A SLOT NOW!!
                  </button>

                  {/* Conditional Rendering for Popup */}
                  {showPopup && (
                    <div
                      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg z-[999999] w-full transition-opacity duration-500"
                      onClick={() => setShowPopup(false)} // Close popup when clicking outside
                    >
                      <div
                        className="bg-white rounded-lg shadow-2xl border border-gray-600 w-[80%] sm:w-[70%] md:w-[50%] max-h-[60vh] overflow-y-auto relative transition-all duration-500"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                      >
                        <button
                          onClick={() => setShowPopup(false)}
                          className="absolute top-3 right-3 text-gray-500 hover:text-black transition-all"
                        >
                          ✖
                        </button>

                        <ReserveSlot closeModal={() => setShowPopup(false)} />
                      </div>
                    </div>
                  )}
                </div>
                {/* <div className="flex flex-wrap gap-2 mt-6">
                  <span className="px-3 py-1 text-xs bg-gray-700 rounded">
                    BUSINESS
                  </span>
                  <span className="px-3 py-1 text-xs bg-orange-700 rounded">
                    SOFT SKILLS
                  </span>
                  <span className="px-3 py-1 text-xs bg-blue-900 rounded">
                    CLIENTS
                  </span>
                  <span className="px-3 py-1 text-xs bg-blue-600 rounded">
                    PRODUCT
                  </span>
                  <span className="px-3 py-1 text-xs bg-red-800 rounded">
                    MANAGEMENT
                  </span>
                  <span className="px-3 py-1 text-xs bg-purple-700 rounded">
                    ENTREPRENEURSHIP
                  </span>
                  <span className="px-3 py-1 text-xs bg-green-700 rounded">
                    LEADERSHIP
                  </span>
                  <span className="px-3 py-1 text-xs bg-gray-700 rounded">
                    SALES
                  </span>
                </div>
              </div>
            </div> */}

                <div className="flex flex-wrap gap-2 mt-6">
                  {[
                    { text: "BUSINESS", color: "bg-gray-700" },
                    { text: "SOFT SKILLS", color: "bg-orange-700" },
                    { text: "CLIENTS", color: "bg-blue-900" },
                    { text: "PRODUCT", color: "bg-blue-600" },
                    { text: "MANAGEMENT", color: "bg-red-800" },
                    { text: "ENTREPRENEURSHIP", color: "bg-purple-700" },
                    { text: "LEADERSHIP", color: "bg-green-700" },
                    { text: "SALES", color: "bg-gray-700" },
                  ].map((item, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      className={`px-3 py-1 text-xs ${item.color} rounded cursor-pointer`}
                    >
                      {item.text}
                    </motion.span>
                  ))}
                </div>
              </div>
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
                  ensure organizations attract the brightest and most dedicated
                  professionals, empowering them to succeed and thrive.
                </p>

                <div className="mb-6">
                  <button className="px-4 py-2 bg-orange-600 text-white rounded text-sm uppercase border border-orange-700 hover:bg-orange-700 transition-colors">
                    SIGN UP HERE
                  </button>
                </div>

                <p className="text-sm mt-8 mb-4">
                  We support the effective pairing, management and retention of
                  cutting-edge expertise as a pool of accessible peer mentors
                  and leaders, leveraging their intellectual capacity and
                  experience to transform everyday challenges into opportunities
                  that birth and launch organizations as raving global
                  successes.
                </p>

                <div className="flex flex-wrap gap-4 mt-4">
                  <button className="px-4 py-2 bg-orange-600 text-white rounded text-sm uppercase border border-orange-700 hover:bg-orange-700 transition-colors">
                    LEARN MORE
                  </button>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded text-sm uppercase border border-orange-700 hover:bg-orange-700 transition-colors">
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
    </div>
  );
};

export default HcdTrainer;
