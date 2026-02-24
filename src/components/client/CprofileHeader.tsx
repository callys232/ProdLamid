"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Edit, MessageCircle, ChevronDown } from "lucide-react";
import { ClientProfile } from "@/types/client";
import { Project, Milestone } from "@/types/project";
import { mockClients } from "@/mocks/mockClient";
import { UserGuide } from "@/components/Guides/UserGuide";
import { clientProfileHeaderGuide } from "@/lib/UserGuide/clientProfileGuide";

interface ProjectStats {
  total?: number;
  completed?: number;
  ongoing?: number;
  suspended?: number;
}

interface ProfileHeaderProps {
  client?: any;
  projectStats?: ProjectStats;
  loading?: boolean;
}

/* ---------------- Button ---------------- */

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

/* ---------------- Project Card ---------------- */

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

      <div className="space-y-1">
        {milestones.map((ms) => {
          const msProgress = ms.progress ?? 0;

          return (
            <div key={ms.id}>
              <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                <span>{ms.title}</span>
                <span>{msProgress}%</span>
              </div>
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="bg-blue-500 h-full"
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

/* ---------------- Main Component ---------------- */

export default function ProfileHeader({
  client = null,
  projectStats,
}: ProfileHeaderProps) {
  const [selectedType, setSelectedType] = useState<
    "team" | "individual" | null
  >(null);

  /* ---------- Guide Logic ---------- */

  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem(
      "lamid-client-profile-guide"
    );
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
  }, []);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const activeClient: any = client
    ? {
      ...client,
      name: client.profile?.firstName
        ? `${client.profile.firstName} ${client.profile.lastName || ""
        }`
        : client.username || client.email || "Client",
      bio: client.profile?.bio || "",
      avatar: client.profile?.profilePicture || "/avatar.png",
      isPremium: true,
      projects: client.projects || [],
      consultants: client.consultants || [],
      teamMembers: client.teamMembers || [],
    }
    : mockClients[0];

  const [bio, setBio] = useState(activeClient.bio ?? "");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [avatar, setAvatar] = useState(activeClient.avatar);

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const projects: Project[] =
    selectedType === "team"
      ? activeClient.teamMembers?.flatMap(
        (m: any) => m.projects ?? []
      ) ?? []
      : selectedType === "individual"
        ? activeClient.consultants?.flatMap(
          (c: any) => c.projects ?? []
        ) ?? []
        : [];

  return (
    <div
      data-guide="client-profile-container"
      className="w-full bg-gray-900 border-b border-gray-800 px-6 py-6 lg:grid lg:grid-cols-3 gap-6 flex flex-col relative"
    >
      {/* Start Guide Button */}
      <div className="absolute hover:border-red-500 top-5 right-6 z-20">
        <Button
          variant="outline"
          onClick={() => setShowGuide(true)}
        >
          Start Guide
        </Button>
      </div>

      {/* Profile Info */}
      <motion.div
        data-guide="client-profile-info"
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 flex items-center gap-4 shadow-xl border border-red-600"
      >
        <div
          data-guide="client-avatar"
          className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-red-500 group"
        >
          <Image
            src={avatar}
            alt="Client Avatar"
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
            <span
              data-guide="client-premium-status"
              className="absolute bottom-0 right-0 bg-yellow-400 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center"
            >
              <Star className="w-3 h-3 text-black" />
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white">
            {activeClient.username || activeClient.name}
          </h2>
          <p className="text-sm text-gray-400">
            {activeClient.email}
          </p>

          <div data-guide="client-bio">
            {isEditingBio ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onBlur={() => setIsEditingBio(false)}
                className="mt-1 text-sm text-gray-200 bg-gray-700 rounded-md p-2 resize-none"
                rows={2}
                autoFocus
              />
            ) : (
              <p
                className="text-sm text-gray-500 mt-1 cursor-pointer flex items-center gap-1"
                onClick={() => setIsEditingBio(true)}
              >
                {bio || "Click to add a bio"}
                <Edit size={14} />
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        data-guide="client-actions"
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 flex flex-col justify-center items-center gap-3 shadow-xl border border-red-600"
      >
        <div className="flex gap-2 flex-wrap justify-center">
          <Button variant="outline">
            <Edit size={16} /> Edit Profile
          </Button>
          <Button>
            <MessageCircle size={16} /> Message
          </Button>
        </div>
      </motion.div>

      {/* Projects */}
      <motion.div
        data-guide="client-project-display"
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 flex flex-col shadow-xl border border-red-600"
      >
        <div
          data-guide="client-project-filters"
          className="flex gap-2 flex-wrap"
        >
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
              variant={
                selectedType === type ? "default" : "outline"
              }
              className="rounded-full px-4 py-2"
            >
              {type === "team"
                ? "Teams"
                : "Individuals"}{" "}
              <ChevronDown size={14} />
            </Button>
          ))}
        </div>

        <AnimatePresence>
          {selectedType && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4"
            >
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  No {selectedType} projects available.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Guide */}
      <UserGuide
        storageKey="lamid-client-profile-guide"
        steps={clientProfileHeaderGuide}
        isOpen={showGuide}
        onClose={() => {
          localStorage.setItem(
            "lamid-client-profile-guide",
            "true"
          );
          setShowGuide(false);
        }}
      />
    </div>
  );
}