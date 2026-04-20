import { useState, useMemo } from "react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

interface LifecycleItem {
    maintenanceCost: number;
    supportSLA: string;
    upgradeBudget: number;
}

export default function LifecycleInput() {
    const [lifecycle, setLifecycle] = useState<LifecycleItem>({
        maintenanceCost: 4000,
        supportSLA: "12 months",
        upgradeBudget: 6000,
    });

    const [activeField, setActiveField] = useState<string | null>(null);

    const update = (field: keyof LifecycleItem, value: number | string) => {
        setLifecycle((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Stabilized values (prevents unnecessary hook re-triggers)
    const maintenanceValue = useMemo(
        () => String(lifecycle.maintenanceCost),
        [lifecycle.maintenanceCost]
    );

    const slaValue = useMemo(
        () => lifecycle.supportSLA,
        [lifecycle.supportSLA]
    );

    const upgradeValue = useMemo(
        () => String(lifecycle.upgradeBudget),
        [lifecycle.upgradeBudget]
    );

    const maintenance = useFieldRecommendation({
        enabled: activeField === "maintenanceCost",
        industry: "it",
        complexity: "medium",
        field: "maintenanceCost",
        keyword: String(lifecycle.maintenanceCost),
    });

    const sla = useFieldRecommendation({
        enabled: activeField === "supportSLA",
        industry: "it",
        complexity: "medium",
        field: "supportSLA",
        keyword: lifecycle.supportSLA,
    });

    const upgrade = useFieldRecommendation({
        enabled: activeField === "upgradeBudget",
        industry: "it",
        complexity: "medium",
        field: "upgradeBudget",
        keyword: String(lifecycle.upgradeBudget),
    });

    const focusField = (field: keyof LifecycleItem) => setActiveField(field);

    const blurField = () => setTimeout(() => setActiveField(null), 150);

    return (
        <div className="space-y-4">

            {/* ================= MAINTENANCE ================= */}
            <div
                className={`relative p-4 rounded-lg shadow transition
                ${activeField === "maintenanceCost" ? "bg-red-50 border border-[#c12129]" : "bg-white"}`}
            >
                <label className="block text-sm font-semibold mb-2">
                    Maintenance Cost
                </label>

                <input
                    type="number"
                    value={lifecycle.maintenanceCost}
                    onFocus={() => focusField("maintenanceCost")}
                    onBlur={blurField}
                    onChange={(e) =>
                        update("maintenanceCost", Number(e.target.value))
                    }
                    className="border-b-2 w-40"
                />

                <Tooltip
                    visible={activeField === "maintenanceCost"}
                    recommendation={
                        maintenance.data?.recommendation ||
                        "Maintenance averages $3k–5k annually"
                    }
                    source={maintenance.data?.source}
                    confidence={maintenance.data?.confidence || 0.8}
                    loading={maintenance.loading}
                />
            </div>

            {/* ================= SLA ================= */}
            <div
                className={`relative p-4 rounded-lg shadow transition
                ${activeField === "supportSLA" ? "bg-red-50 border border-[#c12129]" : "bg-white"}`}
            >
                <label className="block text-sm font-semibold mb-2">
                    Support SLA
                </label>

                <input
                    type="text"
                    value={lifecycle.supportSLA}
                    onFocus={() => focusField("supportSLA")}
                    onBlur={blurField}
                    onChange={(e) => update("supportSLA", e.target.value)}
                    className="border-b-2 w-40"
                />

                <Tooltip
                    visible={activeField === "supportSLA"}
                    recommendation={
                        sla.data?.recommendation ||
                        "Typical SLA: 12–24 months"
                    }
                    source={sla.data?.source}
                    confidence={sla.data?.confidence || 0.76}
                    loading={sla.loading}
                />
            </div>

            {/* ================= UPGRADE ================= */}
            <div
                className={`relative p-4 rounded-lg shadow transition
                ${activeField === "upgradeBudget" ? "bg-red-50 border border-[#c12129]" : "bg-white"}`}
            >
                <label className="block text-sm font-semibold mb-2">
                    Upgrade Budget
                </label>

                <input
                    type="number"
                    value={lifecycle.upgradeBudget}
                    onFocus={() => focusField("upgradeBudget")}
                    onBlur={blurField}
                    onChange={(e) =>
                        update("upgradeBudget", Number(e.target.value))
                    }
                    className="border-b-2 w-40"
                />

                <Tooltip
                    visible={activeField === "upgradeBudget"}
                    recommendation={
                        upgrade.data?.recommendation ||
                        "Upgrades typically cost 8–12% of project budget"
                    }
                    source={upgrade.data?.source}
                    confidence={upgrade.data?.confidence || 0.74}
                    loading={upgrade.loading}
                />
            </div>
        </div>
    );
}