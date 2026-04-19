// components/VendorInput.tsx
import { useState, useEffect } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

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
    const [tooltipData, setTooltipData] = useState<any>(null);

    useEffect(() => {
        if (activeIndex !== null) {
            const vendor = vendors[activeIndex].serviceType || "vendor";
            fetchRecommendation("construction", "medium", "contractCost", vendor).then((data) =>
                setTooltipData(data)
            );
        }
    }, [activeIndex]);

    return (
        <div className="space-y-4">
            {vendors.map((v, i) => (
                <div
                    key={i}
                    className={`relative flex items-center space-x-4 p-4 rounded-lg shadow transition ${activeIndex === i ? "bg-red-50 border border-[#c12129]" : "bg-white"
                        }`}
                >
                    <input
                        type="text"
                        value={v.vendorName}
                        placeholder="Vendor Name"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition flex-1"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const newVendors = [...vendors];
                            newVendors[i].vendorName = e.target.value;
                            setVendors(newVendors);
                        }}
                    />

                    <input
                        type="text"
                        value={v.serviceType}
                        placeholder="Service Type"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const newVendors = [...vendors];
                            newVendors[i].serviceType = e.target.value;
                            setVendors(newVendors);
                        }}
                    />

                    <input
                        type="number"
                        value={v.contractCost}
                        placeholder="Contract Cost"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-32"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const newVendors = [...vendors];
                            newVendors[i].contractCost = Number(e.target.value);
                            setVendors(newVendors);
                        }}
                    />

                    {/* Tooltip appears when input is focused */}
                    <Tooltip
                        recommendation={tooltipData?.recommendation || "Typical vendor contracts: $12k–18k"}
                        source={tooltipData?.source || "Based on 9 similar construction projects"}
                        confidence={tooltipData?.confidence || 0.77}
                        visible={activeIndex === i}
                    />
                </div>
            ))}

            <button
                onClick={() =>
                    setVendors([...vendors, { vendorName: "", serviceType: "", contractCost: 0 }])
                }
                className="bg-[#c12129] text-white px-4 py-2 rounded hover:bg-black hover:text-[#c12129] transition"
            >
                + Add Vendor
            </button>
        </div>
    );
}
