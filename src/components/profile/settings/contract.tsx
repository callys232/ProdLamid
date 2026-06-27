import React, { useState } from "react";
import ContractsSection from "./contract/contracts";
import InvoicesSection from "./contract/invoice";
import BillsSection from "./contract/bills";
import DocsSection from "./contract/docs";

const sections = ["Contracts", "Invoices", "Bills", "Shared Docs"];

const FinanceHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState("Contracts");

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans p-8">
            {/* Header */}
            <header className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Business Services</h1>
                <p className="text-gray-400 mt-1">Centralized workspace for contracts, invoices & bills</p>
            </header>

            {/* Tab Navigation */}
            <div className="flex space-x-6 mb-6">
                {sections.map((section) => (
                    <button
                        key={section}
                        onClick={() => setActiveTab(section)}
                        className={`px-4 py-2 text-lg font-semibold transition-colors rounded-md ${activeTab === section
                            ? "bg-[#c12129] text-white shadow-lg"
                            : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}
                    >
                        {section}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="rounded-xl overflow-hidden shadow-xl">
                {activeTab === "Contracts" && <ContractsSection />}
                {activeTab === "Invoices" && <InvoicesSection />}
                {activeTab === "Bills" && <BillsSection />}
                {activeTab === "Shared Docs" && <DocsSection />}
            </div>

            {/* Footer */}
            <footer className="mt-12 text-sm text-gray-500 border-t border-gray-800 pt-4">
                <p>Confidential — Finance & Legal Team Only</p>
            </footer>
        </div>
    );
};

export default FinanceHub;
