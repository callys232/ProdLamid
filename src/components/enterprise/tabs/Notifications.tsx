"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, FolderOpen, Users, CreditCard, Settings } from "lucide-react";

const TYPE_ICON: Record<string, React.ReactNode> = {
  project:  <FolderOpen  className="h-4 w-4 text-blue-400"    />,
  member:   <Users       className="h-4 w-4 text-green-400"   />,
  billing:  <CreditCard  className="h-4 w-4 text-yellow-400"  />,
  system:   <Settings    className="h-4 w-4 text-gray-400"    />,
};

const MOCK = [
  { _id: "n1", type: "project", title: "New bid received",              message: "3 consultants bid on ERP Integration project",       createdAt: "2h ago",  read: false },
  { _id: "n2", type: "member",  title: "Member joined",                 message: "Sarah O. accepted your invitation",                   createdAt: "5h ago",  read: false },
  { _id: "n3", type: "billing", title: "Invoice paid",                  message: "April invoice of $18,500 processed successfully",     createdAt: "1d ago",  read: true  },
  { _id: "n4", type: "project", title: "Milestone approved",            message: "Data Warehouse Phase 1 milestone marked complete",    createdAt: "1d ago",  read: true  },
  { _id: "n5", type: "system",  title: "Platform update",               message: "New analytics features available in your dashboard",  createdAt: "3d ago",  read: true  },
  { _id: "n6", type: "member",  title: "Invite expired",                message: "Invite to james@partner.com expired after 7 days",    createdAt: "5d ago",  read: true  },
];

export default function Notifications() {
  const [notifs, setNotifs] = useState(MOCK);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const visible = filter === "unread" ? notifs.filter(n => !n.read) : notifs;

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  }

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-white">Notifications</h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-[#c12129] px-2 py-0.5 text-[11px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(["all", "unread"] as const).map(f => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
                filter === f
                  ? "bg-[#c12129]/20 text-[#c12129]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {f}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 transition hover:border-white/20 hover:text-white"
          >
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </motion.button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <AnimatePresence>
          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <Bell className="h-8 w-8 text-gray-700" />
              <p className="text-sm text-gray-500">No {filter === "unread" ? "unread " : ""}notifications</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {visible.map((n, i) => (
                <motion.li
                  key={n._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => markRead(n._id)}
                  className={`flex cursor-pointer items-start gap-4 px-5 py-4 transition hover:bg-white/5 ${!n.read ? "bg-[#c12129]/3" : ""}`}
                >
                  <div className="mt-0.5 flex-shrink-0">{TYPE_ICON[n.type]}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-medium ${n.read ? "text-gray-400" : "text-white"}`}>{n.title}</p>
                      <span className="flex-shrink-0 text-[11px] text-gray-600">{n.createdAt}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">{n.message}</p>
                  </div>
                  {!n.read && (
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#c12129]" />
                  )}
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
