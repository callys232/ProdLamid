"use client";

export default function DeleteAccount() {
  return (
    <div className="max-w-xl w-full">
      <h2 className="text-2xl font-semibold mb-6 text-red-500">
        Delete Account
      </h2>

      {/* Danger Zone */}
      <div className="border border-red-600 bg-red-900/10 rounded-md p-6">
        <h3 className="text-lg font-medium text-red-500 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-300 mb-6">
          Account deletion will permanently remove all your data, including
          projects, profile information, and wallet balance.
        </p>
        <p className="text-sm text-yellow-400 font-semibold">
          ⚠️ This action cannot be performed here. Please contact an admin
          directly to request account deletion.
        </p>
      </div>
    </div>
  );
}
