"use client";

import { useState, useEffect } from "react";
import { FaLinkedin, FaGlobe, FaTwitter, FaGithub, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { UserGuide } from "@/components/Guides/UserGuide";
import { profileHeaderGuide } from "@/lib/UserGuide/profileHeaderGuide";
import { calculateCompletion } from "@/lib/profileCompletion";
import ReviewPopupContainer from "./popContainer";
import StatDropdown from "../client/statDropdown";
import { UserAlert, mockAlerts, mockNotifications, mockPayments, mockDeadlines } from "@/mocks/useralert";

export default function ConsultantProfileHeader({ user }: { user: any }) {
  const [showPopup, setShowPopup] = useState(false);
  const [showGuide, setShowGuide] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("lamid-consultant-profile-header-guide");
  });

  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [notifications, setNotifications] = useState<UserAlert[]>([]);
  const [payments, setPayments] = useState<UserAlert[]>([]);
  const [deadlines, setDeadlines] = useState<UserAlert[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const prefetch = async () => {
      try {
        const res = await axios.get("/api/consultant/alerts");
        const data = res.data || {};
        setAlerts(data.alerts || mockAlerts);
        setNotifications(data.notifications || mockNotifications);
        setPayments(data.payments || mockPayments);
        setDeadlines(data.deadlines || mockDeadlines);
      } catch {
        setAlerts(mockAlerts);
        setNotifications(mockNotifications);
        setPayments(mockPayments);
        setDeadlines(mockDeadlines);
      }
    };
    prefetch();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".relative")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const badgeCount = alerts.length + notifications.length + payments.length + deadlines.length;

  const displayName = user?.profile?.name || "Freelancer";
  const displayTitle = user?.profile?.title || "Independent Consultant";
  const displayLocation = user?.profile?.location || "Remote";

  const status = {
    photoUploaded: !!user?.profile?.photoUrl,
    verifiedBadge: !!user?.profile?.verified,
    paymentMethodAdded: !!user?.profile?.paymentMethod,
    accountDetailsComplete: !!(user?.profile?.name && user?.profile?.title && user?.profile?.location),
  };
  const completion = calculateCompletion(status);

  const stats = [
    {
      value: user?.profile?.projectsCompleted || 0,
      label: "Projects Completed",
      details: [
        { title: "Active Projects", value: user?.profile?.activeProjects || 0, route: "/consultant/projects/active" },
        { title: "Pending Projects", value: user?.profile?.pendingProjects || 0, route: "/consultant/projects/pending" },
        { title: "Under Review", value: user?.profile?.underReviewProjects || 0, route: "/consultant/projects/review" },
      ],
    },
    {
      value: `$${user?.profile?.earnings || 0}`,
      label: "Earnings",
      details: [
        { title: "Total Earnings", value: `$${user?.profile?.totalEarnings || 0}`, route: "/consultant/earnings/total" },
        { title: "Pending Payments", value: `$${user?.profile?.pendingPayments || 0}`, route: "/consultant/earnings/pending" },
      ],
    },
    {
      value: user?.profile?.avgRating || "0",
      label: "Avg. Client Rating",
      details: [
        { title: "Reviews Count", value: user?.profile?.reviewsCount || 0, route: "/consultant/reviews" },
        { title: "Highest Rating", value: user?.profile?.highestRating || "5", route: "/consultant/reviews/highest" },
      ],
    },
    {
      value: user?.profile?.skills?.length || 0,
      label: "Skills",
      details: user?.profile?.skills?.map((skill: string) => ({
        title: skill,
        value: "",
        route: `/consultant/skills/${skill.toLowerCase()}`,
      })) || [],
    },
  ];

  return (
    <motion.div
      className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 
                 border-b border-gray-700 p-6 md:p-8 rounded-lg shadow-lg overflow-hidden 
                 ring-1 ring-gray-700 hover:ring-red-500 transition"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Premium Ribbon */}
      {user?.profile?.premium && (
        <motion.div
          className="absolute top-4 left-0 bg-red-600 text-white text-xs font-semibold 
                     px-4 py-1 rounded-r-lg shadow-md animate-pulse"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Premium Freelancer
        </motion.div>
      )}

      {/* Business Profile Badge */}
      {user?.profile?.businessEnrolled && (
        <motion.div
          className="absolute top-4 left-40 bg-green-600 text-white text-xs font-semibold 
                     px-4 py-1 rounded-lg shadow-md"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Business Profile
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Photo + Identity */}
        <motion.div
          className="flex items-center gap-5"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <img
            src={user?.profile?.photoUrl || "/freelancer-placeholder.png"}
            alt="Freelancer Photo"
            className="w-20 h-20 rounded-full border-4 border-red-500 shadow-md 
                       object-cover transform hover:scale-105 transition"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{displayName}</h1>
              {user?.profile?.verified && <FaCheckCircle className="text-blue-500" />}
            </div>
            <p className="text-gray-400 text-sm">{displayTitle}</p>
            <p className="text-xs text-gray-500 mt-1">{displayLocation}</p>
          </div>
        </motion.div>

        {/* Profile Completion */}
        <motion.div
          className="w-full md:w-1/3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-400">Profile Completion</p>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-300">{completion}%</span>
            </div>
            <button className="text-xs text-red-500 hover:text-white underline">
              Complete Profile
            </button>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <motion.div
        className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2, delayChildren: 1 } },
        }}
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <StatDropdown
              {...stat}
              isOpen={activeDropdown === stat.label}
              onToggle={() =>
                setActiveDropdown(activeDropdown === stat.label ? null : stat.label)
              }
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Alerts */}
      <motion.div
        className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <button
          onClick={() => setShowPopup(true)}
          className="relative px-6 py-2 border border-gray-600 hover:border-red-500 
                     text-gray-300 hover:text-white font-medium rounded-lg shadow-md 
                     transition transform hover:scale-105"
        >
          View Alerts
          {badgeCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white 
                             text-xs font-bold rounded-full px-2 py-0.5">
              {badgeCount}
            </span>
          )}
        </button>
      </motion.div>

      {/* Social Links */}
      <motion.div
        className="mt-6 flex gap-6 justify-center md:justify-start text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        {user?.profile?.linkedin && (
          <a
            href={user.profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin className="hover:text-red-500 transition cursor-pointer" size={24} />
          </a>
        )}
        {user?.profile?.website && (
          <a
            href={user.profile.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Personal Website"
          >
            <FaGlobe className="hover:text-red-500 transition cursor-pointer" size={24} />
          </a>
        )}
        {user?.profile?.twitter && (
          <a
            href={user.profile.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter Profile"
          >
            <FaTwitter className="hover:text-red-500 transition cursor-pointer" size={24} />
          </a>
        )}
        {user?.profile?.github && (
          <a
            href={user.profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
          >
            <FaGithub className="hover:text-red-500 transition cursor-pointer" size={24} />
          </a>
        )}
      </motion.div>

      {/* Review Popup */}
      {showPopup && (
        <ReviewPopupContainer isOpen={showPopup} onClose={() => setShowPopup(false)} />
      )}

      {/* User Guide */}
      <UserGuide
        storageKey="lamid-consultant-profile-header-guide"
        steps={profileHeaderGuide}
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </motion.div>
  );
}
