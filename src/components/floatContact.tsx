"use client";

import React from "react";
import Onboarding from "@/components/Agent/Onboarding";

interface FloatingChatWindowProps {
  onClose: () => void;
}

export default function FloatingChatWindow({
  onClose,
}: FloatingChatWindowProps) {
  return (
    <div className="fixed bottom-6 right-6 w-96 h-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-bold text-[#c12129]">Chatbot</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          ✕
        </button>
      </div>

      {/* Bot content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Onboarding />
      </div>
    </div>
  );
}
