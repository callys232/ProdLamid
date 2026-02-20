"use client";

interface ExtrasStepProps {
  purpose: string;
  setpurpose: (val: string) => void;
  extraField: string;
  setExtraField: (val: string) => void;
  errors: Record<string, string>;

}

export default function ExtrasStep({
  purpose,
  setpurpose,
  extraField,
  setExtraField,
  errors,
}: ExtrasStepProps) {
  return (
    <div className="space-y-4">
      {/* purpose Box */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Purpose
        </label>
        <textarea
          value={purpose}
          onChange={(e) => setpurpose(e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.purpose
            ? "border-red-500 focus:ring-red-500"
            : "border-[#c21219] focus:ring-[#c21219]"
            } focus:outline-none`}
          rows={3}
          placeholder="What is the purpose of this project?"
        />
        {errors.purpose && (
          <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>
        )}
      </div>

      {/* Extra Optional Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Extra Field (Optional)
        </label>
        <input
          type="text"
          value={extraField}
          onChange={(e) => setExtraField(e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.extraField
            ? "border-red-500 focus:ring-red-500"
            : "border-[#c21219] focus:ring-[#c21219]"
            } focus:outline-none`}
          placeholder="Optional information..."
        />
        {errors.extraField && (
          <p className="text-red-500 text-xs mt-1">{errors.extraField}</p>
        )}
      </div>
    </div>
  );
}
