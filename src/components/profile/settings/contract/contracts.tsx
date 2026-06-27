"use client";

import React, { useState } from "react";
import SectionWrapper from "./wrapper";
import PremiumCard from "./card";
import UploadZone from "./upload";
import { Contract } from "@/types/legal";
import { contractsMock } from "@/mocks/legalMock";

const ContractsSection: React.FC = () => {
    const [contracts, setContracts] = useState<Contract[]>(contractsMock);
    const [loading, setLoading] = useState(false);

    const handleUpload = (file: File) => {
        setLoading(true);
        setTimeout(() => {
            const newContract: Contract = {
                id: contracts.length + 1,
                title: file.name,
                status: "Uploaded",
                uploadedFile: URL.createObjectURL(file),
            };
            setContracts([...contracts, newContract]);
            setLoading(false);
        }, 1000);
    };

    return (
        <SectionWrapper title="Contracts">
            <UploadZone
                label="Upload a contract (PDF, DOCX)"
                accept=".pdf,.doc,.docx"
                onUpload={handleUpload}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading && <div className="animate-pulse bg-gray-800 h-40 rounded-lg" />}
                {contracts.map((c) => (
                    <PremiumCard key={c.id} {...c} type="contract" />
                ))}
            </div>
        </SectionWrapper>
    );
};

export default ContractsSection;
