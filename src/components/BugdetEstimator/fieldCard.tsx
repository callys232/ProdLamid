import Tooltip from "./tooltip";

interface Props {
    active: boolean;
    label: string;
    children: React.ReactNode;
    tooltip?: {
        recommendation?: string;
        source?: string;
        confidence?: number;
    };
}

export default function FieldCard({ active, label, children, tooltip }: Props) {
    return (
        <div
            className={`relative p-4 rounded-lg shadow transition ${active ? "bg-red-50 border border-[#c12129]" : "bg-white"
                }`}
        >
            <label className="block text-sm font-semibold mb-2">
                {label}
            </label>

            {children}

            <Tooltip
                recommendation={tooltip?.recommendation || ""}
                source={tooltip?.source || ""}
                confidence={tooltip?.confidence || 0.7}
                visible={active}
            />
        </div>
    );
}