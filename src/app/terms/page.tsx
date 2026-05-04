export const metadata = { title: "Terms of Service — Lamid" };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="mb-3 text-lg font-bold text-white">{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed text-gray-400">{children}</div>
  </section>
);

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-24 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <span className="mb-3 inline-block rounded-full border border-[#c12129]/40 bg-[#c12129]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#c12129]">Legal</span>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: May 2026</p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using Lamid ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>
        </Section>

        <Section title="2. Description of Service">
          <p>Lamid is an AI-powered consulting marketplace that connects Clients (organisations seeking expertise) with Consultants (independent professionals). The Platform provides project posting, bidding, messaging, milestone tracking, and escrow payment services.</p>
        </Section>

        <Section title="3. User Accounts">
          <p>You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account.</p>
          <p>You agree to provide accurate and complete information. Lamid reserves the right to suspend or terminate accounts that violate these Terms.</p>
        </Section>

        <Section title="4. Consultant and Client Obligations">
          <p><strong className="text-white">Consultants</strong> agree to deliver work as described in agreed project scopes and to not misrepresent their qualifications.</p>
          <p><strong className="text-white">Clients</strong> agree to fund escrow milestones promptly and to release payment upon satisfactory delivery.</p>
        </Section>

        <Section title="5. Payments and Escrow">
          <p>All payments are processed via Paystack. Lamid holds milestone payments in escrow and releases them upon Client approval. A platform fee of up to 5% applies to each transaction.</p>
          <p>Disputed payments are subject to Lamid's dispute resolution process. Lamid's decision is final in cases where mediation is required.</p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>Upon full payment for a project, intellectual property rights for deliverables transfer to the Client unless otherwise agreed in writing between the parties.</p>
        </Section>

        <Section title="7. Prohibited Conduct">
          <p>You may not: circumvent the Platform to pay or receive payment outside of Lamid; post false, misleading, or fraudulent information; harass, threaten, or abuse other users; or engage in any activity that violates applicable law.</p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>Lamid is not liable for any indirect, incidental, or consequential damages arising from use of the Platform. Lamid's total liability shall not exceed the fees paid by you in the 12 months preceding the claim.</p>
        </Section>

        <Section title="9. Termination">
          <p>Lamid may suspend or terminate your account at any time for violation of these Terms. You may close your account at any time via your account settings.</p>
        </Section>

        <Section title="10. Governing Law">
          <p>These Terms are governed by the laws of Nigeria. Disputes shall be resolved in the courts of Lagos, Nigeria.</p>
        </Section>

        <Section title="11. Changes to Terms">
          <p>Lamid reserves the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the new Terms.</p>
        </Section>

        <Section title="12. Contact">
          <p>For legal enquiries: <a href="mailto:legal@lamid.io" className="text-[#c12129] hover:underline">legal@lamid.io</a> · Lagos, Nigeria · London, UK</p>
        </Section>
      </div>
    </main>
  );
}
