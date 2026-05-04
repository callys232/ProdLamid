"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaUserCircle, FaPaperclip, FaFile } from "react-icons/fa";
import { toast } from "react-hot-toast";
import EmptyState from "@/components/ui/EmptyState";
import { MessageSquare } from "lucide-react";


interface Message {
    _id: string;
    senderId: {
        _id: string;
        username: string;
        profileImage?: string;
    };
    message: string;
    type: string;
    sentAt: string;
}

interface ChatSystemProps {
    projectId: string;
}

export default function ChatSystem({ projectId }: ChatSystemProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [projectId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}/messages`);
            const data = await res.json();
            if (res.ok) setMessages(data.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await fetch(`/api/projects/${projectId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: newMessage, type: "text" }),
            });
            if (res.ok) {
                setNewMessage("");
                fetchMessages();
            }
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar"
            >
                {messages.map((msg) => (
                    <div key={msg._id} className={`flex gap-3 ${msg.type !== 'text' ? 'justify-center' : ''}`}>
                        {msg.type === 'text' ? (
                            <>
                                <div className="flex-shrink-0">
                                    {msg.senderId?.profileImage ? (
                                        <img src={msg.senderId.profileImage} alt="" className="w-8 h-8 rounded-full border border-white/10" />
                                    ) : (
                                        <FaUserCircle className="text-2xl text-gray-500" />
                                    )}
                                </div>
                                <div className="max-w-[80%]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-gray-400">{msg.senderId?.username}</span>
                                        <span className="text-[10px] text-gray-600">{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-3 text-sm text-gray-200">
                                        {msg.message}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-red-900/10 border border-red-900/20 text-red-500 text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-full">
                                {msg.type.replace('_', ' ')}: {msg.message}
                            </div>
                        )}
                    </div>
                ))}
                {messages.length === 0 && !loading && (
                    <EmptyState icon={MessageSquare} title="No messages yet" description="Be the first to send a message." />
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
                {/* Hidden file input */}
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*,application/pdf,.doc,.docx,.xlsx,.zip"
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        try {
                            const fd = new FormData();
                            fd.append("file", file);
                            fd.append("projectId", projectId);
                            const res = await fetch("/api/messages/upload", { method: "POST", body: fd });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.message);
                            // Send as a message with the file URL
                            await fetch(`/api/projects/${projectId}/messages`, {
                                method: "POST", headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ message: `📎 [${file.name}](${data.url})`, type: "text", fileUrl: data.url }),
                            });
                            fetchMessages();
                            toast.success("File sent");
                        } catch (err: any) {
                            toast.error(err.message || "Upload failed");
                        } finally {
                            setUploading(false);
                            e.target.value = "";
                        }
                    }}
                />
                <button type="button" onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="p-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50">
                    {uploading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent inline-block" /> : <FaPaperclip />}
                </button>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-600 transition-all"
                />
                <button type="submit"
                    className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-lg shadow-red-900/20">
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    );
}
