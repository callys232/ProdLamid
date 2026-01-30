"use client";

import { useState } from "react";

export default function DeleteAccount() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = () => {
    // TODO: hook into API for account deletion
    console.log("Account deleted");
    setConfirmOpen(false);
  };

  return (
    <div className="max-w-xl w-full">
      <h2 className="text-2xl font-semibold mb-6 text-red-500">
        Delete Account
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        CONTACT ADMIN TO DELETE YOUR ACCOUNT
      </p>

      {/* Danger Zone */}
      <div className="border border-red-600 bg-gray-900 rounded-md p-4">
        <h3 className="text-lg font-medium text-red-500 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-300 mb-4">
          Ready to delete your account? Please contact support.
        </p>
      </div>
    </div>
  );
}
