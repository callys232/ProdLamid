"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SignupModal from "@/forms/signUpModal";

const BusinessGrowthSection = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const modalRef = useRef(null);
  const router = useRouter();

  const networkItems = [
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
    const handleKeyDown = (e) => {
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

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
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
        {/* Top section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="w-full md:w-1/3 transform hover:scale-105 transition duration-300">
            <div className="relative h-44 w-full">
              <Image
                src="/biz-business-growth-chart.png"
                alt="Business Growth Chart"
                fill
                className="object-contain rounded"
              />
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <p className="text-lg mb-6 hover:text-gray-300 transition duration-300">
              Network as you get the{" "}
              <span className="font-bold underline hover:text-orange-500 text-blue-500">
                expertise
              </span>{" "}
              to ignite growth and massive results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-300">
                Learn More
              </button>
              <button className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-300">
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* EVENTS heading */}
        <div className="text-center mb-8">
          <div className="inline-block border border-yellow-400 rounded-lg px-6 py-2 transition duration-300 hover:border-white">
            <h2 className="text-xl font-bold text-white hover:text-yellow-400">
              EVENTS
            </h2>
          </div>
        </div>

        {/* Network items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-6">
          {networkItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedEvent(item)}
              className="flex flex-col items-center group transition-transform duration-300 hover:scale-105 focus:outline-none"
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
            </button>
          ))}
        </div>

        {/* View All Events Button */}
        <div className="text-center mb-12">
          <Link href="/event">
            <a className="inline-block bg-blue-500 text-white font-semibold py-2 px-6 rounded hover:bg-blue-600 transition duration-300">
              View All Events
            </a>
          </Link>
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn px-4"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl p-6 w-full max-w-md text-white outline-none"
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
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/event">
                  <a className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                    View All Events
                  </a>
                </Link>
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        event={selectedEvent}
      />
    </div>
  );
};

export default BusinessGrowthSection;
