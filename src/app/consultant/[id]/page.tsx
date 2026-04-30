import { Suspense } from "react";
import { notFound } from "next/navigation";
import ConsultantPublicProfile from "@/components/consultant/PublicProfile";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const base = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
    const res  = await fetch(`${base}/api/consultants/${id}`, { cache: "no-store" });
    if (!res.ok) return { title: "Consultant — Lamid" };
    const { data } = await res.json();
    const name = data.profile?.firstName
      ? `${data.profile.firstName} ${data.profile.lastName ?? ""}`.trim()
      : data.username;
    return {
      title:       `${name} — ${data.profile?.title ?? "Consultant"} | Lamid`,
      description: data.profile?.bio ?? `View ${name}'s consulting profile on Lamid.`,
      openGraph: {
        title:  `${name} — Lamid Consulting`,
        images: data.profile?.profilePicture ? [data.profile.profilePicture] : [],
      },
    };
  } catch {
    return { title: "Consultant — Lamid" };
  }
}

export default async function ConsultantPage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense>
      <ConsultantPublicProfile consultantId={id} />
    </Suspense>
  );
}
