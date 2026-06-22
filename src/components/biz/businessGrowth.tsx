"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SignupModal from "@/forms/signUp";
import AdvisorModal from "@/components/AdvisorModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
} from "@/utils/motionVaraints";

// Define event type
interface NetworkEvent {
  id: number;
  title: string;
  image: string;
  description: string;
  date: string;
  time: string;
  location: string;
  hoverColor: string;
}

const BusinessGrowthSection: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<NetworkEvent | null>(null);
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false);
  const [advisorOpen, setAdvisorOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const networkItems: NetworkEvent[] = [
    {
      id: 1,
      title: "Job Scoping",
      image: "/biz-event-1.png",
      description: "Explore how job roles are evolving and how to stay ahead.",
      date: "Aug 12, 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Lagos Innovation Hub",
      hoverColor: "hover:border-orange-400",
    },
    {
      id: 2,
      title: "Reskilling",
      image: "/biz-event-1.png",
      description: "Learn the latest strategies for workforce reskilling.",
      date: "Aug 15, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Abuja Tech Center",
      hoverColor: "hover:border-green-400",
    },
    {
      id: 3,
      title: "About to Disappear",
      image: "/biz-event-1.png",
      description:
        "Understand which roles are fading and what’s replacing them.",
      date: "Aug 20, 2025",
      time: "1:00 PM - 3:00 PM",
      location: "Port Harcourt Business School",
      hoverColor: "hover:border-red-400",
    },
    {
      id: 4,
      title: "Event Name",
      image: "/biz-event-1.png",
      description:
        "A placeholder for future events and networking opportunities.",
      date: "Aug 25, 2025",
      time: "11:00 AM - 1:00 PM",
      location: "Virtual (Zoom)",
      hoverColor: "hover:border-cyan-400",
    },
  ];

  const closeModal = () => setSelectedEvent(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    if (selectedEvent) {
      document.body.classList.add("overflow-hidden");
      window.addEventListener("keydown", handleKeyDown);
      if (modalRef.current) modalRef.current.focus();
    } else {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("overflow-hidden");
    };
  }, [selectedEvent]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  return (
    <div className="relative w-full bg-black text-white py-12 px-4 md:px-8 overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/LD2.jpg"
          alt="Background"
          fill
          className="object-cover opacity-20 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-black opacity-80"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ASK AN ADVISOR */}
        <motion.button
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          onClick={() => setAdvisorOpen(true)}
          className="group w-full text-center rounded-2xl p-6 mb-12 space-y-4 bg-white/5 border border-white/10 hover:border-orange-500/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition">
            ASK AN ADVISOR FOR DIAGNOSTICS
          </h3>
          <div className="flex justify-center">
            <Image
              src="/help-note.png"
              alt="We can help you"
              width={200}
              height={150}
              className="rounded hover:scale-105 transition-transform"
            />
          </div>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition">We can help you</p>
        </motion.button>

        {/* EVENTS heading */}
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="inline-block border border-yellow-400 rounded-lg px-6 py-2 transition duration-300 hover:border-white">
            <h2 className="text-xl font-bold text-white hover:text-yellow-400">
              EVENTS
            </h2>
          </div>
        </motion.div>

        {/* Network items */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {networkItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => setSelectedEvent(item)}
              className="flex flex-col items-center group transition-transform duration-300 hover:scale-105 focus:outline-none"
              variants={fadeInUp}
              custom={index}
            >
              <div
                className={`relative h-24 w-24 mb-2 overflow-hidden rounded-full border-2 border-white ${item.hoverColor} transition duration-300`}
              >
                <Image
                  src={item.image}
                  alt={`Event: ${item.title}`}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center text-sm sm:text-base group-hover:text-yellow-400 transition duration-300">
                {item.title}
              </p>
            </motion.button>
          ))}
        </motion.div>

        {/* View All Events Button */}
        <div className="text-center mb-12">
          <Link
            href="/event"
            className="inline-block bg-blue-500 text-white font-semibold py-2 px-6 rounded hover:bg-blue-600 transition duration-300"
          >
            View All Events
          </Link>
        </div>
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm px-4"
            onClick={handleBackdropClick}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
          >
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl p-6 w-full max-w-md text-white outline-none"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-white hover:text-yellow-400 text-xl"
                aria-label="Close modal"
              >
                &times;
              </button>
              <div className="flex flex-col items-start space-y-4">
                <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-white/30 self-center">
                  <Image
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Event details */}
                <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                <p className="text-sm text-white/80">
                  {selectedEvent.description}
                </p>

                <div className="text-sm text-white/70 space-y-1">
                  <p>
                    <strong>Date:</strong> {selectedEvent.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedEvent.time}
                  </p>
                  <p>
                    <strong>Location:</strong> {selectedEvent.location}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/event"
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                  >
                    View All Events
                  </Link>
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reusable Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        event={selectedEvent}
      />

      <AdvisorModal
        isOpen={advisorOpen}
        onClose={() => setAdvisorOpen(false)}
      />
    </div>
  );
};

export default BusinessGrowthSection;
