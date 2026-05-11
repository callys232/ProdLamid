"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function UploadCard() {
  const [files, setFiles] = useState<FileList | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(e.target.files);
  }

  function handleSubmit() {
    if (!files || files.length === 0) {
      alert("Please select a file first!");
      return;
    }

    // Example: send files to API
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    fetch("/api/escrow/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Upload failed");
        alert("Files submitted for review!");
        setFiles(null);
      })
      .catch((err) => {
        alert("Error submitting files");
      });
  }

  return (
    <div
      className="
        w-full max-w-md
        rounded-xl
        border border-red-600/40
        bg-black/50
        p-4
        transition-all
        hover:border-red-500
        hover:shadow-red-600/20
      "
    >
      {/* Hidden file input */}
      <input
        type="file"
        id="fileInput"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload button triggers file input */}
      <label
        htmlFor="fileInput"
        className="
          flex w-full cursor-pointer items-center gap-3
          rounded-lg
          border border-red-600/40
          px-4 py-3
          text-white
          hover:bg-red-600/10
          transition-all
        "
      >
        <Plus className="h-5 w-5 text-red-500" />
        Upload/Send
      </label>

      {/* Show selected files */}
      {files && files.length > 0 && (
        <ul className="mt-3 text-sm text-gray-300">
          {Array.from(files).map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        className="
          mt-3
          rounded-lg
          bg-red-600
          px-4 py-2
          text-sm font-semibold text-white
          transition-all
          hover:bg-red-500
          hover:scale-[1.03]
        "
      >
        Submit for Review
      </button>
    </div>
  );
}
