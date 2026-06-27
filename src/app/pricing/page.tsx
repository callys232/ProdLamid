import SaasPricingSection from "@/components/subscription/SaasPricingSection";

export const metadata = {
  title: "Pricing — AIVORA",
  description: "Flexible plans for every stage of growth. No contracts. No surprises. Cancel anytime.",
};

export default function PricingPage() {
  return (
    <main className="bg-black pt-20">
      <SaasPricingSection />
    </main>
  );
}
