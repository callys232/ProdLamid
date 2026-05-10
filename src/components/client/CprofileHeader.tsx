"use client";

import { useState, useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { useClientAlerts } from "@/hooks/useClientAlerts";
import { calculateCompletion } from "@/lib/profileCompletion";
import { UserGuide } from "@/components/Guides/UserGuide";
import { profileHeaderGuide } from "@/lib/UserGuide/profileHeaderGuide";

import ReviewPopupContainer  from "./popContainer";
import StatDropdown          from "./statDropdown";
import EditClientProfileForm from "./settings/EditProfileForm";
import type { ClientProfile } from "@/types/client";

/* ── Loading skeleton ────────────────────────────────────────────── */
function HeaderSkeleton() {
  return (
    <div className="animate-pulse bg-gray-900 border-b border-gray-700 p-6 md:p-8 rounded-lg">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 bg-gray-700 rounded-full" />
        <div className="space-y-2">
          <div className="h-6 bg-gray-700 rounded w-48" />
          <div className="h-4 bg-gray-700 rounded w-32" />
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export default function ClientProfileHeader({
  client,
  loading,
}: {
  client:  ClientProfile | null;
  loading: boolean;
}) {
  const [showPopup,       setShowPopup]       = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showGuide,       setShowGuide]       = useState(false);
  const [activeDropdown,  setActiveDropdown]  = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { total: alertCount } = useClientAlerts();

  // Initialise guide flag on client only
  useEffect(() => {
    setShowGuide(!localStorage.getItem("lamid-client-profile-header-guide"));
  }, []);

  // Close dropdown when clicking outside the header
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  if (loading || !client) return <HeaderSkeleton />;

  /* ── Derived display values ────────────────────────────────────── */
  const displayName     = client.business?.companyName ?? client.companyname ?? client.name;
  const displayIndustry = client.business?.industry    ?? client.industry    ?? "Industry not set";
  const displayLocation = client.business?.location    ?? client.location    ?? "Lagos, Nigeria";

  const completion = calculateCompletion({
    logoUploaded:           !!client.avatar,
    verifiedBadge:          !!client.isPremium,
    paymentMethodAdded:     true,
    accountDetailsComplete: !!(displayName && displayIndustry && displayLocation),
  });

  /* ── Stats for dropdown ──────────────────────────────────────────── */
  const stats = [
    {
      value:   client.projects?.length ?? 0,
      label:   "Projects Posted",
      details: [
        { title: "Active",    value: client.projects?.filter(p => p.status === "ongoing").length   ?? 0, route: "/projects/active"    },
        { title: "Completed", value: client.projects?.filter(p => p.status === "completed").length ?? 0, route: "/projects/completed" },
        { title: "Open",      value: client.projects?.filter(p => p.status === "open").length      ?? 0, route: "/projects/pending"   },
      ],
    },
    {
      value:   client.consultants?.length ?? 0,
      label:   "Active Consultants",
      details: [
        { title: "Engaged",  value: client.consultants?.length  ?? 0, route: "/consultants/active"  },
        { title: "Pending",  value: client.invitations?.length  ?? 0, route: "/consultants/pending" },
      ],
    },
    {
      value:   `$${client.balance ?? 0}`,
      label:   "Balance",
      details: [
        { title: "Available",     value: `$${client.balance ?? 0}`, route: "/budget/total" },
        { title: "Escrow Locked", value: `$${client.escrowTransactions?.reduce((s, t) => s + (t.status === "funded" ? t.amount : 0), 0) ?? 0}`, route: "/budget/spent" },
      ],
    },
    {
      value:   client.rating ?? "0",
      label:   "Client Rating",
      details: [
        { title: "Completed Projects", value: client.completedProjects ?? 0, route: "/reviews" },
      ],
    },
  ];

  return (
    <>
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 p-6 md:p-8 rounded-lg shadow-lg ring-1 ring-gray-700 hover:ring-red-500 transition overflow-hidden"
      >
        {client.isPremium && (
          <div className="absolute top-4 left-0 bg-red-600 text-white text-xs px-4 py-1 rounded-r-lg">
            Premium Enterprise
          </div>
        )}

        {/* Identity + completion */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={client.avatar || "/company-placeholder.png"}
              alt={displayName}
              className="w-20 h-20 rounded-full border-4 border-red-500 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{displayName}</h1>
                {client.isPremium && <FaCheckCircle className="text-blue-500" />}
              </div>
              <p className="text-gray-400 text-sm">{displayIndustry}</p>
              <p className="text-xs text-gray-500 mt-1">{displayLocation}</p>
            </div>
          </div>

          {/* Profile completion */}
          <div className="w-full md:w-1/3">
            <p className="text-sm text-gray-400">Profile Completion</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${completion}%` }} />
              </div>
              <span className="text-xs text-gray-300">{completion}%</span>
            </div>
            <button onClick={() => setShowEditProfile(true)} className="text-xs text-red-500 hover:text-white underline mt-2">
              Complete Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(stat => (
            <StatDropdown
              key={stat.label}
              {...stat}
              isOpen={activeDropdown === stat.label}
              onToggle={() => setActiveDropdown(prev => prev === stat.label ? null : stat.label)}
            />
          ))}
        </div>

        {/* Alerts button */}
        <div className="mt-8">
          <button
            onClick={() => setShowPopup(true)}
            className="relative px-6 py-2 border border-gray-600 rounded-lg hover:border-gray-400 transition text-sm text-white"
          >
            View Alerts
            {alertCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 min-w-[20px] text-center">
                {alertCount}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showEditProfile && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-gray-900 rounded-xl w-full max-w-3xl p-6 border border-gray-700"
            >
              <EditClientProfileForm user={client} onClose={() => setShowEditProfile(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showPopup && <ReviewPopupContainer isOpen onClose={() => setShowPopup(false)} />}

      <UserGuide
        storageKey="lamid-client-profile-header-guide"
        steps={profileHeaderGuide}
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </>
  );
}
