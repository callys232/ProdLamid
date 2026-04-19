// components/FinancingInput.tsx
import { useState, useEffect } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

interface FinancingItem {
    interestRate: number;
    currencyExchangeImpact: number;
    insuranceCost: number;
}

export default function FinancingInput() {
    const [financing, setFinancing] = useState<FinancingItem>({
        interestRate: 5,
        currencyExchangeImpact: 2000,
        insuranceCost: 1500,
    });
    const [activeField, setActiveField] = useState<string | null>(null);
    const [tooltipData, setTooltipData] = useState<any>(null);

    useEffect(() => {
        if (activeField) {
            fetchRecommendation("finance", "medium", activeField).then((data) =>
                setTooltipData(data)
            );
        }
    }, [activeField]);

    return (
        <div className="space-y-4">
            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "interestRate" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Interest Rate (%)</label>
                <input
                    type="number"
                    value={financing.interestRate}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-32"
                    onFocus={() => setActiveField("interestRate")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setFinancing({ ...financing, interestRate: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Typical financing rates: 4–6%"}
                    source={tooltipData?.source || "Based on 15 similar projects"}
                    confidence={tooltipData?.confidence || 0.8}
                    visible={activeField === "interestRate"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "currencyExchangeImpact" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Currency Exchange Impact ($)</label>
                <input
                    type="number"
                    value={financing.currencyExchangeImpact}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("currencyExchangeImpact")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setFinancing({ ...financing, currencyExchangeImpact: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Exchange impact averages $1.5k–2.5k"}
                    source={tooltipData?.source || "Based on 10 similar projects"}
                    confidence={tooltipData?.confidence || 0.76}
                    visible={activeField === "currencyExchangeImpact"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "insuranceCost" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Insurance Cost ($)</label>
                <input
                    type="number"
                    value={financing.insuranceCost}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("insuranceCost")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setFinancing({ ...financing, insuranceCost: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Insurance typically costs $1k–2k"}
                    source={tooltipData?.source || "Based on 8 similar projects"}
                    confidence={tooltipData?.confidence || 0.72}
                    visible={activeField === "insuranceCost"}
                />
            </div>
        </div>
    );
}
