import BudgetEstimator from "@/components/BugdetEstimator/estimator";

interface Props {
    premiumUser?: boolean;
    onUpgrade?: () => void;
    mode?: string;
    project?: any;
}

export default function BudgetEstimatorGate({
    premiumUser,
    onUpgrade,
    mode = "inline",
    project,
}: Props) {

    if (!premiumUser) {
        return (
            <div className="space-y-5">

                <div className="rounded-xl overflow-hidden border bg-black shadow-md">
                    <video
                        src="/videos/estimator-preview.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full opacity-90"
                    />
                </div>

                <div className="text-sm text-gray-500">
                    See how AI predicts budgets, timelines, and cost breakdowns.
                </div>

                <button
                    onClick={onUpgrade}
                    className="w-full py-2 bg-[#c21219] text-white rounded-lg
                     hover:brightness-110 active:scale-[0.98]"
                >
                    Upgrade to Premium
                </button>

            </div>
        );
    }

    return (
        <div className="space-y-4">

            {mode === "modal" && (
                <div className="text-sm text-gray-500">
                    AI-powered estimation based on your project scope
                </div>
            )}

            <div className="animate-fade-in">
                <BudgetEstimator project={project} />
            </div>

        </div>
    );
}