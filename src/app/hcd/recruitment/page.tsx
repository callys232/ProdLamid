import { Suspense } from "react";
import RecruitmentDashboard from "@/components/recruitment/RecruitmentDashboard";

export const metadata = {
  title:       "Recruitment Hub | LAMID TALENT",
  description: "Explore open roles and manage your hiring pipeline — powered by LAMID TALENT.",
};

export default function RecruitmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin" />
      </div>
    }>
      <RecruitmentDashboard />
    </Suspense>
  );
}
