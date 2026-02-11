"use client";

import PostJobs from "@/components/postjobs/jobPost";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

const ProfilePage = () => {
  const router = useRouter();

  const handlePostProject = async (projectData) => {
    try {
      const res = await axios.post("/api/projects", projectData);
      if (res.data.success) {
        toast.success("Project posted successfully! 🚀");
        router.push("/client");
      } else {
        toast.error(res.data.message || "Failed to post project");
      }
    } catch (err) {
      console.error("Error posting project:", err);
      toast.error(err.response?.data?.message || "Something went wrong ❌");
    }
  };

  return (
    <div>
      <PostJobs onSubmit={handlePostProject} />
    </div>
  );
};

export default ProfilePage;
