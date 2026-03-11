"use client";

import React, { useState } from "react";
import SectionWrapper from "./wrapper";
import PremiumCard from "./card";
import UploadZone from "./upload";
import { Doc } from "@/types/legal";
import { docsMock } from "@/mocks/legalMock";

const DocsSection: React.FC = () => {
    const [docs, setDocs] = useState<Doc[]>(docsMock);
    const [loading, setLoading] = useState(false);

    const handleUpload = (file: File) => {
        setLoading(true);
        setTimeout(() => {
            const newDoc: Doc = {
                id: docs.length + 1,
                title: file.name,
                status: "Uploaded",
                uploadedFile: URL.createObjectURL(file),
            };
            setDocs([...docs, newDoc]);
            setLoading(false);
        }, 1000);
    };

    return (
        <SectionWrapper title="Shared Docs">
            <UploadZone
                label="Upload a document (PDF, DOCX, Image)"
                accept=".pdf,.doc,.docx,.png,.jpg"
                onUpload={handleUpload}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading && <div className="animate-pulse bg-gray-800 h-40 rounded-lg" />}
                {docs.map((doc) => (
                    <PremiumCard key={doc.id} {...doc} type="doc" />
                ))}
            </div>
        </SectionWrapper>
    );
};

export default DocsSection;
