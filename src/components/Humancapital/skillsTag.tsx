"use client";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "./../../utils/motionVaraints";

const skills = [
  {
    text: "STRATEGY",
    tip: "Planning long-term direction and execution",
    color: "bg-blue-500",
    hover: "bg-blue-700",
  },
  {
    text: "SOFT SKILLS",
    tip: "Communication, teamwork, adaptability",
    color: "bg-green-500",
    hover: "bg-green-700",
  },
  {
    text: "LEADERSHIP",
    tip: "Inspiring and guiding teams effectively",
    color: "bg-purple-500",
    hover: "bg-purple-700",
  },
  {
    text: "MANAGEMENT",
    tip: "Supervising tasks, people, and outcomes",
    color: "bg-pink-500",
    hover: "bg-pink-700",
  },
  {
    text: "ENTREPRENEURSHIP",
    tip: "Building ventures through innovation and risk",
    color: "bg-yellow-500",
    hover: "bg-yellow-700",
  },
  {
    text: "MARKETING",
    tip: "Creating value and connecting with audiences",
    color: "bg-red-500",
    hover: "bg-red-700",
  },
  {
    text: "SALES",
    tip: "Converting prospects into revenue",
    color: "bg-indigo-500",
    hover: "bg-indigo-700",
  },
];

export default function SkillsTags() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="flex flex-wrap justify-center gap-3 mb-8"
    >
      {skills.map((skill) => (
        <motion.div
          key={skill.text}
          variants={fadeInUp}
          className="relative group"
        >
          {/* Skill tag */}
          <div
            className={`${skill.color} px-3 py-1 text-xs md:text-sm rounded cursor-pointer 
                        hover:shadow-lg hover:border hover:border-white/30 transition-all duration-500`}
          >
            {skill.text}
          </div>

          {/* Tooltip */}
          <div
            className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-3 py-1 text-xs rounded shadow-md 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white ${skill.hover}`}
          >
            {skill.tip}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
