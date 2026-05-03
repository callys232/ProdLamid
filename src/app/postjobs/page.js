"use client";

import PostJobs from "@/components/postjobs/jobPost";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const PostJobsPage = () => {
  const router = useRouter();

  const handlePostProject = async (projectData) => {
    try {
      const res  = await fetch("/api/projects", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(projectData),
      });
      const data = await res.json();

      if (res.status === 402 || data.code === "INSUFFICIENT_POINTS") {
        toast.error(
          `Not enough points to post. You need 50 pts — buy more to continue.`,
          { duration: 5000 }
        );
        // Short pause then open purchase modal via URL flag
        setTimeout(() => router.push("/client?tab=settings&buyPoints=1"), 1200);
        return;
      }

      if (!data.success) {
        toast.error(data.message || "Failed to post project");
        return;
      }

      toast.success("Project posted! 50 points used.");
      router.push("/client?tab=projects");
    } catch (err) {
      console.error("Error posting project:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <PostJobs onSubmit={handlePostProject} />
    </div>
  );
};

export default PostJobsPage;
