"use client";

import { useState } from "react";

// Core settings tabs
import SettingsSidebar from "./SettingsSidebar";
import EditProfileForm from "./EditProfileForm";
import SecuritySettings from "./SecuritySettings";
import PaymentInformation from "./payment";
import UploadResume from "./UploadResume";
import DeleteAccount from "./DeleteAccount";

// Business + AI features
import BusinessProfile from "./premium/BusinessProfile";
import AIPreferences from "./premium/AIPreferences";
import OnboardingAssistant from "./premium/OnboardingAssistant";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "business", label: "Business Profile" },
    { key: "ai", label: "AI Preferences" },
    { key: "onboarding", label: "Onboarding Assistant" },
    { key: "security", label: "Security" },
    { key: "payment", label: "Payment Info" },
    { key: "resume", label: "Upload Resume" },
    { key: "delete", label: "Delete Account" },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <EditProfileForm />;
      case "business":
        return <BusinessProfile />;
      case "ai":
        return <AIPreferences />;
      case "onboarding":
        return <OnboardingAssistant />;
      case "security":
        return <SecuritySettings />;
      case "payment":
        return <PaymentInformation />;
      case "resume":
        return <UploadResume />;
      case "delete":
        return <DeleteAccount />;
      default:
        return <EditProfileForm />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-black text-white">
      {/* Mobile Dropdown */}
      <div className="md:hidden border-b border-gray-800 p-3 bg-gray-900/40">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full flex justify-between items-center px-4 py-2 bg-gray-800 rounded-lg"
        >
          <span>{tabs.find((t) => t.key === activeTab)?.label}</span>
          <span className="text-gray-300">{mobileMenuOpen ? "▲" : "▼"}</span>
        </button>

        {mobileMenuOpen && (
          <div className="mt-2 bg-gray-900 rounded-lg border border-gray-800">
            {tabs.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 hover:bg-gray-800 ${
                  activeTab === item.key
                    ? "bg-gray-800 text-red-500"
                    : "text-gray-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside
        className="
        hidden md:block 
        w-full md:w-64 
        border-r border-gray-800 
        bg-gray-900/40 backdrop-blur-xl 
        sticky top-0 h-screen
      "
      >
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* Content */}
      <main
        className="
        flex-1 
        p-4 sm:p-6 md:p-10 
        overflow-y-auto 
        flex justify-center
      "
      >
        <div
          className="
            w-full max-w-3xl 
            bg-gray-900/40 border border-gray-800 
            rounded-xl p-5 sm:p-6 md:p-8
            shadow-[0_0_25px_rgba(193,33,41,0.15)]
            backdrop-blur-xl transition-all 
            min-h-[75vh]
          "
        >
          {renderTab()}
        </div>
      </main>
    </div>
  );
}
