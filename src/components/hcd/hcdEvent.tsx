"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EventItem } from "@/types/eventTypes";

const fade = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const networkItems: EventItem[] = [
  {
    id: 1,
    title: "Job Scoping",
    image: "/biz-event-1.png",
    description: "Explore how job roles are evolving and how to stay ahead.",
    date: "Aug 12, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Innovation Hub — Virtual",
  },
  {
    id: 2,
    title: "Reskilling",
    image: "/biz-event-1.png",
    description: "Learn the latest strategies for workforce reskilling.",
    date: "Aug 15, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Tech Center — Virtual",
  },
  {
    id: 3,
    title: "About to Disappear",
    image: "/biz-event-1.png",
    description: "Understand which roles are fading and what's replacing them.",
    date: "Aug 20, 2025",
    time: "1:00 PM - 3:00 PM",
    location: "Business School — Virtual",
  },
  {
    id: 4,
    title: "Event Name",
    image: "/biz-event-1.png",
    description: "A placeholder for future events and networking opportunities.",
    date: "Aug 25, 2025",
    time: "11:00 AM - 1:00 PM",
    location: "Virtual (Zoom)",
  },
];

interface HcdEventProps {
  isOpen: boolean;
  onClose: () => void;
}

const HcdEvent: React.FC<HcdEventProps> = ({ isOpen, onClose }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const closeEvent = () => setSelectedEvent(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4 py-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 130, damping: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-black border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Close btn */}
            <button
              type="button"
              onClick={onClose}
              className="sticky top-4 float-right mr-4 text-white/40 hover:text-white transition text-2xl z-10"
            >
              ✕
            </button>

            <div className="px-8 pt-10 pb-10">
              {/* Faculty */}
              <section className="flex flex-col md:flex-row items-center gap-10 mb-14">
                <motion.div
                  variants={fade}
                  initial="hidden"
                  animate="visible"
                  className="w-full md:w-1/3 rounded-3xl border border-white/10 shadow-[0_0_35px_-10px_rgba(249,115,22,0.4)] overflow-hidden"
                >
                  <Image
                    src="/SD-training-graphic.png"
                    width={450}
                    height={450}
                    alt="Faculty profile"
                    className="object-cover rounded-3xl"
                  />
                </motion.div>

                <motion.div
                  variants={fade}
                  initial="hidden"
                  animate="visible"
                  className="w-full md:w-2/3 space-y-4"
                >
                  <h2 className="text-3xl font-bold text-orange-500">
                    Expert Matching
                  </h2>
                  <p className="text-white/80 leading-relaxed">
                    Using the most intellectually experienced consultant
                    facilitators, we match their expertise to clients needs. As
                    specialists in their own fields, each bring expertise in a
                    professional specialty and commit to model the theories they
                    teach.
                  </p>
                  <p className="text-white/50 italic">
                    &ldquo;LAMID trainings improved negotiation and industrial
                    relations, enhancing productivity and development for senior
                    officials.&rdquo;
                  </p>
                </motion.div>
              </section>

              {/* Events Grid */}
              <section>
                <h3 className="text-center text-2xl font-bold text-orange-500 mb-10">
                  Upcoming Talent Development Events
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                  {networkItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setSelectedEvent(item)}
                      className="relative group flex flex-col items-center cursor-pointer"
                    >
                      <div className="absolute inset-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition bg-orange-500/70" />
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-orange-500 shadow-md group-hover:shadow-orange-500/40 transition">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-3 text-sm font-medium text-white group-hover:text-orange-500 transition">
                        {item.title}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </section>

              <div className="text-center mt-10">
                <Link
                  href="/event"
                  onClick={onClose}
                  className="px-8 py-3 bg-orange-500 text-black font-semibold rounded-xl hover:bg-orange-400 transition shadow-[0_0_25px_-5px_rgba(249,115,22,0.7)] inline-block"
                >
                  View All Events
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Individual event detail */}
          <AnimatePresence>
            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
                onClick={closeEvent}
              >
                <motion.div
                  ref={modalRef}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 12 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-black/90 border border-white/20 rounded-3xl p-10 max-w-md w-full text-white shadow-[0_0_50px_-10px_rgba(249,115,22,0.4)] relative"
                >
                  <button
                    type="button"
                    onClick={closeEvent}
                    className="absolute top-3 right-4 text-white hover:text-orange-500 transition text-2xl"
                  >
                    ✕
                  </button>

                  <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border border-white/20 shadow-md mb-5">
                    <Image
                      src={selectedEvent.image}
                      fill
                      alt={selectedEvent.title}
                      className="object-cover"
                    />
                  </div>

                  <h3 className="text-3xl font-bold text-center text-orange-500">
                    {selectedEvent.title}
                  </h3>
                  <p className="mt-4 text-white/80 text-center">
                    {selectedEvent.description}
                  </p>

                  <div className="mt-6 text-sm text-white/70 space-y-1">
                    <p><strong>Date:</strong> {selectedEvent.date}</p>
                    <p><strong>Time:</strong> {selectedEvent.time}</p>
                    <p><strong>Location:</strong> {selectedEvent.location}</p>
                  </div>

                  <div className="mt-10 flex gap-4 justify-center">
                    <Link
                      href="/event"
                      onClick={() => { closeEvent(); onClose(); }}
                      className="px-6 py-2 bg-orange-500 text-black rounded-lg hover:bg-orange-600 transition"
                    >
                      View All
                    </Link>
                    <button
                      type="button"
                      onClick={closeEvent}
                      className="px-6 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-black transition"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HcdEvent;
