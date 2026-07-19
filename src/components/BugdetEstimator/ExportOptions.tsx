// components/ExportOptions.tsx
import React from "react";

export default function ExportOptions({ data }: { data?: any }) {
    const handleExport = (type: string) => {
        // Placeholder export logic — replace with actual backend integration
        alert(`Exporting as ${type}...`);
    };

    return (
        <div className="flex space-x-3">
            <button
                onClick={() => handleExport("PDF")}
                className="bg-[#2563EB] text-white px-3 py-2 rounded hover:bg-black hover:text-[#2563EB] transition text-sm shadow"
            >
                Export PDF
            </button>

            <button
                onClick={() => handleExport("CSV")}
                className="bg-[#2563EB] text-white px-3 py-2 rounded hover:bg-black hover:text-[#2563EB] transition text-sm shadow"
            >
                Export CSV
            </button>

            <button
                onClick={() => handleExport("Email")}
                className="bg-[#2563EB] text-white px-3 py-2 rounded hover:bg-black hover:text-[#2563EB] transition text-sm shadow"
            >
                Send via Email
            </button>
        </div>
    );
}
