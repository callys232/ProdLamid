
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

interface ExtrasStepProps {
  purpose: string;
  setPurpose: (val: string) => void;
  extraField: string;
  setExtraField: (val: string) => void;
  errors: Record<string, string>;
  images: File[];
  setImages: (files: File[]) => void;
  maxFiles?: number;
  maxFileSizeMB?: number;
}

interface Preview {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}



export default function ExtrasStep({
  purpose,
  setPurpose,
  extraField,
  setExtraField,
  errors,
  images,
  setImages,
  maxFiles = 8,
  maxFileSizeMB = 10,
}: ExtrasStepProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const previews = useMemo<Preview[]>(
    () =>
      images.map((file, i) => ({
        id: `${file.name}-${file.size}-${i}`,
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
      })),
    [images]
  );

  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        try {
          URL.revokeObjectURL(p.url);
        } catch {
          /* ignore */
        }
      });
    };
  }, [previews.length]);

  const handleFiles = (files: File[]) => {
    setLocalError(null);

    if (!files || files.length === 0) return;

    if (images.length + files.length > maxFiles) {
      setLocalError(`You can upload up to ${maxFiles} images.`);
      return;
    }

    const existingSignatures = new Set(images.map((f) => `${f.name}-${f.size}`));

    const invalids = files.filter((f) => !f.type.startsWith("image/"));
    if (invalids.length > 0) {
      setLocalError("Only image files are allowed.");
      return;
    }

    const tooLarge = files.filter((f) => f.size > maxFileSizeMB * 1024 * 1024);
    if (tooLarge.length > 0) {
      setLocalError(`Each file must be smaller than ${maxFileSizeMB} MB.`);
      return;
    }

    const duplicates = files.filter((f) => existingSignatures.has(`${f.name}-${f.size}`));
    if (duplicates.length > 0) {
      setLocalError("Some files were already added.");
    }

    const filtered = files.filter((f) => !existingSignatures.has(`${f.name}-${f.size}`));
    if (filtered.length === 0) return;

    setImages([...images, ...filtered]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFiles(Array.from(e.target.files));
    e.currentTarget.value = "";
  };

  // Remove image by index
  const removeImage = (index: number) => {
    const toRemove = images[index];
    // revoke object URL for the preview we created earlier
    try {
      URL.revokeObjectURL((previews[index] && previews[index].url) || "");
    } catch {
      /* ignore */
    }
    setImages(images.filter((_, i) => i !== index));
  };

  // Drag & drop handlers
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = "copy";
      setIsDragging(true);
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dt = e.dataTransfer;
      if (!dt) return;
      const files = Array.from(dt.files || []).filter((f) => f);
      handleFiles(files);
    };

    el.addEventListener("dragover", onDragOver);
    el.addEventListener("dragleave", onDragLeave);
    el.addEventListener("drop", onDrop);

    return () => {
      el.removeEventListener("dragover", onDragOver);
      el.removeEventListener("dragleave", onDragLeave);
      el.removeEventListener("drop", onDrop);
    };
  }, [images, dropRef.current]);

  return (
    <div className="space-y-6 text-black">
      <div className="bg-white rounded-md p-4 ring-1 ring-gray-100 hover:shadow-sm transition">
        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
          Project Purpose
        </label>
        <textarea
          id="purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          className={`w-full px-3 py-2 rounded-md border ${errors.purpose ? "border-red-500 focus:ring-red-500" : "border-[#c21219] focus:ring-[#c21219]"} focus:outline-none`}
          rows={3}
          placeholder="What is the purpose of this project?"
          aria-describedby={errors.purpose ? "purpose-error" : "purpose-help"}
        />
        <p id="purpose-help" className="text-xs text-gray-500 mt-1">Explain the primary goal and expected outcome in 1–2 sentences.</p>
        {errors.purpose && <p id="purpose-error" className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
      </div>

      <div className="bg-white rounded-md p-4 ring-1 ring-gray-100 hover:shadow-sm transition">
        <label htmlFor="extraField" className="block text-sm font-medium text-gray-700 mb-1">
          Extra Field (Optional)
        </label>
        <input
          id="extraField"
          type="text"
          value={extraField}
          onChange={(e) => setExtraField(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          className={`w-full px-3 py-2 rounded-md border ${errors.extraField ? "border-red-500 focus:ring-red-500" : "border-[#c21219] focus:ring-[#c21219]"} focus:outline-none`}
          placeholder="Optional information..."
          aria-describedby={errors.extraField ? "extra-error" : undefined}
        />
        {errors.extraField && <p id="extra-error" className="text-red-500 text-xs mt-1">{errors.extraField}</p>}
      </div>

      <div
        ref={dropRef}
        className={`bg-white rounded-md p-4 ring-1 ring-gray-100 transition ${isDragging ? "ring-2 ring-dashed ring-[#c21219] bg-[#fff7f7]" : "hover:shadow-sm"}`}
        aria-label="Project images upload area"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
              Project Images
            </label>

            <div className="flex items-center gap-3">
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="block text-sm text-gray-500"
                aria-describedby={localError ? "images-error" : "images-help"}
              />

              <div className="text-xs text-gray-500">
                <div>Accepted: images only • Max {maxFiles} files • {maxFileSizeMB}MB each</div>
                <div className="mt-1 text-gray-600">Tip: drag & drop images into this area</div>
              </div>
            </div>

            {localError && <p id="images-error" className="text-red-500 text-xs mt-2">{localError}</p>}
            {errors.images && <p className="text-red-500 text-xs mt-2">{errors.images}</p>}
          </div>

          <div className="flex-shrink-0 text-xs text-gray-500">
            <div className="font-medium text-gray-700">Uploaded</div>
            <div className="mt-1">{images.length}/{maxFiles}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          {previews.length === 0 ? (
            <div className="text-sm text-gray-500">No images added yet.</div>
          ) : (
            previews.map((p, idx) => (
              <figure key={p.id} className="relative w-28 h-28 rounded-md overflow-hidden border hover:shadow-md transition" role="group" aria-label={`Preview ${p.name}`}>
                <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                <figcaption className="sr-only">{p.name}</figcaption>

                <div className="absolute inset-0 flex items-end justify-between p-1 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition">
                  <span className="text-xs text-white truncate max-w-[70%] px-1">{p.name}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      aria-label={`Remove ${p.name}`}
                      className="bg-white/90 text-red-600 rounded px-1 text-xs hover:bg-white"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  aria-label={`Remove ${p.name}`}
                  className="absolute top-1 right-1 bg-white/90 text-red-600 rounded px-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#c21219]"
                >
                  ✕
                </button>
              </figure>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
