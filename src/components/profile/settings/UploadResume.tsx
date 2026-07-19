"use client";

import { useState } from "react";

import { toast } from "react-hot-toast";

export default function UploadResume({ user }: { user: any }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const existingResumeUrl = user?.profile?.resumeUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file before saving.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload/resume", {
        method: "POST",
        body: formData
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Resume uploaded successfully! 📄");
        // Optionally update state or redirect
      } else {
        throw new Error(result.message || "Failed to upload resume");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full">
      <h2 className="text-2xl font-semibold mb-6">Upload Resume</h2>

      {existingResumeUrl && (
        <div className="mb-6 p-4 border border-green-600/30 bg-green-900/10 rounded-md">
          <p className="text-sm text-gray-300">Existing Resume detected:</p>
          <a href={existingResumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm font-medium">
            View current resume
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="resume" className="block text-sm font-medium text-gray-300 mb-2">
          Upload your resume (PDF/DOC)
        </label>
        <input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          title="Choose a resume file"
          placeholder="Choose a resume file"
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white
                     hover:file:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        />

        {file && (
          <div className="mt-2 p-3 border border-gray-600 rounded-md bg-gray-800 text-gray-200">
            <p>
              <span className="font-medium">Selected File:</span> {file.name}
            </p>
            <p className="text-xs text-gray-400">
              Size: {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !file}
            className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Uploading..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
