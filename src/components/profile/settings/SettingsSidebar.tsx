"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  Shield,
  CreditCard,
  Upload,
  Trash,
  FileText,
  Cpu,
  Building2,
  Briefcase,
  Lock,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  guideSteps?: GuideStep[];
}

type GuideStep = {
  target: string;
  tabKey: string;
  title: string;
  description: string;
};

type TabItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  guideTarget?: string;
};

export default function SettingsSidebar({
  activeTab,
  setActiveTab,
  guideSteps = [],
}: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tabs: TabItem[] = [
    { key: "profile",    label: "Edit Profile",        icon: <User size={18} />,      guideTarget: "profile-tab" },
    { key: "employment", label: "Employment History",   icon: <Briefcase size={18} />, guideTarget: "employment-tab" },
    { key: "security",   label: "2FA / Security",       icon: <Shield size={18} />,    guideTarget: "security-tab" },
    { key: "resume", label: "Upload Resume", icon: <Upload size={18} />, guideTarget: "resume-tab" },
    { key: "business", label: "Business Profile", icon: <Building2 size={18} />, guideTarget: "business-tab" },
    { key: "tiers", label: "Tiers", icon: <Cpu size={18} />, guideTarget: "tiers-tab" },
    { key: "Contract", label: "Contract & Legal", icon: <FileText size={18} />, guideTarget: "contract-tab" },
    { key: "payment",  label: "Payment Information", icon: <CreditCard size={18} />, guideTarget: "payment-tab" },
    { key: "privacy",  label: "Privacy & Data",       icon: <Lock size={18} />,       guideTarget: "privacy-tab" },
    { key: "delete",   label: "Delete Account",        icon: <Trash size={18} />,      danger: true, guideTarget: "delete-tab" },
  ];

  const groupedTabs: TabItem[][] = [];
  for (let i = 0; i < tabs.length; i += 2) groupedTabs.push(tabs.slice(i, i + 2));

  // Only steps for current tab
  const currentTabGuideSteps = guideSteps.filter(step => step.tabKey === activeTab);

  // Scroll & spotlight effect
  useEffect(() => {
    if (!currentTabGuideSteps.length) return;
    const step = currentTabGuideSteps[currentStep];
    const el = document.querySelector(`[data-guide="${step.target}"]`) as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Lock scroll
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [currentStep, currentTabGuideSteps]);

  // Advance / go back / restart
  const nextStep = () => {
    if (!currentTabGuideSteps.length) return;
    const next = currentStep + 1;
    if (next < currentTabGuideSteps.length) {
      const nextStep = currentTabGuideSteps[next];
      if (nextStep.tabKey !== activeTab) setActiveTab(nextStep.tabKey);
      setCurrentStep(next);
    } else setCurrentStep(0); // restart
  };
  const prevStep = () => setCurrentStep(currentStep > 0 ? currentStep - 1 : 0);

  const SidebarContent = (
    <div className="h-full p-2 overflow-y-auto bg-black/60 backdrop-blur-xl border-r border-red-900/40 shadow-[inset_0_0_30px_rgba(193,33,41,0.2)] scrollbar-thin scrollbar-track-black/10 scrollbar-thumb-red-900/60">
      {groupedTabs.map((group, idx) => (
        <div key={idx} className="mb-4 rounded-lg border border-red-900/30 bg-black/40 overflow-hidden">
          <ul>
            {group.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <motion.li
                  key={tab.key}
                  data-guide={tab.guideTarget}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => { setActiveTab(tab.key); setOpen(false); }}
                  initial={false}
                  whileHover={!isActive ? { scale: 1.03, x: 6, transition: { type: "spring", stiffness: 200, damping: 18 } } : undefined}
                  className={`relative px-4 py-3 cursor-pointer flex items-center gap-3 rounded-md select-none transition-all duration-200 ${isActive ? "text-white font-medium" : tab.danger ? "text-red-400 hover:text-red-300" : "text-gray-300 hover:text-white"
                    }`}
                >
                  {!isActive && <motion.div className="absolute inset-0 bg-[#c12129]/20 opacity-0 rounded-md" whileHover={{ opacity: 0.22, scale: 1.01 }} transition={{ duration: 0.15 }} />}
                  {isActive && (
                    <>
                      <motion.div layoutId="left-glow" className="absolute left-0 top-0 h-full w-1 bg-[#c12129] shadow-[0_0_15px_3px_rgba(193,33,41,0.6)]" transition={{ type: "spring", duration: 0.55 }} />
                      <motion.div layoutId="sidebar-highlight" className="absolute inset-0 bg-[#c12129]/25 backdrop-blur-sm -z-10 rounded-md" transition={{ type: "spring", duration: 0.4 }} />
                      <motion.div className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#c12129]" animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }} transition={{ repeat: Infinity, duration: 1.8 }} />
                    </>
                  )}
                  <span className="relative z-10">{tab.icon}</span>
                  <span className="relative z-10 text-sm">{tab.label}</span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* Guide Controls */}
      {currentTabGuideSteps.length > 0 && (
        <div className="mt-4 flex justify-between items-center px-2">
          <button onClick={prevStep} disabled={currentStep === 0} className="text-gray-400 disabled:opacity-30">Previous</button>
          <div className="flex gap-2">
            <button onClick={() => setCurrentStep(0)} className="text-gray-400 hover:text-white">Restart Tour</button>
            <button onClick={nextStep} className="bg-[#c12129] px-3 py-1 rounded-md text-white">{currentStep === currentTabGuideSteps.length - 1 ? "Finish" : "Next"}</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden p-2 flex justify-between items-center">
        <button onClick={() => setOpen(true)} className="text-white flex items-center gap-2">
          <Menu size={24} /> Menu
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64">{SidebarContent}</div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 120, damping: 18 }} className="fixed inset-y-0 left-0 w-64 z-[999] bg-black/70 backdrop-blur-xl">
            <button aria-label="Close" onClick={() => setOpen(false)} className="absolute top-4 right-4 text-white"><X size={26} /></button>
            {SidebarContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-[998] md:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}