
import { Suspense } from "react";
import ClientProfile from "@/components/client/clientDashboard";

export const dynamic = "force-dynamic";

const ClientPage = () => {
  return (
    <Suspense>
      <ClientProfile />
    </Suspense>
  );
};

export default ClientPage;
