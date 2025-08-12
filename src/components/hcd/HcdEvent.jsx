"use client";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SignupForm from "@/forms/eventsSignUpForm"; // Adjust path if needed

const HcdEvent = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const modalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = showForm ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showForm]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") setShowForm(false);
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  const closeModal = () => setSelectedEvent(null);

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
    <>
      {/* SEO -optimazation */}
      <Head>
        <meta
          name="description"
          content="Explore LAMID Consulting's faculty profiles and upcoming events. Sign up for expert-led training programs and stay ahead in your professional journey."
        />
        <meta
          name="keywords"
          content="LAMID Consulting, HCD Training, Faculty, Events, Signup, Nigeria, Professional Development"
        />
        <meta name="author" content="LAMID Consulting" />
        <meta
          property="og:title"
          content="HCD Events & Training | LAMID Consulting"
        />
        <meta
          property="og:description"
          content="Join LAMID's expert-led training programs and discover impactful events for professional growth."
        />
        <meta property="og:image" content="/SD-training-graphic.png" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://lamidconsulting.com/hcd-event"
        />
        <link rel="canonical" href="https://lamidconsulting.com/hcd-event" />
      </Head>
      ;
      <div className="relative min-h-screen bg-black text-white">
        {/* Background circular gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="w-full h-full relative">
            {[800, 600, 400].map((size, i) => (
              <div
                key={i}
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[${size}px] h-[${size}px] border border-gray-800 rounded-full opacity-${
                  50 - i * 10
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-8 py-12">
          <main className="max-w-6xl mx-auto">
            {/* Faculty Profile Section */}
            <section className="mb-12" aria-labelledby="faculty-title">
              <div className="flex flex-col md:flex-row gap-8 items-stretch">
                {/* Image Section */}
                <div className="w-full md:w-1/3 h-full">
                  <div className="overflow-hidden rounded-lg shadow-lg mb-4">
                    <Image
                      src="/SD-training-graphic.png"
                      alt="People studying together"
                      width={432}
                      height={432}
                      className="object-cover rounded-lg w-full h-auto"
                      priority
                    />
                  </div>
                </div>

                {/* Text Section */}
                <div className="w-full md:w-2/3 h-full flex flex-col justify-between">
                  <div className="mt-6">
                    <h2
                      id="faculty-title"
                      className="text-2xl font-bold mb-2 text-orange-500"
                    >
                      Faculty Profile
                    </h2>
                    <p className="text-sm mb-4">
                      Using the most intellectually experienced consultant
                      facilitators, we match their expertise to clients' needs.
                      As specialists in their own fields, each brings expertise
                      in a professional specialty and commits to model the
                      theories they teach.
                    </p>
                    <p className="text-sm mb-6">
                      “LAMID's trainings enhanced the quality of negotiation
                      processes with Trade Unions, improving industrial
                      relations between officials and management teams. LAMID
                      Consulting continues to assist in designing and
                      implementing productivity and development programs for
                      senior Local Government officials.”
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Events Section */}
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
            <p className="text-center text-sm pt-4">
              We have been retained by an array of clients with personalized
              solutions, enabling them to maintain an enviable leadership
              position.
            </p>
          </main>
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
            role="dialog"
            aria-modal="true"
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
                <Link
                  href="/event"
                  className="bg-blue-500 text-white font-semibold py-2 px-6 rounded hover:bg-blue-600 transition duration-300"
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
          </div>
        </div>
      )}
    </>
  );
};

export default HcdEvent;
