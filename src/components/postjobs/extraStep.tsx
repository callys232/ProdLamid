"use client";

interface ExtrasStepProps {
  comment: string;
  setComment: (val: string) => void;
  extraField: string;
  setExtraField: (val: string) => void;
  errors: Record<string, string>; // ✅ new prop for validation errors
}

export default function ExtrasStep({
  comment,
  setComment,
  extraField,
  setExtraField,
  errors,
}: ExtrasStepProps) {
  return (
    <div className="space-y-4">
      {/* Comment Box */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comments
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${
            errors.comment
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
          } focus:outline-none`}
          rows={3}
          placeholder="Add any additional notes..."
        />
        {errors.comment && (
          <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
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
          className={`w-full px-3 py-2 rounded-md border ${
            errors.extraField
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
          } focus:outline-none`}
          placeholder="Optional custom input..."
        />
        {errors.extraField && (
          <p className="text-red-500 text-xs mt-1">{errors.extraField}</p>
        )}
      </div>
    </div>
  );
}
