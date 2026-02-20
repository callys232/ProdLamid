"use client";
import { useState } from "react";

interface ExtrasStepProps {
  purpose: string;
  setPurpose: (val: string) => void;
  extraField: string;
  setExtraField: (val: string) => void;
  errors: Record<string, string>;
  images: File[];
  setImages: (files: File[]) => void;
}

export default function ExtrasStep({
  purpose,
  setPurpose,
  extraField,
  setExtraField,
  errors,
  images,
  setImages,
}: ExtrasStepProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const existingNames = images.map((f) => f.name);

    const duplicates = newFiles.filter((f) => existingNames.includes(f.name));
    if (duplicates.length > 0) {
      setLocalError("Some files were already added.");
      return;
    }

    const invalids = newFiles.filter(
      (f) => !f.type.startsWith("image/")
    );
    if (invalids.length > 0) {
      setLocalError("Only image files are allowed.");
      return;
    }

    setImages([...images, ...newFiles]);
    setLocalError(null);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Purpose Box */}
      <div>
        <label
          htmlFor="purpose"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Project Purpose
        </label>
        <textarea
          id="purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
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
        <label
          htmlFor="extraField"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Extra Field (Optional)
        </label>
        <input
          id="extraField"
          type="text"
          value={extraField}
          onChange={(e) => setExtraField(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
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

      {/* Image Upload */}
      <div>
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Project Images
        </label>
        <input
          id="images"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500"
        />
        {localError && (
          <p className="text-red-500 text-xs mt-1">{localError}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Project image ${index + 1}`}
                className="w-24 h-24 object-cover rounded-md border"
              />
              <button
                type="button"
                aria-label={`Remove image ${file.name}`}
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
