"use client";

import { useState } from "react";



import toast from "react-hot-toast";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
}
interface EditProfileFormProps { user: any; onClose: () => void; }

export default function EditProfileForm({ user, onClose }: EditProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    bio: user?.profile?.bio || "",
    location: user?.profile?.addresses?.[0]?.city || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        // Simple mapping for location to address
        addresses: formData.location ? [{ city: formData.location, line1: "N/A" }] : []
      };

      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Profile updated successfully! 🎉");
        onClose();
        // Optionally update parent state or refresh
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="firstName">First Name</label>
            <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-gray-900 text-white px-3 py-2 
                           focus:outline-none focus:ring-2 focus:ring-red-600 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="lastName">Last Name</label>
            <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-gray-900 text-white px-3 py-2 
                           focus:outline-none focus:ring-2 focus:ring-red-600 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="location">Location (City)</label>
          <input id="location" name="location" type="text" value={formData.location} onChange={handleChange}
            className="w-full rounded-md border border-gray-700 bg-gray-900 text-white px-3 py-2 
                       focus:outline-none focus:ring-2 focus:ring-red-600 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4}
            className="w-full rounded-md border border-gray-700 bg-gray-900 text-white px-3 py-2 
                       focus:outline-none focus:ring-2 focus:ring-red-600 outline-none resize-none" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button type="submit" disabled={loading}
            className="px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition" >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
