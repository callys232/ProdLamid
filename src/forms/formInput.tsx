"use client";

import React from "react";

interface FormInputProps {
  label?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  error,
  type = "text",
}) => {
  const inputId = `input-${name}`;

  return (
    <div className="w-full mb-3">
      {label && (
        <label htmlFor={inputId} className="text-white mb-1 block">
          {label}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        // aria-invalid={!!error} // ✅ boolean expression
        aria-describedby={error ? `${inputId}-error` : undefined}
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white 
          placeholder-white/70 focus:ring-2 focus:ring-orange-500 focus:outline-none"
      />

      {error && (
        <p id={`${inputId}-error`} className="text-red-400 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
