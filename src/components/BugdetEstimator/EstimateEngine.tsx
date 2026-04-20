import { createContext, useContext, useState } from "react";

type CostMap = Record<string, number>;

interface EngineContextType {
    costs: CostMap;
    updateCost: (key: string, value: number) => void;
}

const EstimateEngineContext = createContext<EngineContextType | null>(null);

export function EstimateEngineProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [costs, setCosts] = useState<CostMap>({
        labor: 0,
        materials: 0,
        technology: 0,
        timeline: 0,
        risk: 0,
        regulatory: 0,
        qa: 0,
        client: 0,
        sustainability: 0,
        vendor: 0,
        lifecycle: 0,
        financing: 0,
    });

    const updateCost = (key: string, value: number) => {
        setCosts((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <EstimateEngineContext.Provider value={{ costs, updateCost }}>
            {children}
        </EstimateEngineContext.Provider>
    );
}

export function useEstimateEngine() {
    const ctx = useContext(EstimateEngineContext);
    if (!ctx) throw new Error("Must use inside provider");
    return ctx;
}