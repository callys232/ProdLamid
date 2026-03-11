"use client";

import React from "react";

interface UploadZoneProps {
    label: string;
    accept: string;
    onUpload: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ label, accept, onUpload }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div className="mb-6 border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-[#c12129] transition">
            <p className="text-gray-400 mb-2">{label}</p>
            <input
                type="file"
                accept={accept}
                onChange={handleChange}
                className="block w-full text-sm text-gray-300 cursor-pointer bg-black focus:outline-none"
            />
        </div>
    );
};

export default UploadZone;
