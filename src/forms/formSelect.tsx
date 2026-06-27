"use client";

import React from "react";

interface FormSelectProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  options: { label: string; value: string }[];
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  options,
}) => {
  const selectId = `select-${name}`;

  return (
    <div className="w-full mb-3">
      {label && (
        <label htmlFor={selectId} className="text-white mb-1 block">
          {label}
        </label>
      )}

      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        // aria-invalid={!!error} // ✅ boolean, no quotes
        aria-describedby={error ? `${selectId}-error` : undefined}
        className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black text-white 
          focus:ring-2 focus:ring-orange-500 focus:outline-none"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={`${selectId}-error`} className="text-red-400 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormSelect;
