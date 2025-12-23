interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
}: SidebarProps) {
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "settings", label: "Settings" },
    { key: "teams", label: "Teams" },
    { key: "notifications", label: "Notifications" },
    { key: "escrow", label: "Escrow" },
    // { key: "Project", label: "projectEscrow" },
  ];

  return (
    <nav className="h-full p-2">
      <ul>
        {tabs.map((tab) => (
          <li
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 cursor-pointer transition-colors rounded-md ${
              activeTab === tab.key
                ? "bg-red-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </nav>
  );
}
