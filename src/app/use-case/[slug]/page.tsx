import { notFound } from "next/navigation";
import type { Metadata } from "next";
import UseCaseView from "@/components/lamidOne/UseCaseView";
import { USE_CASES, getUseCase } from "@/lib/useCases";

/** Prerender every use case — the set is fixed and known at build time. */
export function generateStaticParams() {
  return USE_CASES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const u = getUseCase(slug);
  if (!u) return { title: "Use case not found — LAMID ONE" };

  return {
    title: `${u.ask} — ${u.name} | LAMID ONE`,
    description: u.teaser,
  };
}

export default async function UseCaseDetail(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const useCase = getUseCase(slug);

  // An unknown slug is a 404, not an empty page.
  if (!useCase) notFound();

  return <UseCaseView useCase={useCase} />;
}
