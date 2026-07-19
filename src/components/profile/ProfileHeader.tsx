"use client";

import { useState, useEffect } from "react";
import { FaLinkedin, FaGlobe, FaTwitter, FaGithub, FaCheckCircle, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";

import { UserGuide } from "@/components/Guides/UserGuide";
import { consultantHeaderGuide } from "@/lib/UserGuide/consultantHeaderGuide";
import { calculateCompletion } from "@/lib/profileCompletion";

import ReviewPopupContainer from "./popContainer";
import StatDropdown from "../client/statDropdown";

import {
  UserAlert,
  mockAlerts,
  mockNotifications,
  mockPayments,
  mockDeadlines,
} from "@/mocks/useralert";

export default function ConsultantProfileHeader({ user }: { user: any }) {
  const router = useRouter();

  // -----------------------------
  // State
  // -----------------------------
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

  // -----------------------------
  // Fetch Alerts
  // -----------------------------
  const fetchAlerts = async () => {
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

  useEffect(() => {
    fetchAlerts();
  }, []);

  // -----------------------------
  // Close dropdown on outside click
  // -----------------------------
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".relative")) setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -----------------------------
  // Derived Data
  // -----------------------------
  const badgeCount = alerts.length + notifications.length + payments.length + deadlines.length;

  const displayName = user?.profile?.name || "Catalyst";
  const displayTitle = user?.profile?.title || "Independent Consultant";
  const displayLocation = user?.profile?.location || "Remote";

  const status = {
    photoUploaded: !!user?.profile?.photoUrl,
    verifiedBadge: !!user?.profile?.verified,
    paymentMethodAdded: !!user?.profile?.paymentMethod,
    accountDetailsComplete: !!(
      user?.profile?.name && user?.profile?.title && user?.profile?.location
    ),
  };

  const completion = calculateCompletion(status);

  // -----------------------------
  // Stats Data
  // -----------------------------
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

  // -----------------------------
  // Social Media Links
  // -----------------------------
  const socialLinks = [
    { name: "LinkedIn", icon: <FaLinkedin size={24} />, url: user?.profile?.linkedin || "#", hover: "hover:text-blue-600" },
    { name: "Website", icon: <FaGlobe size={24} />, url: user?.profile?.website || "#", hover: "hover:text-green-400" },
    { name: "Twitter", icon: <FaTwitter size={24} />, url: user?.profile?.twitter || "#", hover: "hover:text-blue-400" },
    { name: "GitHub", icon: <FaGithub size={24} />, url: user?.profile?.github || "#", hover: "hover:text-blue-600" },
  ];

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <motion.div
      className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
                 border-b border-gray-700 p-6 md:p-8 rounded-lg shadow-lg overflow-hidden
                 ring-1 ring-gray-700 hover:ring-blue-500 transition"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Premium Ribbon */}
      {user?.profile?.premium && (
        <motion.div
          className="absolute top-4 left-0 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-r-lg shadow-md flex items-center gap-1 animate-pulse"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <FaStar /> Premium Freelancer
        </motion.div>
      )}

      {/* Business Badge */}
      {user?.profile?.businessEnrolled && (
        <motion.div
          className="absolute top-4 left-40 bg-green-600 text-white text-xs font-semibold px-4 py-1 rounded-lg shadow-md flex items-center gap-1"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Business Profile
        </motion.div>
      )}

      {/* Profile Identity + Completion */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Profile Identity */}
        <div className="flex items-center gap-5" data-guide="consultant-identity">
          <img
            src={user?.profile?.photoUrl || "/freelancer-placeholder.png"}
            alt="Freelancer Photo"
            className="w-20 h-20 rounded-full border-4 border-blue-500 shadow-md object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{displayName}</h1>
              {user?.profile?.verified && <FaCheckCircle className="text-blue-500" />}
            </div>
            <p className="text-gray-400 text-sm">{displayTitle}</p>
            <p className="text-xs text-gray-500 mt-1">{displayLocation}</p>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="w-full md:w-1/3" data-guide="consultant-completion">
          <p className="text-sm text-gray-400 mb-2">Profile Completion</p>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-gray-300">{completion}%</span>
          </div>
          <div className="mt-2">
            <button
              onClick={() => router.push("/editConsultant")}
              className="text-xs text-blue-500 hover:text-white underline"
            >
              Complete Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4" data-guide="consultant-stats">
        {stats.map((stat, idx) => (
          <StatDropdown
            key={idx}
            {...stat}
            isOpen={activeDropdown === stat.label}
            onToggle={() =>
              setActiveDropdown(activeDropdown === stat.label ? null : stat.label)
            }
          />
        ))}
      </div>

      {/* Alerts */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start" data-guide="consultant-alerts">
        <button
          onClick={() => setShowPopup(true)}
          className="relative px-6 py-2 border border-gray-600 hover:border-blue-500
                     text-gray-300 hover:text-white font-medium rounded-lg shadow-md"
        >
          View Alerts
          {badgeCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {badgeCount}
            </span>
          )}
        </button>
      </div>

      {/* Social Links */}
      <div className="mt-4 flex gap-6 justify-center md:justify-start text-gray-400" data-guide="consultant-socials">
        {socialLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.name}
            className={`transition-colors ${link.hover} hover:scale-110`}
          >
            {link.icon}
          </a>
        ))}
      </div>

      {/* Popup */}
      {showPopup && (
        <ReviewPopupContainer isOpen={showPopup} onClose={() => setShowPopup(false)} />
      )}

      {/* Guide */}
      <UserGuide
        storageKey="lamid-consultant-profile-header-guide"
        steps={consultantHeaderGuide}
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </motion.div>
  );
}