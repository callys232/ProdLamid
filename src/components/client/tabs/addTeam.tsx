"use client";

import { useState } from "react";
import { Consultant } from "@/types/client";

interface ConsultantFormProps {
  initialData?: Consultant; // if provided, form works in "edit" mode
  onSubmit: (consultant: Consultant) => void;
  onCancel: () => void;
}

export default function ConsultantForm({
  initialData,
  onSubmit,
  onCancel,
}: ConsultantFormProps) {
  const [formData, setFormData] = useState<Consultant>(
    initialData || {
      id: crypto.randomUUID(),
      name: "",
      industry: "",
      delivery: "",
      rate: "",
      rating: 0,
      role: "",
      experience: 0,
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "rating" || name === "experience" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 border border-gray-800 rounded-md p-6 space-y-4 w-full max-w-md"
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        {initialData ? "Edit Consultant" : "Add Consultant"}
      </h2>

      {/* Name */}
      <div>
        <label className="block text-sm text-gray-400">Name</label>
        <input
          aria-label="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm text-gray-400">Role</label>
        <input
          name="role"
          value={formData.role ?? ""}
          onChange={handleChange}
          placeholder="e.g. Lead Developer"
          className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm text-gray-400">Industry</label>
        <input
          aria-label="industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>

      {/* Delivery */}
      <div>
        <label className="block text-sm text-gray-400">Delivery Style</label>
        <input
          name="delivery"
          value={formData.delivery}
          onChange={handleChange}
          placeholder="e.g. Agile Sprints"
          className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>

      {/* Rate */}
      <div>
        <label className="block text-sm text-gray-400">Rate</label>
        <input
          name="rate"
          value={formData.rate}
          onChange={handleChange}
          placeholder="$75"
          className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm text-gray-400">Rating (1–5)</label>
        <input
          aria-label=" number"
          type="number"
          name="rating"
          min={1}
          max={5}
          value={formData.rating}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>

      {/* Experience */}
      <div>
        <label className="block text-sm text-gray-400">
          Experience (years)
        </label>
        <input
          aria-label="experience"
          type="number"
          name="experience"
          value={formData.experience ?? 0}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm text-gray-400">Profile Image URL</label>
        <input
          name="image"
          value={formData.image ?? ""}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
          className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800 text-sm font-semibold text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-sm font-semibold text-white"
        >
          {initialData ? "Save Changes" : "Add Consultant"}
        </button>
      </div>
    </form>
  );
}
