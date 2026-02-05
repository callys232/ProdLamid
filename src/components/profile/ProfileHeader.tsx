// components/ProfileHeader.tsx
"use client";

import { useState, useEffect } from "react";
import { FaLinkedin, FaGithub, FaTwitter, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import StatCard from "./statCard";
import ProgressBar from "./progressBar";
import ReviewPopupContainer from "./popContainer";
import axios from "axios";
import {
  UserAlert,
  mockAlerts,
  mockNotifications,
  mockPayments,
  mockDeadlines,
} from "@/mocks/useralert";

export default function ProfileHeader({ user }: { user: any }) {
  const completion = 70;
  const [showPopup, setShowPopup] = useState(false);

  // Prefetch for badge count
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [notifications, setNotifications] = useState<UserAlert[]>([]);
  const [payments, setPayments] = useState<UserAlert[]>([]);
  const [deadlines, setDeadlines] = useState<UserAlert[]>([]);

  useEffect(() => {
    const prefetch = async () => {
      try {
        const res = await axios.get("/api/user/alerts");
        const data = res.data || {};
        setAlerts((data.alerts as UserAlert[]) || []);
        setNotifications((data.notifications as UserAlert[]) || []);
        setPayments((data.payments as UserAlert[]) || []);
        setDeadlines((data.deadlines as UserAlert[]) || []);
      } catch {
        setAlerts(mockAlerts);
        setNotifications(mockNotifications);
        setPayments(mockPayments);
        setDeadlines(mockDeadlines);
      }
    };
    prefetch();
  }, []);

  const badgeCount =
    alerts.length + notifications.length + payments.length + deadlines.length;

  const displayName = user?.profile?.firstName
    ? `${user.profile.firstName} ${user.profile.lastName || ""}`
    : user?.username || user?.email || "Lamid Consultant";

  const displayTitle = user?.profile?.title || (user?.role === "seller" ? "Independent Consultant" : "Client Account");
  const displayLocation = user?.profile?.addresses?.[0]?.city
    ? `${user.profile.addresses[0].city}, ${user.profile.addresses[0].country || ""}`
    : "Lagos, Nigeria";

  const stats = [
    {
      value: 0,
      label: "Projects",
      details: [],
    },
    {
      value: 0,
      label: "Completed",
      details: [],
    },
    {
      value: "0",
      label: "Pending",
      details: [],
    },
    {
      value: user?.profile?.rating || "0",
      label: "Avg. Rating",
      details: [],
    },
  ];

  return (
    <motion.div
      className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 
                 border-b border-gray-700 p-8 rounded-lg shadow-lg overflow-hidden 
                 ring-1 ring-gray-700 hover:ring-red-500 transition"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Premium Ribbon */}
      <motion.div
        className="absolute top-4 left-0 bg-red-600 text-white text-xs font-semibold 
                   px-4 py-1 rounded-r-lg shadow-md animate-pulse"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Premium Member
      </motion.div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Avatar + Info */}
        <motion.div
          className="flex items-center gap-5"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full ring-2 ring-red-500 animate-pulse" />
            <img
              src={user?.profile?.profilePicture || "/avatar.png"}
              alt="User Avatar"
              className="w-20 h-20 rounded-full border-4 border-red-500 shadow-md 
                         transform hover:scale-105 transition relative z-10 object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white uppercase">
                {displayName}
              </h1>
              <FaCheckCircle
                className="text-blue-500"
                title="Verified Profile"
              />
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
          <ProgressBar label="Profile Completion" value={completion} />
        </motion.div>
      </div>

      {/* Stats Section */}
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
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <button
          onClick={() => setShowPopup(true)}
          className="relative px-6 py-2 border border-gray-600 hover:border-red-500 text-gray-300 hover:text-white font-medium rounded-lg shadow-md transition transform hover:scale-105"
        >
          All Reviews
          {badgeCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {badgeCount}
            </span>
          )}
        </button>
      </motion.div>

      {/* Social Media Links */}
      <motion.div
        className="mt-6 flex gap-6 justify-center md:justify-start text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
          className="hover:text-red-500 transition transform hover:scale-110"
        >
          <FaLinkedin size={24} />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          className="hover:text-red-500 transition transform hover:scale-110"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter Profile"
          className="hover:text-red-500 transition transform hover:scale-110"
        >
          <FaTwitter size={24} />
        </a>
      </motion.div>

      {/* Review Popup */}
      {showPopup && (
        <ReviewPopupContainer
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
        />
      )}
    </motion.div>
  );
}
