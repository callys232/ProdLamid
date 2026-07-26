export const metadata = { title: "Privacy Policy — LAMID ONE" };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="mb-3 text-lg font-bold text-black dark:text-white">{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed text-gray-700 dark:text-white/70">{children}</div>
  </section>
);

const TBD = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-amber-900 dark:bg-amber-500/15 dark:text-amber-300">
    {children}
  </span>
);

/** Regional privacy frameworks the Ecosystem may fall under. */
const FRAMEWORKS = [
  { law: "GDPR",   region: "European Union",       rights: "Access, rectification, erasure, restriction, portability, objection" },
  { law: "UK GDPR",region: "United Kingdom",       rights: "As GDPR, supervised by the ICO" },
  { law: "CCPA / CPRA", region: "California, USA", rights: "Know, delete, correct, opt out of sale/sharing, limit sensitive data use" },
  { law: "PIPEDA", region: "Canada",               rights: "Access, correction, withdrawal of consent" },
  { law: "LGPD",   region: "Brazil",               rights: "Confirmation, access, correction, anonymisation, portability, deletion" },
  { law: "POPIA",  region: "South Africa",         rights: "Access, correction, deletion, objection" },
  { law: "NDPA",   region: "Nigeria",              rights: "Access, rectification, erasure, restriction, portability" },
  { law: "PDPA",   region: "Singapore",            rights: "Access, correction, withdrawal of consent" },
  { law: "APPI",   region: "Japan",                rights: "Disclosure, correction, suspension of use" },
  { law: "Privacy Act", region: "Australia",       rights: "Access, correction, complaint to the OAIC" },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-24 text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8">
          <span className="mb-3 inline-block rounded-full border border-[#2563EB]/40 bg-[#2563EB]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">
            Legal
          </span>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-white/50">Last updated: July 2026</p>
        </div>

        <div className="mb-10 rounded-xl border border-amber-400/50 bg-amber-50 p-4 dark:bg-amber-950/20">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400">
            Draft — pending legal review
          </p>
          <p className="text-sm leading-relaxed text-amber-900/90 dark:text-amber-200/80">
            This is working template content for a multi-jurisdiction rollout. Highlighted values
            must be confirmed by qualified counsel, and each framework below verified against actual
            processing activity, before publication.
          </p>
        </div>

        <Section title="1. Who We Are">
          <p>The data controller for the LAMID ONE Ecosystem is <TBD>[ENTITY NAME]</TBD>, registered in <TBD>[JURISDICTION]</TBD> at <TBD>[REGISTERED ADDRESS]</TBD>.</p>
          <p>Where required, our representative for data-protection purposes is <TBD>[EU/UK REPRESENTATIVE]</TBD>, and our Data Protection Officer can be reached at <a href="mailto:privacy@lamid.io" className="text-[#2563EB] hover:underline">privacy@lamid.io</a>.</p>
        </Section>

        <Section title="2. Information We Collect">
          <p><strong className="text-black dark:text-white">Account data:</strong> Name, email address, password (hashed), phone number, and role.</p>
          <p><strong className="text-black dark:text-white">Profile data:</strong> Professional bio, skills, work history, industry, rates, and profile photo.</p>
          <p><strong className="text-black dark:text-white">Payment data:</strong> Transaction references processed by our regional payment partners. We do not store full card numbers.</p>
          <p><strong className="text-black dark:text-white">Usage data:</strong> Pages visited, features used, tools run, and device/browser information.</p>
          <p><strong className="text-black dark:text-white">Content you submit:</strong> Project scopes, briefs, and business context entered into intelligence tools.</p>
          <p><strong className="text-black dark:text-white">Identity verification:</strong> Government-issued ID documents uploaded for verification, stored with access controls.</p>
        </Section>

        <Section title="3. Legal Bases for Processing">
          <p>Where GDPR, UK GDPR, or an equivalent framework applies, we process personal data on these bases:</p>
          <p><strong className="text-black dark:text-white">Contract</strong> — to provide the Ecosystem, match projects, and process payments.</p>
          <p><strong className="text-black dark:text-white">Legitimate interests</strong> — to secure the platform, prevent fraud, and improve our services, balanced against your rights.</p>
          <p><strong className="text-black dark:text-white">Legal obligation</strong> — to meet accounting, tax, anti-money-laundering, and identity-verification duties.</p>
          <p><strong className="text-black dark:text-white">Consent</strong> — for optional communications, which you may withdraw at any time.</p>
        </Section>

        <Section title="4. How We Use Your Data">
          <p>To provide and improve the Ecosystem; match projects with consultants; process payments and escrow; generate AI-assisted analyses you request; send transactional and service messages; comply with legal obligations; and detect and prevent fraud or abuse.</p>
          <p><strong className="text-black dark:text-white">We do not sell your personal data.</strong> We do not use your business content to train third-party foundation models.</p>
        </Section>

        <Section title="5. AI Processing">
          <p>Content you enter into intelligence tools is transmitted to our AI processing partners solely to generate the output you requested. It is not used to train their public models.</p>
          <p>We retain a record of which tools you have run so your history is available in your dashboard. You can request deletion of that history at any time.</p>
        </Section>

        <Section title="6. Data Sharing">
          <p>We share data with: regional payment processors; cloud storage and hosting providers; AI processing partners; email service providers; and authorities where law requires it.</p>
          <p>When you hire a consultant or bid on a project, relevant profile information is shared with the other party.</p>
          <p>A current list of sub-processors is available at <TBD>[SUB-PROCESSOR LIST URL]</TBD>.</p>
        </Section>

        <Section title="7. International Data Transfers">
          <p>The Ecosystem operates globally, so your data may be processed in countries other than your own — including where our hosting, payment, and AI partners operate.</p>
          <p>Where data leaves a jurisdiction that restricts transfers, we rely on an appropriate safeguard: an adequacy decision, Standard Contractual Clauses, the UK International Data Transfer Addendum, or an equivalent mechanism recognised locally.</p>
          <p>You may request a copy of the safeguards applying to your data at <a href="mailto:privacy@lamid.io" className="text-[#2563EB] hover:underline">privacy@lamid.io</a>.</p>
        </Section>

        <Section title="8. Your Rights by Region">
          <p>Your rights depend on where you are. The frameworks below may apply to you:</p>
          <div className="my-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-gray-300 dark:border-white/20">
                  <th className="py-2 pr-4 font-bold uppercase tracking-wider text-gray-700 dark:text-white/60">Framework</th>
                  <th className="py-2 pr-4 font-bold uppercase tracking-wider text-gray-700 dark:text-white/60">Region</th>
                  <th className="py-2 font-bold uppercase tracking-wider text-gray-700 dark:text-white/60">Core rights</th>
                </tr>
              </thead>
              <tbody>
                {FRAMEWORKS.map((f) => (
                  <tr key={f.law} className="border-b border-gray-200 last:border-0 dark:border-white/10">
                    <td className="py-2 pr-4 font-semibold text-black dark:text-white">{f.law}</td>
                    <td className="py-2 pr-4 text-gray-700 dark:text-white/60">{f.region}</td>
                    <td className="py-2 text-gray-700 dark:text-white/60">{f.rights}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>To exercise any right, use the data export and deletion controls in your account settings, or contact <a href="mailto:privacy@lamid.io" className="text-[#2563EB] hover:underline">privacy@lamid.io</a>. We respond within the period your local law requires, and within 30 days by default.</p>
          <p>We will not discriminate against you for exercising these rights.</p>
        </Section>

        <Section title="9. Data Retention">
          <p>We retain account data for the life of your account and up to <TBD>[RETENTION PERIOD]</TBD> after closure, unless a longer period is required for tax, accounting, or anti-money-laundering purposes.</p>
          <p>Identity-verification documents are deleted once verification is complete and any mandatory retention period has expired.</p>
        </Section>

        <Section title="10. Cookies">
          <p>We use strictly necessary cookies for authentication (httpOnly, secure) and functional cookies to remember preferences. We do not use advertising or third-party tracking cookies.</p>
          <p>Where local law requires consent for non-essential cookies, we request it before those cookies are set.</p>
        </Section>

        <Section title="11. Security">
          <p>We use TLS/HTTPS in transit, bcrypt password hashing, httpOnly authentication cookies, role-based access controls, and rate limiting. We conduct regular security reviews.</p>
          <p>No system is perfectly secure. Where a breach is likely to result in a risk to your rights, we notify you and the relevant supervisory authority within the timeframe your law requires.</p>
        </Section>

        <Section title="12. Children">
          <p>The Ecosystem is not directed at children and we do not knowingly collect data from anyone under 18. If you believe a child has provided us data, contact us and we will delete it.</p>
        </Section>

        <Section title="13. Complaints">
          <p>You may lodge a complaint with your local supervisory authority. In the EU this is your national data protection authority; in the UK, the Information Commissioner&apos;s Office; in other markets, the equivalent regulator.</p>
          <p>We would appreciate the chance to address your concern first — reach us at <a href="mailto:privacy@lamid.io" className="text-[#2563EB] hover:underline">privacy@lamid.io</a>.</p>
        </Section>

        <Section title="14. Contact">
          <p>
            Privacy enquiries: <a href="mailto:privacy@lamid.io" className="text-[#2563EB] hover:underline">privacy@lamid.io</a>
            <br />
            Data controller: <TBD>[ENTITY NAME]</TBD> · <TBD>[REGISTERED ADDRESS]</TBD>
          </p>
        </Section>
      </div>
    </main>
  );
}
