"use client";

import { useState, useEffect } from "react";
import { FaLinkedin, FaGlobe, FaTwitter, FaGithub, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { UserAlert, mockAlerts, mockNotifications, mockPayments, mockDeadlines } from "@/mocks/useralert";
import { UserGuide } from "@/components/Guides/UserGuide";
import { profileHeaderGuide } from "@/lib/UserGuide/profileHeaderGuide";
import { calculateCompletion } from "@/lib/profileCompletion";
import ReviewPopupContainer from "./popContainer";
import StatDropdown from "./statDropdown";
import { ClientProfile } from "@/types/client";

export default function ClientProfileHeader({ client, loading }: { client: ClientProfile | null; loading: boolean }) {
  const [showPopup, setShowPopup] = useState(false);
  const [showGuide, setShowGuide] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("lamid-client-profile-header-guide");
  });

  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [notifications, setNotifications] = useState<UserAlert[]>([]);
  const [payments, setPayments] = useState<UserAlert[]>([]);
  const [deadlines, setDeadlines] = useState<UserAlert[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const prefetch = async () => {
      try {
        const res = await axios.get("/api/client/alerts");
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

  if (loading || !client) {
    return (
      <div className="animate-pulse bg-gray-900 border-b border-gray-700 p-6 md:p-8 rounded-lg">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gray-700 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-700 rounded w-48"></div>
            <div className="h-4 bg-gray-700 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  const badgeCount = alerts.length + notifications.length + payments.length + deadlines.length;

  const displayName = client.business?.companyName || client.companyname || client.name;
  const displayIndustry = client.business?.industry || client.industry || "Industry not set";
  const displayLocation = client.business?.location || client.location || "Lagos, Nigeria";

  const status = {
    logoUploaded: !!client.avatar,
    verifiedBadge: !!client.isPremium, // Assuming premium as a proxy for verified for now
    paymentMethodAdded: true, // Placeholder
    accountDetailsComplete: !!(displayName && displayIndustry && displayLocation),
  };
  const completion = calculateCompletion(status);

  const stats = [
    {
      value: client.projects?.length || 0,
      label: "Projects Posted",
      details: [
        { title: "Active Projects", value: client.projects?.filter(p => p.status === 'ongoing').length || 0, route: "/projects/active" },
        { title: "Completed Projects", value: client.projects?.filter(p => p.status === 'completed').length || 0, route: "/projects/completed" },
        { title: "Open Projects", value: client.projects?.filter(p => p.status === 'open').length || 0, route: "/projects/pending" },
      ],
    },
    {
      value: client.consultants?.length || 0,
      label: "Active Consultants",
      details: [
        { title: "Engaged Consultants", value: client.consultants?.length || 0, route: "/consultants/active" },
        { title: "Pending Invitations", value: client.invitations?.length || 0, route: "/consultants/pending" },
      ],
    },
    {
      value: `$${client.balance || 0}`,
      label: "Balance",
      details: [
        { title: "Available Balance", value: `$${client.balance || 0}`, route: "/budget/total" },
        { title: "Escrow Locked", value: `$${client.escrowTransactions?.reduce((acc, curr) => acc + (curr.status === 'funded' ? curr.amount : 0), 0) || 0}`, route: "/budget/spent" },
      ],
    },
    {
      value: client.rating || "0",
      label: "Client Rating",
      details: [
        { title: "Completed Projects", value: client.completedProjects || 0, route: "/reviews" },
      ],
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
      {client.isPremium && (
        <motion.div
          className="absolute top-4 left-0 bg-red-600 text-white text-xs font-semibold 
                     px-4 py-1 rounded-r-lg shadow-md animate-pulse"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Premium Enterprise
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Logo + Identity */}
        <motion.div
          className="flex items-center gap-5"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <img
            src={client.avatar || "/company-placeholder.png"}
            alt="Company Logo"
            className="w-20 h-20 rounded-full border-4 border-red-500 shadow-md 
                       object-cover                        object-cover transform hover:scale-105 transition"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{displayName}</h1>
              {client.isPremium && <FaCheckCircle className="text-blue-500" />}
            </div>
            <p className="text-gray-400 text-sm">{displayIndustry}</p>
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
        {client.business?.website && (
          <a
            href={client.business.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin className="hover:text-red-500 transition cursor-pointer" size={24} />
          </a>
        )}
        {client.business?.website && (
          <a
            href={client.business.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Company Website"
          >
            <FaGlobe className="hover:text-red-500 transition cursor-pointer" size={24} />
          </a>
        )}
        {/* Twitter and Github are not currently in the ClientProfile type, keeping them as placeholders if they were there */}
      </motion.div>

      {/* Review Popup */}
      {showPopup && (
        <ReviewPopupContainer isOpen={showPopup} onClose={() => setShowPopup(false)} />
      )}

      {/* User Guide */}
      <UserGuide
        storageKey="lamid-client-profile-header-guide"
        steps={profileHeaderGuide}
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </motion.div>
  );
}
