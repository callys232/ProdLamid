"use client";

interface BusinessProfileOverviewProps {
  companyName: string;
  industry: string;
  location: string;
  website: string;
  companySize: string;
  description: string;
}

export default function BusinessProfileOverview({
  companyName,
  industry,
  location,
  website,
  companySize,
  description,
}: BusinessProfileOverviewProps) {
  return (
    <div className="p-6 bg-gray-950 rounded-xl border border-gray-800 shadow-lg w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Profile Overview</h2>
        <span className="px-2 py-1 text-xs rounded bg-red-600 text-white">
          Premium
        </span>
      </div>

      {/* Company Info */}
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-400">Company Name</p>
          <p className="font-medium text-white">{companyName || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Industry</p>
          <p className="font-medium text-white">{industry || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Location</p>
          <p className="font-medium text-white">{location || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Website</p>
          {website ? (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:underline"
            >
              {website}
            </a>
          ) : (
            <p className="font-medium text-white">—</p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-400">Company Size</p>
          <p className="font-medium text-white">{companySize || "—"}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-800" />

      {/* Description */}
      <div>
        <p className="text-xs text-gray-400 mb-1">About</p>
        <p className="text-sm text-gray-300 leading-relaxed">
          {description || "No description provided yet."}
        </p>
      </div>
    </div>
  );
}
