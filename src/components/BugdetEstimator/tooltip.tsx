interface TooltipProps {
    recommendation: string;
    source?: string;
    confidence?: number;
    visible: boolean;
    loading?: boolean;
}

export default function Tooltip({
    recommendation,
    source,
    confidence,
    visible,
    loading,
}: TooltipProps) {
    if (!visible) return null;

    return (
        <div
            className="
                absolute z-20 mt-2
                w-[min(320px,90vw)]
                bg-black text-white text-sm
                rounded-xl shadow-xl
                p-3
                border border-white/10
            "
        >
            {loading ? (
                <div className="flex items-center gap-2 text-gray-300">
                    <span className="h-2 w-2 bg-[#c12129] rounded-full animate-pulse" />
                    <span>Analyzing similar projects...</span>
                </div>
            ) : (
                <div className="space-y-1">
                    <p className="font-semibold text-[#c12129]">
                        AI Recommendation
                    </p>

                    <p className="text-white/90 leading-snug">
                        {recommendation}
                    </p>

                    {source && (
                        <p className="text-white/50 text-xs">
                            {source}
                        </p>
                    )}

                    {typeof confidence === "number" && (
                        <p className="text-green-400 text-xs">
                            Confidence: {Math.round(confidence * 100)}%
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}