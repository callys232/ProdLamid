// components/EstimateSummary.tsx
import { useState, useEffect } from "react";

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
}

export default function EstimateSummary(props: SummaryProps) {
    const [grandTotal, setGrandTotal] = useState(0);

    useEffect(() => {
        const total =
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
            props.financingTotal;

        setGrandTotal(total);
    }, [props]);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-bold border-b-2 border-[#c12129] mb-4">
                Estimate Summary
            </h2>

            <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                    <span>Labor</span>
                    <span>${props.laborTotal.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                    <span>Materials</span>
                    <span>${props.materialsTotal.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                    <span>Technology</span>
                    <span>${props.technologyTotal.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                    <span>Timeline & Overheads</span>
                    <span>${props.timelineTotal.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                    <span>Risk</span>
                    <span>${props.riskTotal.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                    <span>Regulatory</span>
                    <span>${props.regulatoryTotal.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                    <span>QA</span>
                    <span>${props.qaTotal.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                    <span>Client Side</span>
                    <span>${props.clientTotal.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                    <span>Sustainability</span>
                    <span>${props.sustainabilityTotal.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                    <span>Vendors</span>
                    <span>${props.vendorTotal.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                    <span>Lifecycle</span>
                    <span>${props.lifecycleTotal.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                    <span>Financing</span>
                    <span>${props.financingTotal.toLocaleString()}</span>
                </p>
            </div>

            <div className="mt-6 p-4 bg-black text-white rounded-lg flex justify-between items-center">
                <span className="font-semibold">Grand Total</span>
                <span className="text-[#c12129] font-bold text-lg">
                    ${grandTotal.toLocaleString()}
                </span>
            </div>
        </div>
    );
}
