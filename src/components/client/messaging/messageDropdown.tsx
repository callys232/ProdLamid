"use client";
import type { Message } from "@/types/escrow";
import { mockEscrow } from "@/mocks/mocksEscrow";

interface MessageDropdownProps {
  messages?: Message[];
}

export default function MessageDropdown({ messages }: MessageDropdownProps) {
  // ✅ fallback to mockEscrow.messages if none provided
  const safeMessages =
    messages && messages.length > 0 ? messages : mockEscrow.messages ?? [];

  return (
    <div className="p-4 w-72 rounded-lg border border-blue-600/40 bg-black/90 shadow-lg">
      <h3 className="text-white text-sm font-semibold mb-3">Messages</h3>
      {safeMessages.length === 0 ? (
        <p className="text-gray-400 text-xs">No messages yet</p>
      ) : (
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {safeMessages.map((msg) => (
            <li
              key={msg.id}
              className="flex flex-col rounded-md border border-gray-700 p-2 hover:border-[#2563EB] transition"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-blue-400">
                  {msg.sender.charAt(0).toUpperCase() + msg.sender.slice(1)}
                </span>
                <span className="text-[10px] text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-white mt-1">{msg.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
