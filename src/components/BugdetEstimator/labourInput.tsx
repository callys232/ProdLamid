import { useState, useEffect } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

interface LaborRole {
    role: string;
    hourlyRate: number;
    hours: number;
}

export default function LaborInput() {
    const [roles, setRoles] = useState<LaborRole[]>([
        { role: "Developer", hourlyRate: 50, hours: 40 },
    ]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [tooltipData, setTooltipData] = useState<any>(null);

    useEffect(() => {
        if (activeIndex !== null) {
            const role = roles[activeIndex].role || "developer";
            fetchRecommendation("it", "medium", "hourlyRate", role).then((data) =>
                setTooltipData(data)
            );
        }
    }, [activeIndex]);

    return (
        <div className="space-y-4">
            {roles.map((r, i) => (
                <div
                    key={i}
                    className={`relative flex items-center space-x-4 p-4 rounded-lg shadow transition ${activeIndex === i ? "bg-red-50 border border-[#c12129]" : "bg-white"
                        }`}
                >
                    <input
                        type="text"
                        value={r.role}
                        placeholder="Role"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition flex-1"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const newRoles = [...roles];
                            newRoles[i].role = e.target.value;
                            setRoles(newRoles);
                        }}
                    />

                    <input
                        type="number"
                        value={r.hourlyRate}
                        placeholder="Hourly Rate"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-24"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const newRoles = [...roles];
                            newRoles[i].hourlyRate = Number(e.target.value);
                            setRoles(newRoles);
                        }}
                    />

                    <input
                        type="number"
                        value={r.hours}
                        placeholder="Hours"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-24"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const newRoles = [...roles];
                            newRoles[i].hours = Number(e.target.value);
                            setRoles(newRoles);
                        }}
                    />

                    <Tooltip
                        recommendation={tooltipData?.recommendation || "Loading..."}
                        source={tooltipData?.source || ""}
                        confidence={tooltipData?.confidence || 0.7}
                        visible={activeIndex === i}
                    />
                </div>
            ))}

            <button
                onClick={() => setRoles([...roles, { role: "", hourlyRate: 0, hours: 0 }])}
                className="bg-[#c12129] text-white px-4 py-2 rounded hover:bg-black hover:text-[#c12129] transition"
            >
                + Add Role
            </button>
        </div>
    );
}
