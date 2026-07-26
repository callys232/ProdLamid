export const metadata = { title: "Terms of Service — LAMID ONE" };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="mb-3 text-lg font-bold text-black dark:text-white">{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed text-gray-700 dark:text-white/70">{children}</div>
  </section>
);

/** Placeholder token — makes unfilled jurisdiction values obvious on the page. */
const TBD = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-amber-900 dark:bg-amber-500/15 dark:text-amber-300">
    {children}
  </span>
);

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-24 text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8">
          <span className="mb-3 inline-block rounded-full border border-[#2563EB]/40 bg-[#2563EB]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">
            Legal
          </span>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-white/50">Last updated: July 2026</p>
        </div>

        {/* Draft notice — remove once counsel has signed off */}
        <div className="mb-10 rounded-xl border border-amber-400/50 bg-amber-50 p-4 dark:bg-amber-950/20">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400">
            Draft — pending legal review
          </p>
          <p className="text-sm leading-relaxed text-amber-900/90 dark:text-amber-200/80">
            This is working template content for a multi-jurisdiction rollout. Highlighted values
            must be confirmed by qualified counsel in each operating market before publication.
            Do not rely on this document as legal advice.
          </p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using LAMID ONE (&quot;the Ecosystem&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Ecosystem.</p>
          <p>Where you use the Ecosystem on behalf of an organisation, you confirm you have authority to bind that organisation to these Terms.</p>
        </Section>

        <Section title="2. About LAMID ONE">
          <p>LAMID ONE is a HumanAI Consulting Ecosystem that connects organisations seeking expertise with independent consultants and talent, supported by AI-powered matching, project delivery, business intelligence, and capability development — all in one unified environment.</p>
          <p>The Ecosystem is operated by <TBD>[ENTITY NAME]</TBD>, registered in <TBD>[JURISDICTION OF INCORPORATION]</TBD>, together with its affiliates in the markets where we operate.</p>
        </Section>

        <Section title="3. Eligibility and User Accounts">
          <p>You must be at least 18 years old, or the age of majority in your jurisdiction if higher, to create an account.</p>
          <p>You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Notify us promptly of any unauthorised use.</p>
          <p>You agree to provide accurate and complete information. LAMID ONE may suspend or terminate accounts that violate these Terms.</p>
        </Section>

        <Section title="4. Consultant and Client Obligations">
          <p><strong className="text-black dark:text-white">Consultants</strong> agree to deliver work as described in agreed project scopes, to not misrepresent their qualifications, and to hold any licences or registrations their work requires in the relevant market.</p>
          <p><strong className="text-black dark:text-white">Clients</strong> agree to fund escrow milestones promptly and to release payment upon satisfactory delivery.</p>
          <p>Consultants engage as independent contractors, not employees of LAMID ONE or of the Client, unless a separate written agreement states otherwise. Each party is responsible for its own tax and social-contribution obligations in its own jurisdiction.</p>
        </Section>

        <Section title="5. Payments, Currency and Escrow">
          <p>Payments are processed through our regional payment partners, which vary by market. LAMID ONE holds milestone payments in escrow and releases them upon Client approval.</p>
          <p>A success fee of up to <TBD>[FEE %]</TBD> applies to each transaction. Applicable fees are shown before you confirm any payment.</p>
          <p>Transactions may be presented in multiple currencies. Where conversion occurs, the rate and any conversion charge are disclosed at the point of payment. You are responsible for any charges applied by your own bank or card issuer.</p>
          <p>Taxes — including VAT, GST, sales tax, or withholding tax — are determined by the jurisdictions of the parties. Each party is responsible for its own tax obligations. LAMID ONE may collect and remit tax where law requires it to do so.</p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>Upon full payment for a project, intellectual property rights for deliverables transfer to the Client unless otherwise agreed in writing between the parties.</p>
          <p>LAMID ONE retains all rights in the Ecosystem itself, including its software, models, interfaces, and brand assets. Nothing in these Terms transfers those rights.</p>
        </Section>

        <Section title="7. AI-Generated Output">
          <p>The Ecosystem produces analyses, recommendations, budgets, and other output using AI systems. This output is decision support, not professional advice, and may contain errors.</p>
          <p>You are responsible for reviewing AI-generated output before relying on it — particularly for financial, legal, tax, medical, or safety-related decisions. LAMID ONE does not warrant its accuracy or fitness for a particular purpose.</p>
        </Section>

        <Section title="8. Prohibited Conduct">
          <p>You may not: engage consultants outside the Ecosystem to avoid the success fee; post false, misleading, or fraudulent information; harass, threaten, or abuse other users; attempt to gain unauthorised access to the Ecosystem or other users&apos; data; or use the Ecosystem in any way that violates applicable law.</p>
        </Section>

        <Section title="9. Sanctions and Export Compliance">
          <p>You may not use the Ecosystem if you are located in, ordinarily resident in, or acting on behalf of a person in a jurisdiction subject to comprehensive sanctions, or if you appear on any applicable restricted-party list.</p>
          <p>You agree to comply with all applicable export control and sanctions laws in your own jurisdiction and in <TBD>[JURISDICTION OF INCORPORATION]</TBD>.</p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>LAMID ONE is not liable for any indirect, incidental, or consequential damages arising from use of the Ecosystem. Total liability shall not exceed the fees paid by you in the 12 months preceding the claim.</p>
          <p>Nothing in these Terms limits liability that cannot be limited under the law applicable to you — including, where relevant, mandatory consumer protections in your jurisdiction.</p>
        </Section>

        <Section title="11. Termination">
          <p>LAMID ONE may suspend or terminate your account for violation of these Terms. You may close your account at any time via your account settings.</p>
          <p>Funds already held in escrow at termination are released or refunded according to the dispute process in Section 12.</p>
        </Section>

        <Section title="12. Disputes and Governing Law">
          <p>Disputes between Clients and Consultants are first addressed through LAMID ONE&apos;s internal resolution process.</p>
          <p>These Terms are governed by the laws of <TBD>[GOVERNING LAW]</TBD>, without regard to conflict-of-law rules.</p>
          <p>Disputes with LAMID ONE that cannot be resolved informally shall be settled by binding arbitration seated in <TBD>[ARBITRAL SEAT]</TBD> under the <TBD>[ARBITRATION RULES]</TBD>, conducted in English.</p>
          <p>Consumers may have a non-waivable right to bring proceedings in their country of residence. Nothing here removes that right where it applies.</p>
        </Section>

        <Section title="13. Changes to Terms">
          <p>LAMID ONE may modify these Terms. Material changes will be notified at least <TBD>[NOTICE PERIOD]</TBD> in advance by email or in-product notice. Continued use after changes take effect constitutes acceptance.</p>
        </Section>

        <Section title="14. Contact">
          <p>
            Legal enquiries: <a href="mailto:legal@lamid.io" className="text-[#2563EB] hover:underline">legal@lamid.io</a>
            <br />
            Registered office: <TBD>[REGISTERED ADDRESS]</TBD>
          </p>
        </Section>
      </div>
    </main>
  );
}
