import { useState } from "react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

interface MaterialItem {
    item: string;
    unitCost: number;
    quantity: number;
    category: string;
}

export default function MaterialsInput() {
    const [items, setItems] = useState<MaterialItem[]>([
        { item: "Steel", unitCost: 100, quantity: 10, category: "raw" },
    ]);

    const [active, setActive] = useState<number | null>(null);

    // 🔥 Per-row AI cache hooks (safe pattern)
    const aiMap = items.map((m, i) =>
        useFieldRecommendation({
            enabled: active === i,
            industry: "construction",
            complexity: "medium",
            field: "unitCost",
            keyword: m.item,
        })
    );

    const update = (
        index: number,
        field: keyof MaterialItem,
        value: any
    ) => {
        const copy = [...items];
        copy[index] = {
            ...copy[index],
            [field]: value,
        };
        setItems(copy);
    };

    return (
        <div className="space-y-4">

            {items.map((m, i) => {
                const ai = aiMap[i];

                return (
                    <div
                        key={i}
                        className={`relative flex gap-4 p-4 rounded-lg shadow transition ${active === i
                                ? "bg-red-50 border border-[#c12129]"
                                : "bg-white"
                            }`}
                    >

                        {/* ================= ITEM ================= */}
                        <input
                            value={m.item}
                            onFocus={() => setActive(i)}
                            onBlur={() => setActive(null)}
                            onChange={(e) =>
                                update(i, "item", e.target.value)
                            }
                            className="flex-1 border-b text-gray-800"
                        />

                        {/* ================= COST ================= */}
                        <input
                            type="number"
                            value={m.unitCost}
                            onFocus={() => setActive(i)}
                            onBlur={() => setActive(null)}
                            onChange={(e) =>
                                update(i, "unitCost", Number(e.target.value))
                            }
                            className="w-24 border-b text-gray-900"
                        />

                        {/* ================= TOOLTIP ================= */}
                        <Tooltip
                            visible={active === i}
                            loading={ai.loading}
                            recommendation={
                                ai.data?.recommendation ||
                                "Typical material pricing varies by market"
                            }
                            source={ai.data?.source || ""}
                            confidence={ai.data?.confidence || 0.8}
                        />
                    </div>
                );
            })}
        </div>
    );
}