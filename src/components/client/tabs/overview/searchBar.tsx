"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch?.(value);
    };

    return (
        <div className="flex items-center gap-2 mb-6">
            <Search size={18} className="text-gray-400" />
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search projects by goals, phases, or status..."
                className="px-3 py-2 rounded-lg bg-black border border-gray-700 text-white w-full focus:ring-2 focus:ring-[#2563EB] focus:outline-none transition hover:bg-[#1a1a1a]"
            />
        </div>
    );
}
