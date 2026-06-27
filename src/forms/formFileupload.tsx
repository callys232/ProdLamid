"use client";

import React, { ChangeEvent } from "react";

interface FileUploadProps {
  label: string;
  name: string;
  onChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, name, onChange }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
  };

  return (
    <div className="w-full mb-3">
      <label htmlFor={name} className="text-white block mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white
          file:bg-orange-500 file:text-white file:px-4 file:py-2 file:border-none file:rounded-lg"
      />
    </div>
  );
};

export default FileUpload;
