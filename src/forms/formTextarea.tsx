"use client";

import React from "react";

interface FormTextareaProps {
  label?: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  error?: string;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  rows = 4,
  error,
}) => {
  const textareaId = `textarea-${name}`;

  return (
    <div className="w-full mb-3">
      {label && (
        <label htmlFor={textareaId} className="text-white mb-1 block">
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        rows={rows}
        // aria-invalid={!!error} // ✅ boolean, no quotes
        aria-describedby={error ? `${textareaId}-error` : undefined}
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white 
          placeholder-white/70 focus:ring-2 focus:ring-orange-500 focus:outline-none"
      />

      {error && (
        <p id={`${textareaId}-error`} className="text-red-400 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormTextarea;
