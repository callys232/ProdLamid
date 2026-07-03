"use client";

interface UserShape {
  profile?: {
    bio?: string;
    profilePicture?: string;
    skills?: string[];
  };
  businessProfile?: {
    employmentHistory?: any[];
  };
  paymentInfo?: any;
}

interface Props {
  user: UserShape;
  hasPortfolio: boolean;
  hasCompletedProject: boolean;
}

interface CheckItem {
  label: string;
  weight: number;
  done: boolean;
  settingsSection?: string;
}

function CircularProgress({ pct }: { pct: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color =
    pct >= 80 ? "#34d399"   // emerald
    : pct >= 50 ? "#f59e0b" // amber
    : "#C12129";             // LAMID red

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="rotate-[-90deg]">
      {/* Track */}
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        stroke="#1f2937"
        strokeWidth="10"
      />
      {/* Progress */}
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      {/* Center text — rotated back */}
      <text
        x="70"
        y="70"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="22"
        fontWeight="bold"
        style={{ transform: "rotate(90deg)", transformOrigin: "70px 70px" }}
      >
        {pct}%
      </text>
    </svg>
  );
}

export default function ProfileCompletionScore({ user, hasPortfolio, hasCompletedProject }: Props) {
  const items: CheckItem[] = [
    {
      label: "Profile photo",
      weight: 15,
      done: !!(user.profile?.profilePicture),
      settingsSection: "settings",
    },
    {
      label: "Bio / description",
      weight: 15,
      done: !!(user.profile?.bio && user.profile.bio.trim().length > 10),
      settingsSection: "settings",
    },
    {
      label: "Skills listed (min 3)",
      weight: 15,
      done: !!(user.profile?.skills && user.profile.skills.length >= 3),
      settingsSection: "settings",
    },
    {
      label: "Employment history",
      weight: 10,
      done: !!(user.businessProfile?.employmentHistory && user.businessProfile.employmentHistory.length > 0),
      settingsSection: "settings",
    },
    {
      label: "Payment info set up",
      weight: 15,
      done: !!(user.paymentInfo),
      settingsSection: "settings",
    },
    {
      label: "Resume uploaded",
      weight: 10,
      done: false, // resolved server-side; default false in MVP
      settingsSection: "settings",
    },
    {
      label: "Portfolio item added",
      weight: 10,
      done: hasPortfolio,
      settingsSection: "portfolio",
    },
    {
      label: "First project completed",
      weight: 10,
      done: hasCompletedProject,
      settingsSection: "projects",
    },
  ];

  const pct = items.filter((i) => i.done).reduce((s, i) => s + i.weight, 0);
  const completedCount = items.filter((i) => i.done).length;
  const label =
    pct === 100 ? "Profile complete!" :
    pct >= 80 ? "Almost there!" :
    pct >= 50 ? "Making progress" :
    "Just getting started";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Profile Completion</h2>

      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {/* Circular chart */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <CircularProgress pct={pct} />
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-gray-500">{completedCount}/{items.length} items done</p>
        </div>

        {/* Checklist */}
        <div className="flex-1 w-full">
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.done ? "bg-emerald-900/50 text-emerald-400" : "bg-gray-800 text-gray-600"
                  }`}>
                    {item.done ? "✓" : "○"}
                  </span>
                  <span className={`text-sm truncate ${item.done ? "text-gray-300 line-through decoration-gray-600" : "text-white"}`}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-500">{item.weight}%</span>
                  {!item.done && item.settingsSection && (
                    <button
                      type="button"
                      onClick={() => {
                        // Emit a custom event — profileDashboard listens and switches tab
                        window.dispatchEvent(new CustomEvent("lamid:setTab", { detail: item.settingsSection }));
                      }}
                      className="text-xs text-[#C12129] hover:text-red-400 transition font-medium"
                    >
                      Fix →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {pct < 100 && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("lamid:setTab", { detail: "settings" }));
                }}
                className="rounded-xl px-4 py-2 text-sm font-semibold bg-[#C12129] text-white hover:bg-red-700 transition"
              >
                Complete your profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
