"use client";

import { useState } from "react";
import { ClientProfile } from "@/types/client";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Pencil, Shield, Bell, Users, CreditCard } from "lucide-react";

interface ClientSettingsProps {
  client: ClientProfile;
  isPremium?: boolean;
}

export default function ClientSettings({
  client,
  isPremium = false,
}: ClientSettingsProps) {
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    companyName: client.companyname || "",
    industry: client.industry || "",
    location: client.location || "",
    password: "",
    newPassword: "",
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    toast.success("Settings saved successfully!");
    // ✅ Call backend API here
  };

  const fadeSlide = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="p-6 space-y-8 w-full text-white">
      <motion.h1
        variants={fadeSlide}
        initial="hidden"
        animate="visible"
        className="text-3xl font-bold"
      >
        Client Settings
      </motion.h1>

      {/* Profile Section */}
      <motion.section
        variants={fadeSlide}
        initial="hidden"
        animate="visible"
        className="bg-gray-900 border border-gray-800 rounded-md p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Pencil className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-semibold">Profile Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Contact Name"
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700 w-full"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700 w-full"
          />
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company Name"
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700 w-full"
          />
          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="Industry"
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700 w-full"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700 w-full"
          />
        </div>
      </motion.section>

      {/* Security Section */}
      <motion.section
        variants={fadeSlide}
        initial="hidden"
        animate="visible"
        className="bg-gray-900 border border-gray-800 rounded-md p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-semibold">Security</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Current Password"
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700 w-full"
          />
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700 w-full"
          />
        </div>
      </motion.section>

      {/* Notifications Section */}
      <motion.section
        variants={fadeSlide}
        initial="hidden"
        animate="visible"
        className="bg-gray-900 border border-gray-800 rounded-md p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="w-5 h-5 rounded bg-gray-800 border border-gray-700 accent-red-600"
          />
          Enable Email Notifications
        </label>
      </motion.section>

      {/* Team Management */}
      <motion.section
        variants={fadeSlide}
        initial="hidden"
        animate="visible"
        className="bg-gray-900 border border-gray-800 rounded-md p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-semibold">Team Management</h2>
        </div>
        <p className="text-gray-400">
          Add, remove or manage team members and assign roles.
        </p>
        <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">
          Manage Team
        </button>
      </motion.section>

      {/* Premium Features */}
      {isPremium && (
        <motion.section
          variants={fadeSlide}
          initial="hidden"
          animate="visible"
          className="bg-gray-900 border border-yellow-600 rounded-md p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-semibold text-yellow-400">
              Premium Features
            </h2>
          </div>
          <p className="text-gray-400">
            Access AI consultant recommendations, analytics, priority support,
            and advanced project settings.
          </p>
          <button className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700 text-black">
            Manage Premium Settings
          </button>
        </motion.section>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-red-600 rounded hover:bg-red-700 text-white font-semibold"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
}
