"use client";

import { useState } from "react";

export default function UploadResume() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file before saving.");
      return;
    }
    console.log("Resume uploaded:", file.name);
  };

  return (
    <div className="max-w-xl w-full">
      <h2 className="text-2xl font-semibold mb-6">Upload Resume</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="resume" className="block text-sm font-medium text-gray-300 mb-2">
          Upload your resume
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
                     file:bg-red-600 file:text-white
                     hover:file:bg-red-700"
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
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Save
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
