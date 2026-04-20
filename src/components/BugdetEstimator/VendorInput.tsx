import { useState } from "react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

interface VendorItem {
    vendorName: string;
    serviceType: string;
    contractCost: number;
}

export default function VendorInput() {
    const [vendors, setVendors] = useState<VendorItem[]>([
        { vendorName: "Subcontractor A", serviceType: "Electrical", contractCost: 15000 },
    ]);

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const activeVendor = activeIndex !== null ? vendors[activeIndex] : null;

    const { data, loading } = useFieldRecommendation({
        enabled: activeIndex !== null,
        industry: "construction",
        complexity: "medium",
        field: "contractCost",
        keyword: activeVendor?.serviceType
    });

    return (
        <div className="space-y-4">
            {vendors.map((v, i) => (
                <div
                    key={i}
                    className={`relative flex items-center space-x-4 p-4 rounded-lg shadow transition ${activeIndex === i
                        ? "bg-red-50 border border-[#c12129]"
                        : "bg-white"
                        }`}
                >
                    {/* Vendor Name */}
                    <input
                        type="text"
                        value={v.vendorName}
                        placeholder="Vendor Name"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition flex-1"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const copy = [...vendors];
                            copy[i].vendorName = e.target.value;
                            setVendors(copy);
                        }}
                    />

                    {/* Service Type */}
                    <input
                        type="text"
                        value={v.serviceType}
                        placeholder="Service Type"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const copy = [...vendors];
                            copy[i].serviceType = e.target.value;
                            setVendors(copy);
                        }}
                    />

                    {/* Contract Cost */}
                    <input
                        type="number"
                        value={v.contractCost}
                        placeholder="Contract Cost"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-32"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const copy = [...vendors];
                            copy[i].contractCost = Number(e.target.value);
                            setVendors(copy);
                        }}
                    />

                    {/* Tooltip */}
                    <Tooltip
                        recommendation={
                            data?.recommendation ||
                            "Typical vendor contracts: $12k–18k"
                        }
                        source={
                            data?.source ||
                            "Based on similar construction vendor contracts"
                        }
                        confidence={data?.confidence || 0.75}
                        visible={activeIndex === i}
                        loading={loading}
                    />
                </div>
            ))}

            <button
                onClick={() =>
                    setVendors([
                        ...vendors,
                        { vendorName: "", serviceType: "", contractCost: 0 },
                    ])
                }
                className="bg-[#c12129] text-white px-4 py-2 rounded hover:bg-black hover:text-[#c12129] transition"
            >
                + Add Vendor
            </button>
        </div>
    );
}