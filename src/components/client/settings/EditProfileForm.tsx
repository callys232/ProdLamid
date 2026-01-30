"use client";

import { useState } from "react";

interface ProfileFormData {
  fullName: string;
  address: string;
  state: string;
  zipcode: string;
}

export default function EditProfileForm() {
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    address: "",
    state: "",
    zipcode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated:", formData);
  };

  const fields: (keyof ProfileFormData)[] = [
    "fullName",
    "address",
    "state",
    "zipcode",
  ];

  return (
    <div className="max-w-xl w-full">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field}>
            <label
              className="block text-sm font-medium mb-1 capitalize"
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
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Save
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
