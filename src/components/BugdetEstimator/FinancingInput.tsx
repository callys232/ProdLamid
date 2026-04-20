import { useState } from "react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

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

    const common = {
        industry: "finance",
        complexity: "medium",
    };

    const interest = useFieldRecommendation({
        ...common,
        field: "interestRate",
        enabled: activeField === "interestRate",
    });

    const exchange = useFieldRecommendation({
        ...common,
        field: "currencyExchangeImpact",
        enabled: activeField === "currencyExchangeImpact",
    });

    const insurance = useFieldRecommendation({
        ...common,
        field: "insuranceCost",
        enabled: activeField === "insuranceCost",
    });

    const update = (field: keyof FinancingItem, value: number) =>
        setFinancing((p) => ({ ...p, [field]: value }));

    return (
        <div className="space-y-4 text-red-500">

            {/* INTEREST */}
            <div className={`relative p-4 rounded-lg shadow ${activeField === "interestRate" ? "bg-red-50 border border-[#c12129]" : "bg-white"}`}>
                <label className="block text-sm font-semibold mb-2">Interest Rate (%)</label>

                <input
                    type="number"
                    value={financing.interestRate}
                    onFocus={() => setActiveField("interestRate")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => update("interestRate", Number(e.target.value))}
                    className="border-b-2 w-32"
                />

                <Tooltip
                    visible={activeField === "interestRate"}
                    recommendation={interest.data?.recommendation || "Typical rates: 4–6%"}
                    source={interest.data?.source}
                    confidence={interest.data?.confidence || 0.8}
                    loading={interest.loading}
                />
            </div>

            {/* EXCHANGE */}
            <div className={`relative p-4 rounded-lg shadow ${activeField === "currencyExchangeImpact" ? "bg-red-50 border border-[#c12129]" : "bg-white"}`}>
                <label className="block text-sm font-semibold mb-2">Exchange Impact</label>

                <input
                    type="number"
                    value={financing.currencyExchangeImpact}
                    onFocus={() => setActiveField("currencyExchangeImpact")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => update("currencyExchangeImpact", Number(e.target.value))}
                    className="border-b-2 w-40"
                />

                <Tooltip
                    visible={activeField === "currencyExchangeImpact"}
                    recommendation={exchange.data?.recommendation || "Avg $1.5k–2.5k"}
                    source={exchange.data?.source}
                    confidence={exchange.data?.confidence || 0.76}
                    loading={exchange.loading}
                />
            </div>

            {/* INSURANCE */}
            <div className={`relative p-4 rounded-lg shadow ${activeField === "insuranceCost" ? "bg-red-50 border border-[#c12129]" : "bg-white"}`}>
                <label className="block text-sm font-semibold mb-2">Insurance Cost</label>

                <input
                    type="number"
                    value={financing.insuranceCost}
                    onFocus={() => setActiveField("insuranceCost")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => update("insuranceCost", Number(e.target.value))}
                    className="border-b-2 w-40"
                />

                <Tooltip
                    visible={activeField === "insuranceCost"}
                    recommendation={insurance.data?.recommendation || "Avg $1k–2k"}
                    source={insurance.data?.source}
                    confidence={insurance.data?.confidence || 0.72}
                    loading={insurance.loading}
                />
            </div>
        </div>
    );
}