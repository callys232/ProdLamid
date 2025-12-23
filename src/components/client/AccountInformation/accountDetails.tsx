"use client";

import { useState } from "react";
import { ClientProfile } from "@/types/client";

interface AccountDetailsProps {
  client: ClientProfile;
  onSave: (updated: ClientProfile) => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
}

export default function AccountDetails({
  client,
  onSave,
  onDelete,
  onClose,
}: AccountDetailsProps) {
  const [formData, setFormData] = useState<ClientProfile>(client);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-gray-950 text-white p-6 rounded-lg w-full max-w-lg shadow-xl border border-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Account Details</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <label className="block" htmlFor="name">
          <span className="text-sm text-gray-400">Name</span>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </label>

        <label className="block" htmlFor="email">
          <span className="text-sm text-gray-400">Email</span>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </label>

        <label className="block" htmlFor="companyName">
          <span className="text-sm text-gray-400">Company</span>
          <input
            id="companyName"
            name="companyName"
            value={formData.companyname ?? ""}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </label>

        <label className="block" htmlFor="location">
          <span className="text-sm text-gray-400">Location</span>
          <input
            id="location"
            name="location"
            value={formData.location ?? ""}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-8">
        <button
          type="button"
          onClick={() => onDelete(formData.id)}
          className="px-4 py-2 bg-red-700 rounded hover:bg-red-800 text-sm font-semibold"
        >
          Delete Account
        </button>
        <div className="space-x-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800 text-sm font-semibold"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-sm font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
