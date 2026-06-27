"use client";

import React, { useState } from "react";
import SectionWrapper from "./wrapper";
import PremiumCard from "./card";
import UploadZone from "./upload";
import { Invoice } from "@/types/legal";
import { invoicesMock } from "@/mocks/legalMock";

const InvoicesSection: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(invoicesMock);
  const [loading, setLoading] = useState(false);

  const handleUpload = (file: File) => {
    setLoading(true);
    setTimeout(() => {
      const newInvoice: Invoice = {
        id: invoices.length + 1,
        title: file.name,
        amount: 0,
        dueDate: "TBD",
        status: "Uploaded",
        uploadedFile: URL.createObjectURL(file),
      };
      setInvoices([...invoices, newInvoice]);
      setLoading(false);
    }, 1000); // simulate upload delay
  };

  return (
    <SectionWrapper title="Invoices">
      <UploadZone
        label="Upload an invoice (PDF, DOCX, Image)"
        accept=".pdf,.doc,.docx,.png,.jpg"
        onUpload={handleUpload}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && (
          <div className="animate-pulse bg-gray-800 h-40 rounded-lg" />
        )}
        {invoices.map((inv) => (
          <PremiumCard key={inv.id} {...inv} type="invoice" />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default InvoicesSection;
