"use client";

import { useState } from "react";
import type { Escrow, Message } from "@/types/escrow";
import { FiSend } from "react-icons/fi";
import { Dispatch, SetStateAction } from "react";

interface MessageBarProps {
  escrow: Escrow;
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

export default function MessageBar({ escrow, setMessages }: MessageBarProps) {
  const [message, setMessage] = useState("");

  async function handleSend() {
    if (!message.trim()) return;

    try {
      // Always send to both client and consultant
      const recipients: ("client" | "consultant")[] = ["client", "consultant"];

      await Promise.all(
        recipients.map(async (recipient) => {
          const res = await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              escrowId: escrow.id,
              recipient,
              message,
            }),
          });

          if (!res.ok) throw new Error(`Failed to send to ${recipient}`);
        })
      );

      // ✅ Update local state so badge count updates immediately
      const newMessage: Message = {
        id: crypto.randomUUID(),
        sender: "client", // or "consultant"/"admin" depending on role
        content: message,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        balance: escrow.balance ?? 0, // ✅ include balance from escrow
      };
      setMessages((prev) => [...prev, newMessage]);

      setMessage("");
      alert("Message sent to client and consultant!");
    } catch (err) {
      console.error(err);
      alert("Error sending message");
    }
  }

  return (
    <div className="flex items-center bg-gray-900 border-t border-gray-700 p-3 hover:border-[#c12129] transition">
      {/* Input field */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Send Message..."
        className="flex-1 bg-transparent text-white placeholder-gray-400 px-3 py-2 focus:outline-none"
      />

      {/* Send button */}
      <button
        aria-label="send"
        onClick={handleSend}
        className="ml-3 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition border-2 border-transparent hover:border-[#c12129]"
      >
        <FiSend className="h-5 w-5" />
      </button>
    </div>
  );
}
