"use client";

import { useState } from "react";

import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DeleteAccount() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/delete", {
        method: "DELETE"
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Account deleted successfully. We're sorry to see you go. 👋");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        throw new Error(result.message || "Failed to delete account");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full">
      <h2 className="text-2xl font-semibold mb-6 text-red-500">
        Delete Account
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Once you delete your account, there is no going back. Please be certain.
      </p>

      {/* Danger Zone */}
      <div className="border border-red-600 bg-red-900/10 rounded-md p-6">
        <h3 className="text-lg font-medium text-red-500 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-300 mb-6">
          Deleteting your account will permanently remove all your data, including your projects, profile information, and wallet balance.
        </p>

        {!confirmOpen ? (
          <button
            onClick={() => setConfirmOpen(true)}
            className="px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition font-semibold"
          >
            Delete My Account
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-red-500 font-bold text-sm">Are you absolutely sure? This action is irreversible.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition font-semibold disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Yes, Delete Permanently"}
              </button>
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={loading}
                className="px-6 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
