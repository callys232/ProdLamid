// components/MaterialsInput.tsx
import { useState, useEffect } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

interface MaterialItem {
    item: string;
    unitCost: number;
    quantity: number;
    category: "raw" | "equipment" | "consumable" | "";
}

export default function MaterialsInput() {
    const [materials, setMaterials] = useState<MaterialItem[]>([
        { item: "Steel", unitCost: 100, quantity: 10, category: "raw" },
    ]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [tooltipData, setTooltipData] = useState<any>(null);

    useEffect(() => {
        if (activeIndex !== null) {
            const material = materials[activeIndex].item || "material";
            fetchRecommendation("construction", "medium", "unitCost", material).then((data) =>
                setTooltipData(data)
            );
        }
    }, [activeIndex]);

    return (
        <div className="space-y-4">
            {materials.map((m, i) => (
                <div
                    key={i}
                    className={`relative flex items-center space-x-4 p-4 rounded-lg shadow transition ${activeIndex === i ? "bg-red-50 border border-[#c12129]" : "bg-white"
                        }`}
                >
                    <input
                        type="text"
                        value={m.item}
                        placeholder="Material"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition flex-1"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const newMaterials = [...materials];
                            newMaterials[i].item = e.target.value;
                            setMaterials(newMaterials);
                        }}
                    />

                    <input
                        type="number"
                        value={m.unitCost}
                        placeholder="Unit Cost"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-24"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const newMaterials = [...materials];
                            newMaterials[i].unitCost = Number(e.target.value);
                            setMaterials(newMaterials);
                        }}
                    />

                    <input
                        type="number"
                        value={m.quantity}
                        placeholder="Quantity"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-24"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const newMaterials = [...materials];
                            newMaterials[i].quantity = Number(e.target.value);
                            setMaterials(newMaterials);
                        }}
                    />

                    <select
                        value={m.category}
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-32"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const newMaterials = [...materials];
                            newMaterials[i].category = e.target.value as MaterialItem["category"];
                            setMaterials(newMaterials);
                        }}
                    >
                        <option value="">Category</option>
                        <option value="raw">Raw</option>
                        <option value="equipment">Equipment</option>
                        <option value="consumable">Consumable</option>
                    </select>

                    {/* Tooltip appears when input is focused */}
                    <Tooltip
                        recommendation={tooltipData?.recommendation || "Typical unit cost range: $80–120"}
                        source={tooltipData?.source || "Based on 10 similar construction projects"}
                        confidence={tooltipData?.confidence || 0.75}
                        visible={activeIndex === i}
                    />
                </div>
            ))}

            <button
                onClick={() =>
                    setMaterials([...materials, { item: "", unitCost: 0, quantity: 0, category: "" }])
                }
                className="bg-[#c12129] text-white px-4 py-2 rounded hover:bg-black hover:text-[#c12129] transition"
            >
                + Add Material
            </button>
        </div>
    );
}
