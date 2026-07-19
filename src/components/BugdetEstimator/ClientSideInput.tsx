import React from "react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

/* ================= STRICT FIELD TYPE ================= */
type ClientSideField =
    | "trainingHours"
    | "workshopCost"
    | "adoptionBudget";

interface ClientSideItem {
    trainingHours: number;
    workshopCost: number;
    adoptionBudget: number;
}

interface Props {
    value: ClientSideItem;
    onChange: (val: ClientSideItem) => void;
    suggestions?: any;
}

/* ================= REUSABLE FIELD BLOCK ================= */
function FieldBlock({
    label,
    field,
    value,
    activeField,
    setActiveField,
    onChange,
    hook,
    fallback,
}: {
    label: string;
    field: ClientSideField;
    value: number;
    activeField: ClientSideField | null;
    setActiveField: (f: ClientSideField | null) => void;
    onChange: (f: ClientSideField, v: number) => void;
    hook: any;
    fallback: string;
}) {
    return (
        <div
            className={`relative p-4 rounded-lg shadow transition bg-white
            ${activeField === field ? "bg-blue-50 border border-[#2563EB]" : ""}`}
        >
            <label className="block text-sm font-semibold mb-2">
                {label}
            </label>

            <input
                type="number"
                value={value ?? 0}
                onFocus={() => setActiveField(field)}
                onBlur={() => setActiveField(null)}
                onChange={(e) => onChange(field, Number(e.target.value))}
                className="border-b-2 border-gray-300 focus:border-[#2563EB] transition w-40"
            />

            <Tooltip
                visible={activeField === field}
                loading={hook.loading}
                recommendation={
                    hook.data?.recommendation ||
                    fallback
                }
                source={hook.data?.source}
                confidence={hook.data?.confidence || 0.75}
            />
        </div>
    );
}

/* ================= MAIN COMPONENT ================= */
export default function ClientSideInput({
    value,
    onChange,
    suggestions,
}: Props) {

    const [activeField, setActiveField] =
        React.useState<ClientSideField | null>(null);

    /* ================= SAFE UPDATE ================= */
    const update = (field: ClientSideField, val: number) => {
        onChange({
            ...value,
            [field]: val,
        });
    };

    /* ================= AI HOOKS ================= */
    const training = useFieldRecommendation({
        enabled: (value?.trainingHours ?? 0) > 0,
        industry: "consulting",
        complexity: "medium",
        field: "trainingHours",
        keyword: String(value?.trainingHours ?? 0),
    });

    const workshop = useFieldRecommendation({
        enabled: (value?.workshopCost ?? 0) > 0,
        industry: "consulting",
        complexity: "medium",
        field: "workshopCost",
        keyword: String(value?.workshopCost ?? 0),
    });

    const adoption = useFieldRecommendation({
        enabled: (value?.adoptionBudget ?? 0) > 0,
        industry: "consulting",
        complexity: "medium",
        field: "adoptionBudget",
        keyword: String(value?.adoptionBudget ?? 0),
    });

    return (
        <div className="space-y-4">

            {/* ================= TRAINING ================= */}
            <FieldBlock
                label="Training Hours"
                field="trainingHours"
                value={value?.trainingHours ?? 0}
                activeField={activeField}
                setActiveField={setActiveField}
                onChange={update}
                hook={training}
                fallback={
                    suggestions?.trainingHours ||
                    "Typical training: 30–50 hours"
                }
            />

            {/* ================= WORKSHOP ================= */}
            <FieldBlock
                label="Workshop Cost"
                field="workshopCost"
                value={value?.workshopCost ?? 0}
                activeField={activeField}
                setActiveField={setActiveField}
                onChange={update}
                hook={workshop}
                fallback={
                    suggestions?.workshopCost ||
                    "Workshops typically cost $2k–4k"
                }
            />

            {/* ================= ADOPTION ================= */}
            <FieldBlock
                label="Adoption Budget"
                field="adoptionBudget"
                value={value?.adoptionBudget ?? 0}
                activeField={activeField}
                setActiveField={setActiveField}
                onChange={update}
                hook={adoption}
                fallback={
                    suggestions?.adoptionBudget ||
                    "Adoption budgets average $4k–6k"
                }
            />

        </div>
    );
}