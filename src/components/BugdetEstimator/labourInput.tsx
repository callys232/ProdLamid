import { useState } from "react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

export default function LaborInput() {
    const [roles, setRoles] = useState([
        { role: "Developer", hourlyRate: 50, hours: 40 },
    ]);

    const [active, setActive] = useState<number | null>(null);

    const { data, loading } = useFieldRecommendation({
        enabled: active !== null,
        industry: "it",
        complexity: "medium",
        field: "hourlyRate",
        keyword: roles[active ?? 0]?.role,
    });

    return (
        <div className="space-y-4">
            {roles.map((r, i) => (
                <div
                    key={i}
                    className={`relative flex gap-4 p-4 rounded-lg shadow ${active === i ? "bg-red-50 border border-[#c12129]" : "bg-white"
                        }`}
                >
                    <input
                        value={r.role}
                        onFocus={() => setActive(i)}
                        onBlur={() => setActive(null)}
                        onChange={(e) => {
                            const copy = [...roles];
                            copy[i].role = e.target.value;
                            setRoles(copy);
                        }}
                        className="flex-1 border-b"
                    />

                    <input
                        type="number"
                        value={r.hourlyRate}
                        onFocus={() => setActive(i)}
                        onBlur={() => setActive(null)}
                        onChange={(e) => {
                            const copy = [...roles];
                            copy[i].hourlyRate = Number(e.target.value);
                            setRoles(copy);
                        }}
                        className="w-24 border-b"
                    />

                    <input
                        type="number"
                        value={r.hours}
                        onFocus={() => setActive(i)}
                        onBlur={() => setActive(null)}
                        onChange={(e) => {
                            const copy = [...roles];
                            copy[i].hours = Number(e.target.value);
                            setRoles(copy);
                        }}
                        className="w-24 border-b"
                    />

                    <Tooltip
                        visible={active === i}
                        loading={loading}
                        recommendation={data?.recommendation || ""}
                        source={data?.source}
                        confidence={data?.confidence}
                    />
                </div>
            ))}
        </div>
    );
}