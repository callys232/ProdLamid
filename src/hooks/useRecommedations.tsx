import { useEffect, useState } from "react";
import { fetchRecommendation } from "@/utils/api";

interface Params {
    industry: string;
    complexity: string;
    field: string;
    keyword?: string;
    enabled: boolean;
}

export function useFieldRecommendation({
    industry,
    complexity,
    field,
    keyword,
    enabled,
}: Params) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        let cancelled = false;
        setLoading(true);

        const t = setTimeout(() => {
            fetchRecommendation(industry, complexity, field, keyword).then((res) => {
                if (!cancelled) {
                    setData(res);
                    setLoading(false);
                }
            });
        }, 250);

        return () => {
            cancelled = true;
            clearTimeout(t);
        };
    }, [enabled, industry, complexity, field, keyword]);

    return { data, loading };
}