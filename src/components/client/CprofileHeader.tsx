"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Edit, MessageCircle, ChevronDown } from "lucide-react";
import { ClientProfile } from "@/types/client";
import { Project, Milestone } from "@/types/project";
import { mockClients } from "@/mocks/mockClient";

interface ProjectStats {
  total?: number;
  completed?: number;
  ongoing?: number;
  suspended?: number;
}

interface ProfileHeaderProps {
  client?: ClientProfile | null;
  projectStats?: ProjectStats;
  loading?: boolean;
}

const Button = ({
  children,
  onClick,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline";
  className?: string;
}) => {
  const base =
    "px-3 py-2 rounded-md font-medium text-sm transition-all flex items-center gap-2";
  const styles =
    variant === "outline"
      ? "bg-transparent border border-gray-600 text-white hover:bg-gray-700"
      : "bg-red-600 text-white hover:bg-red-500";
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
};

// ✅ Project Card
const ProjectCard = ({ project }: { project: Project }) => {
  const milestones: Milestone[] = project.milestones ?? [];
  const completionRate =
    milestones.length > 0
      ? Math.round(
          milestones.reduce((acc, m) => acc + (m.progress ?? 0), 0) /
            milestones.length
        )
      : 0;

  const progressColor =
    completionRate >= 80
      ? "bg-green-500"
      : completionRate >= 50
      ? "bg-yellow-500"
      : completionRate > 0
      ? "bg-orange-500"
      : "bg-red-500";

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-white font-semibold text-sm">{project.title}</h4>
        <span className="text-xs text-gray-400">
          {completionRate}% Complete
        </span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
        <motion.div
          className={`${progressColor} h-full`}
          style={{ width: `${completionRate}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${completionRate}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Milestones */}
      <div className="space-y-1">
        {milestones.map((ms) => {
          const msProgress = ms.progress ?? 0;
          const msColor =
            msProgress >= 100
              ? "bg-green-500"
              : msProgress >= 50
              ? "bg-yellow-500"
              : msProgress > 0
              ? "bg-orange-500"
              : "bg-red-500";

          return (
            <div key={ms.id}>
              <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                <span>{ms.title}</span>
                <span>{msProgress}%</span>
              </div>
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`${msColor} h-full`}
                  style={{ width: `${msProgress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${msProgress}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function ProfileHeader({
  client = null,
  projectStats,
}: ProfileHeaderProps) {
  const [selectedType, setSelectedType] = useState<
    "team" | "individual" | null
  >(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSelectedType(null);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  // ✅ Escape key closes dropdown
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedType(null);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ✅ Use mock data if no client passed in
  const activeClient: ClientProfile = client ?? mockClients[0];

  // Editable states
  const [bio, setBio] = useState(activeClient.bio ?? "");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [avatar, setAvatar] = useState(
    activeClient.avatar ?? "/images/default-avatar.png"
  );

  // ✅ Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  // ✅ Collect projects based on selected type
  const projects: Project[] =
    selectedType === "team"
      ? activeClient.teamMembers?.flatMap((m) => m.projects ?? []) ?? []
      : selectedType === "individual"
      ? activeClient.consultants?.flatMap((c) => c.projects ?? []) ?? []
      : [];

  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 px-6 py-6 lg:grid lg:grid-cols-3 gap-6 flex flex-col relative overflow-x-hidden">
      {/* Profile Info */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 flex items-center gap-4 shadow-xl border border-red-600 backdrop-blur-sm"
      >
        {/* Avatar with upload */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-red-500 shadow-lg group">
          <Image
            src={avatar}
            alt={activeClient.name ?? "Client Avatar"}
            fill
            className="object-cover"
          />
          <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer text-white text-xs">
            Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
          {activeClient.isPremium && (
            <span className="absolute bottom-0 right-0 bg-yellow-400 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
              <Star className="w-3 h-3 text-black" />
            </span>
          )}
        </div>

        {/* User Info */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white">
            {activeClient.username || activeClient.name}
          </h2>
          <p className="text-sm text-gray-400">{activeClient.email}</p>

          {/* Editable Bio */}
          {isEditingBio ? (
            <textarea
              aria-label="Edit Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              onBlur={() => setIsEditingBio(false)}
              className="mt-1 text-sm text-gray-200 bg-gray-700 rounded-md p-2 resize-none"
              rows={2}
              autoFocus
            />
          ) : (
            <p
              className="text-sm text-gray-500 mt-1 line-clamp-2 cursor-pointer flex items-center gap-1"
              onClick={() => setIsEditingBio(true)}
            >
              {bio || "Click to add a bio"}
              <Edit size={14} className="inline-block text-gray-400" />
            </p>
          )}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 flex flex-col justify-center items-center gap-3 shadow-xl border border-red-600 backdrop-blur-sm"
      >
        <div className="flex gap-2 flex-wrap justify-center">
          <Button variant="outline">
            <Edit size={16} /> Edit Profile
          </Button>
          <Button>
            <MessageCircle size={16} /> Message
          </Button>
        </div>
        {activeClient.isPremium && (
          <div className="flex items-center gap-2 text-yellow-400 mt-2">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span className="text-sm font-medium">Premium Client</span>
          </div>
        )}
      </motion.div>

      {/* Teams / Individuals Projects */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 flex flex-col shadow-xl border border-red-600 backdrop-blur-sm relative"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2 flex-wrap">
            {["team", "individual"].map((type) => (
              <Button
                key={type}
                onClick={() =>
                  setSelectedType(
                    selectedType === type
                      ? null
                      : (type as "team" | "individual")
                  )
                }
                variant={selectedType === type ? "default" : "outline"}
                className={`rounded-full px-4 py-2 ${
                  selectedType === type
                    ? "bg-red-600 text-white"
                    : "border border-gray-500 text-gray-300"
                }`}
              >
                {type === "team" ? "Teams" : "Individuals"}{" "}
                <ChevronDown size={14} />
              </Button>
            ))}
          </div>
        </div>

        {/* AnimatePresence for smooth dropdown */}
        <AnimatePresence>
          {selectedType && (
            <motion.div
              ref={dropdownRef} // ✅ attach ref directly to dropdown
              key={selectedType}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {projects.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm mt-4">
                  No {selectedType} projects available.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
