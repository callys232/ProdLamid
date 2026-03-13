"use client";

import { useState } from "react";

interface ProfileFormData {
  fullName: string;
  address: string;
  state: string;
  zipcode: string;
}

interface EditProfileFormProps {
  user: any;
  onClose?: () => void;
  onSaved?: () => void;
}

export default function EditProfileForm({
  user,
  onClose,
  onSaved,
}: EditProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: user?.name || user?.fullName || "",
    address: user?.profile?.addresses?.[0]?.line1 || user?.location || "",
    state: user?.profile?.addresses?.[0]?.state || "",
    zipcode: user?.profile?.addresses?.[0]?.zip || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Replace with your API call
      console.log("Profile updated:", formData);

      // Close modal after save
      if (onSaved) onSaved();
      else onClose?.();
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const fields: (keyof ProfileFormData)[] = [
    "fullName",
    "address",
    "state",
    "zipcode",
  ];

  return (
    <div className="max-w-xl w-full">
      <h2 className="text-2xl font-semibold mb-6 text-white">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field}>
            <label
              className="block text-sm font-medium mb-1 capitalize text-gray-300"
              htmlFor={field}
            >
              {field}
            </label>

            <input
              id={field}
              name={field}
              type="text"
              value={formData[field]}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-gray-900 text-white px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-950"
            />
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
          >
            Save
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}