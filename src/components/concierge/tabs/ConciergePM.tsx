"use client";

import { motion } from "framer-motion";
import { UserCheck, Mail, Phone, Calendar, MessageSquare, Star, Clock } from "lucide-react";

const PM = {
  name: "Dr. Amaka Okafor",
  title: "Senior Consultant & Dedicated PM",
  avatar: "/human-capital-icon.png",
  email: "a.okafor@lamidconsulting.com",
  phone: "+234 801 234 5678",
  availability: "Mon–Fri, 8am–6pm WAT",
  specialties: ["Sustainable Development", "NGO Strategy", "Government Relations", "Programme Management"],
  rating: 4.9,
  projectsManaged: 47,
  yearsExperience: 12,
  currentProjects: ["UNDP Community Health Programme", "Gender Equality Initiative — Lagos"],
  nextCheckIn: "Thursday, 12 June 2026 — 10:00 AM WAT",
};

const schedule = [
  { day: "Mon", slots: ["10:00", "14:00"] },
  { day: "Tue", slots: ["09:00", "11:00", "15:00"] },
  { day: "Wed", slots: ["10:00"] },
  { day: "Thu", slots: ["09:00", "13:00", "16:00"] },
  { day: "Fri", slots: ["10:00", "14:00"] },
];

export default function ConciergePM() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* PM Card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#c21219]/30 bg-[#c21219]/5 p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-black/40 flex items-center justify-center">
            <UserCheck className="h-8 w-8 text-[#c21219]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-lg font-bold text-white">{PM.name}</p>
              <span className="text-xs bg-[#c21219]/20 text-[#c21219] border border-[#c21219]/30 px-2 py-0.5 rounded-full">Your PM</span>
            </div>
            <p className="text-sm text-gray-400">{PM.title}</p>

            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400" />{PM.rating}/5.0</span>
              <span>{PM.projectsManaged} projects managed</span>
              <span>{PM.yearsExperience} yrs experience</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          {[
            { icon: Mail,     label: PM.email },
            { icon: Phone,    label: PM.phone },
            { icon: Clock,    label: PM.availability },
          ].map(({ icon: Icon, label }, i) => (
            <motion.div key={i}
              whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 cursor-default">
              <Icon className="h-3.5 w-3.5 text-[#c21219] flex-shrink-0" />
              <p className="text-xs text-gray-300 truncate">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Specialties */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">Specialties</p>
          <div className="flex flex-wrap gap-2">
            {PM.specialties.map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">{s}</span>
            ))}
          </div>
        </div>

        {/* Action */}
        <div className="mt-5 flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c21219] hover:bg-red-700 text-white text-sm font-semibold transition">
            <MessageSquare className="h-4 w-4" />Message PM
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm transition">
            <Calendar className="h-4 w-4" />Schedule Call
          </button>
        </div>
      </motion.div>

      {/* Next check-in */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4">
        <p className="text-xs text-gray-400 mb-1">Next scheduled check-in</p>
        <p className="text-sm font-semibold text-white">{PM.nextCheckIn}</p>
      </motion.div>

      {/* Current projects */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-semibold text-white mb-3">Projects currently managed</p>
        <ul className="space-y-2">
          {PM.currentProjects.map((p, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c21219] flex-shrink-0" />{p}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Availability schedule */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-semibold text-white mb-4">Weekly availability</p>
        <div className="grid grid-cols-5 gap-2">
          {schedule.map((day) => (
            <div key={day.day} className="text-center">
              <p className="text-xs text-gray-500 mb-2">{day.day}</p>
              <div className="space-y-1">
                {day.slots.map(slot => (
                  <button key={slot}
                    className="block w-full text-[10px] py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition">
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
