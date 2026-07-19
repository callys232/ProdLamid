import React, { useMemo } from "react";

interface SummaryProps {
    laborTotal: number;
    materialsTotal: number;
    technologyTotal: number;
    timelineTotal: number;
    riskTotal: number;
    regulatoryTotal: number;
    qaTotal: number;
    clientTotal: number;
    sustainabilityTotal: number;
    vendorTotal: number;
    lifecycleTotal: number;
    financingTotal: number;
    estimate?: any;
}

export default function EstimateSummary(props: SummaryProps) {

    const grandTotal = useMemo(() => {
        return (
            props.laborTotal +
            props.materialsTotal +
            props.technologyTotal +
            props.timelineTotal +
            props.riskTotal +
            props.regulatoryTotal +
            props.qaTotal +
            props.clientTotal +
            props.sustainabilityTotal +
            props.vendorTotal +
            props.lifecycleTotal +
            props.financingTotal
        );
    }, [props]);

    const rows = [
        ["Labor", props.laborTotal],
        ["Materials", props.materialsTotal],
        ["Technology", props.technologyTotal],
        ["Timeline & Overheads", props.timelineTotal],
        ["Risk", props.riskTotal],
        ["Regulatory", props.regulatoryTotal],
        ["QA", props.qaTotal],
        ["Client Side", props.clientTotal],
        ["Sustainability", props.sustainabilityTotal],
        ["Vendors", props.vendorTotal],
        ["Lifecycle", props.lifecycleTotal],
        ["Financing", props.financingTotal],
    ] as const;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">

            <h2 className="text-xl font-bold border-b-2 border-[#2563EB] mb-4">
                Estimate Summary
            </h2>

            <div className="space-y-2 text-sm">
                {rows.map(([label, value]) => (
                    <p key={label} className="flex justify-between">
                        <span>{label}</span>
                        <span>${value.toLocaleString()}</span>
                    </p>
                ))}
            </div>

            <div className="mt-6 p-4 bg-black text-white rounded-lg flex justify-between items-center">
                <span className="font-semibold">Grand Total</span>
                <span className="text-[#2563EB] font-bold text-lg">
                    ${grandTotal.toLocaleString()}
                </span>
            </div>

        </div>
    );
}