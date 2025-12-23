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
        Deleting your account is permanent and cannot be undone. All your data
        will be lost.
      </p>

      {/* Danger Zone */}
      <div className="border border-red-600 bg-gray-900 rounded-md p-4">
        <h3 className="text-lg font-medium text-red-500 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-300 mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
        >
          Delete My Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 p-6 rounded-md shadow-lg max-w-sm w-full">
            <h4 className="text-lg font-semibold text-red-500 mb-4">
              Confirm Deletion
            </h4>
            <p className="text-sm text-gray-300 mb-6">
              Are you absolutely sure you want to delete your account? This
              action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
