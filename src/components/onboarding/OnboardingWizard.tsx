"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ArrowRight, CheckCircle2, Briefcase, User, Building2, LayoutDashboard, Sparkles, Users } from "lucide-react";
import type { AuthUser } from "@/hooks/useAuth";

interface Props {
  user: AuthUser;
  onComplete: () => void;
}

const TOTAL_STEPS = 4;

// ── Account type badge colours ────────────────────────────────────
const TYPE_BADGE: Record<string, string> = {
  Client:     "bg-blue-600/20 text-blue-400 border-blue-600/30",
  Freelancer: "bg-emerald-600/20 text-emerald-400 border-emerald-600/30",
  Enterprise: "bg-purple-600/20 text-purple-400 border-purple-600/30",
  Concierge:  "bg-amber-600/20 text-amber-400 border-amber-600/30",
  Admin:      "bg-blue-600/20 text-blue-400 border-blue-600/30",
};

// ── Step indicator dots ───────────────────────────────────────────
function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width:           i === current ? 24 : 8,
            backgroundColor: i <= current ? "#2563EB" : "rgba(255,255,255,0.15)",
          }}
          transition={{ duration: 0.3 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}

// ── Step 1 — Welcome ─────────────────────────────────────────────
function StepWelcome({ user, onNext }: { user: AuthUser; onNext: () => void }) {
  const firstName = user.name.split(" ")[0];
  const type      = user.accountType ?? "Client";
  const badgeCls  = TYPE_BADGE[type] ?? TYPE_BADGE.Client;

  return (
    <div className="flex flex-col items-center text-center gap-6">
      {/* Logo mark */}
      <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-[#2563EB]" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-[var(--font-space-grotesk)]">
          Welcome to LAMID ONE,{" "}
          <span className="text-[#2563EB]">{firstName}</span>
        </h1>
        <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
          Let&apos;s set up your workspace in 3 quick steps.
        </p>
      </div>

      {/* Account type badge */}
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${badgeCls}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
        {type}
      </span>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="mt-2 flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white text-sm font-semibold shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:bg-[#a01820] transition-colors"
      >
        Let&apos;s go <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

// ── Step 2 — Profile setup ───────────────────────────────────────
const CLIENT_CATEGORIES = [
  "Strategy", "Finance", "Technology", "HR", "Marketing", "Legal",
];

function StepProfile({
  user,
  onNext,
  onSkip,
}: {
  user: AuthUser;
  onNext: (data: unknown) => void;
  onSkip: () => void;
}) {
  const [selected, setSelected]   = useState<string[]>([]);
  const [skills,   setSkills]     = useState("");
  const [orgName,  setOrgName]    = useState("");
  const type = user.accountType ?? "Client";

  const toggleCategory = (cat: string) =>
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const handleNext = () => {
    if (type === "Client")     onNext({ categories: selected });
    if (type === "Freelancer") onNext({ skills });
    if (type === "Enterprise") onNext({ orgName });
    else                       onNext({});
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-white font-[var(--font-space-grotesk)]">
          Complete Your Profile
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Tell us a bit more so we can personalise your experience.
        </p>
      </div>

      {/* Client — category checkboxes */}
      {type === "Client" && (
        <div className="space-y-2">
          <p className="text-sm text-gray-300 font-medium">
            What type of projects do you need help with?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {CLIENT_CATEGORIES.map((cat) => {
              const active = selected.includes(cat);
              return (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                    active
                      ? "bg-[#2563EB]/15 border-[#2563EB]/50 text-white"
                      : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                      active ? "bg-[#2563EB] border-[#2563EB]" : "border-white/20"
                    }`}
                  >
                    {active && (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    )}
                  </span>
                  {cat}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Freelancer — skills input */}
      {type === "Freelancer" && (
        <div className="space-y-2">
          <label className="text-sm text-gray-300 font-medium block">
            What are your top skills?
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. Strategy, Financial Modelling, UX Design"
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
          />
          <p className="text-[11px] text-gray-600">Separate skills with commas</p>
        </div>
      )}

      {/* Enterprise — org name */}
      {type === "Enterprise" && (
        <div className="space-y-2">
          <label className="text-sm text-gray-300 font-medium block">
            Your organisation name
          </label>
          <input
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="e.g. Acme Corporation"
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
          />
        </div>
      )}

      {/* Concierge / fallback */}
      {type !== "Client" && type !== "Freelancer" && type !== "Enterprise" && (
        <p className="text-sm text-gray-400">
          Your account is being configured by our team. We&apos;ll be in touch shortly.
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#a01820] transition-colors shadow-[0_4px_20px_rgba(37,99,235,0.3)]"
        >
          Next <ArrowRight className="w-4 h-4" />
        </motion.button>
        <button
          onClick={onSkip}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

// ── Step 3 — First Action ────────────────────────────────────────
interface ActionCard {
  icon:        React.ReactNode;
  title:       string;
  description: string;
  href:        string;
}

function getActionCard(type: string | undefined): ActionCard {
  switch (type) {
    case "Freelancer":
      return {
        icon:        <User className="w-8 h-8 text-[#2563EB]" />,
        title:       "Complete your profile",
        description: "Attract better clients with a complete profile",
        href:        "/profile",
      };
    case "Enterprise":
      return {
        icon:        <Building2 className="w-8 h-8 text-[#2563EB]" />,
        title:       "Invite your team",
        description: "Add members to your organisation",
        href:        "/enterprise",
      };
    default: // Client + Concierge + Admin
      return {
        icon:        <Briefcase className="w-8 h-8 text-[#2563EB]" />,
        title:       "Post your first project",
        description: "Find the right expert for your challenge",
        href:        "/postjobs",
      };
  }
}

function StepFirstAction({ user, onNext }: { user: AuthUser; onNext: () => void }) {
  const card = getActionCard(user.accountType);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-white font-[var(--font-space-grotesk)]">
          Your First Action
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Here&apos;s the best place to start right now.
        </p>
      </div>

      <Link href={card.href} onClick={onNext}>
        <motion.div
          whileHover={{ scale: 1.02, borderColor: "rgba(37,99,235,0.5)" }}
          className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 cursor-pointer text-center transition-colors"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center">
            {card.icon}
          </div>
          <div>
            <p className="text-white font-semibold text-base">{card.title}</p>
            <p className="text-gray-500 text-xs mt-1">{card.description}</p>
          </div>
          <span className="flex items-center gap-1.5 text-[#2563EB] text-sm font-semibold">
            Go <ArrowRight className="w-4 h-4" />
          </span>
        </motion.div>
      </Link>

      <button
        onClick={onNext}
        className="text-xs text-gray-600 hover:text-gray-400 transition-colors text-center"
      >
        I&apos;ll do this later
      </button>
    </div>
  );
}

// ── Step 4 — You're Ready ────────────────────────────────────────
const QUICK_ACCESS = [
  {
    icon:  <Sparkles className="w-5 h-5 text-[#2563EB]" />,
    label: "Intelligence Hub",
    href:  "/intelligence",
  },
  {
    icon:  <LayoutDashboard className="w-5 h-5 text-[#2563EB]" />,
    label: "Your Dashboard",
    href:  "/dashboard",
  },
  {
    icon:  <Users className="w-5 h-5 text-[#2563EB]" />,
    label: "Browse Talent",
    href:  "/talent",
  },
];

function StepReady({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-6">
      <div className="w-16 h-16 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-[#2563EB]" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white font-[var(--font-space-grotesk)]">
          Your workspace is ready
        </h2>
        <p className="text-sm text-gray-400 max-w-xs mx-auto">
          Here are some quick links to get you moving.
        </p>
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        {QUICK_ACCESS.map((item) => (
          <Link key={item.label} href={item.href} onClick={onComplete}>
            <motion.div
              whileHover={{ scale: 1.05, borderColor: "rgba(37,99,235,0.4)" }}
              className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3.5 cursor-pointer transition-colors"
            >
              {item.icon}
              <span className="text-[11px] text-gray-300 font-medium leading-tight text-center">
                {item.label}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onComplete}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white text-sm font-semibold shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:bg-[#a01820] transition-colors"
      >
        Explore LAMID ONE <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

// ── Slide variants ────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({
    x:       dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x:       0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x:       dir > 0 ? -60 : 60,
    opacity: 0,
  }),
};

// ── Main wizard ───────────────────────────────────────────────────
export default function OnboardingWizard({ user, onComplete }: Props) {
  const [step, setStep]         = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const handleComplete = () => {
    localStorage.setItem("lamid_onboarding_done", "true");
    onComplete();
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="onboarding-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center p-4"
        style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(0,0,0,0.75)" }}
      >
        {/* Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1,   opacity: 1, y: 0  }}
          exit={{    scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d0f] shadow-[0_32px_80px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Top gradient strip */}
          <div className="h-1 w-full bg-gradient-to-r from-[#2563EB] via-[#e03040] to-[#7f0d11]" />

          {/* Dismiss button */}
          <button
            onClick={handleComplete}
            aria-label="Close onboarding"
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/10 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-8 pt-6">
            <StepDots current={step} />

            {/* Animated step content */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
                >
                  {step === 0 && (
                    <StepWelcome user={user} onNext={goNext} />
                  )}
                  {step === 1 && (
                    <StepProfile user={user} onNext={goNext} onSkip={goNext} />
                  )}
                  {step === 2 && (
                    <StepFirstAction user={user} onNext={goNext} />
                  )}
                  {step === 3 && (
                    <StepReady onComplete={handleComplete} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
