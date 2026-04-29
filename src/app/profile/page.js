import { Suspense } from "react";
import Profile from "@/components/profile/profileDashboard";

export const dynamic = "force-dynamic";

const ProfilePage = () => {
  return (
    <Suspense>
      <Profile />
    </Suspense>
  );
};

export default ProfilePage;
