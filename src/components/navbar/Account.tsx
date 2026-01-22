"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface AccountMenuProps {
  align?: "left" | "right";
}

const accountItems = [
  { name: "Sign In", href: "/signin" },
  { name: "Sign Up", href: "/signup" },
  // { name: "Admin", href: "/admin" },
  // { name: "Continue with Google", href: "/google-login" },
  { name: "Consultant Login", href: "/profile" },
  { name: "Careers", href: "/jobs" },
  { name: "Clients", href: "/talent" },
  { name: "Client Login", href: "/client" },
];

const AccountMenu: React.FC<AccountMenuProps> = ({ align = "right" }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!open) return;
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const currentIndex = items.findIndex((el) => el === document.activeElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex =
        currentIndex >= 0 ? (currentIndex + 1) % items.length : 0;
      items[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex =
        currentIndex >= 0
          ? (currentIndex - 1 + items.length) % items.length
          : items.length - 1;
      items[prevIndex]?.focus();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="account-dropdown"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={onTriggerKeyDown}
        className="group flex items-center gap-2 bg-black px-4 py-2 rounded-lg hover:bg-[#c12129] transition text-white"
      >
        {/* Red user icon (SVG, inherits currentColor) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 text-red-600 group-hover:text-red-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" />
        </svg>

        <span className="font-serif">Account</span>
      </button>

      {open && (
        <div
          id="account-dropdown"
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-3 w-56 bg-white text-black rounded-lg shadow-xl z-50`}
          aria-label="Account options"
        >
          <ul className="py-1">
            {accountItems.map((item, idx) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  className="block px-4 py-2 hover:bg-[#c12129] hover:text-white focus:bg-gray-200 focus:outline-none"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
