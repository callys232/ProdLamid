import { MatchResult } from "@/types/aiMatch";

export default function ComparePanel({
    a,
    b,
}: {
    a?: MatchResult;
    b?: MatchResult;
}) {
    if (!a || !b) return null;

    const winner = a.score.total > b.score.total ? a : b;
    const aName = a.consultant.name;
    const bName = b.consultant.name;

    function diff(label: string, av: number, bv: number) {
        if (av === bv) return `Equal in ${label}`;

        return av > bv
            ? `${aName} leads in ${label}`
            : `${bName} leads in ${label}`;
    }

    return (
        <div className="mt-8 border rounded-lg p-5 bg-white shadow-sm">

            <h2 className="font-semibold text-lg text-black mb-4">
                AI Comparison Insight
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
                <p>{diff("AI Match", a.score.semantic, b.score.semantic)}</p>
                <p>{diff("Skill Coverage", a.score.skillMatch, b.score.skillMatch)}</p>
                <p>{diff("Experience", a.score.experience, b.score.experience)}</p>
                <p>{diff("Rating", a.score.rating, b.score.rating)}</p>
            </div>

            <div className="mt-4 bg-gray-50 p-3 rounded">
                <p className="text-sm text-black">
                    <span className="text-[#2563EB] font-semibold">
                        {winner.consultant.name}
                    </span>{" "}
                    is the better overall match.
                </p>
            </div>

        </div>
    );
}