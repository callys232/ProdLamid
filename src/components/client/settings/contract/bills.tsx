"use client";

import React, { useState } from "react";
import SectionWrapper from "./wrapper";
import PremiumCard from "./card";
import UploadZone from "./upload";
import { Bill } from "@/types/legal";
import { billsMock } from "@/mocks/legalMock";

const BillsSection: React.FC = () => {
    const [bills, setBills] = useState<Bill[]>(billsMock);
    const [loading, setLoading] = useState(false);

    const handleUpload = (file: File) => {
        setLoading(true);
        setTimeout(() => {
            const newBill: Bill = {
                id: bills.length + 1,
                title: file.name,
                status: "Uploaded",
                uploadedFile: URL.createObjectURL(file),
            };
            setBills([...bills, newBill]);
            setLoading(false);
        }, 1000);
    };

    return (
        <SectionWrapper title="Bills">
            <UploadZone
                label="Upload a bill (PDF, Image)"
                accept=".pdf,.png,.jpg"
                onUpload={handleUpload}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading && <div className="animate-pulse bg-gray-800 h-40 rounded-lg" />}
                {bills.map((bill) => (
                    <PremiumCard key={bill.id} {...bill} type="bill" />
                ))}
            </div>
        </SectionWrapper>
    );
};

export default BillsSection;
