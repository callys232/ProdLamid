"use client";

import { useState, ChangeEvent } from "react";

interface BusinessForm {
  companyName: string;
  industry: string;
  location: string;
  website: string;
  companySize: string;
  description: string;
}

import { toast } from "react-hot-toast";

export default function BusinessProfile({ user }: { user: any }) {
  const [form, setForm] = useState<BusinessForm>({
    companyName: user?.profile?.companyName || "",
    industry: user?.profile?.industry || "",
    location: user?.profile?.location || "",
    website: user?.profile?.website || "",
    companySize: user?.profile?.companySize || "",
    description: user?.profile?.description || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Business profile updated! 🏢");
      } else {
        throw new Error(result.message || "Failed to update business profile");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  const fields: { label: string; name: keyof BusinessForm; type?: string }[] = [
    { label: "Company Name", name: "companyName" },
    { label: "Industry", name: "industry" },
    { label: "Location", name: "location" },
    { label: "Website", name: "website", type: "url" },
    { label: "Company Size", name: "companySize" },
  ];

  return (
    <div className="p-8 bg-gray-950 rounded-xl w-full max-w-4xl border border-gray-800 shadow-lg">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-2 text-white">Business Profile</h2>
      <p className="text-gray-400 mb-8 text-sm">
        Provide your organization’s details. A complete profile helps{" "}
        <span className="text-red-500 font-medium">Lamid</span> match you with
        the right consultants and opportunities.
      </p>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(({ label, name, type }) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">{label}</label>
            <input
              type={type || "text"}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full bg-gray-900 focus:ring-2 focus:ring-red-500 text-white border border-gray-800 rounded-md px-3 py-2 transition placeholder-gray-500"
              placeholder={`Enter ${label}`}
            />
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="text-sm text-gray-400 mb-1 block">
          Company Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full bg-gray-900 focus:ring-2 focus:ring-red-500 text-white border border-gray-800 rounded-md px-3 py-3 transition placeholder-gray-500"
          rows={5}
          placeholder="Tell us about your business, mission, and services"
        />
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 px-6 py-3 rounded-md font-semibold text-white shadow-md transition disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
