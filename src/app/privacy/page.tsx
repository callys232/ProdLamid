export const metadata = { title: "Privacy Policy — Lamid" };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="mb-3 text-lg font-bold text-white">{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed text-gray-400">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-24 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <span className="mb-3 inline-block rounded-full border border-[#2563EB]/40 bg-[#2563EB]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">Legal</span>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: May 2026</p>
        </div>

        <Section title="1. Information We Collect">
          <p><strong className="text-white">Account data:</strong> Name, email address, password (hashed), phone number, and role.</p>
          <p><strong className="text-white">Profile data:</strong> Professional bio, skills, work history, industry, rates, and profile photo.</p>
          <p><strong className="text-white">Payment data:</strong> Transaction references processed via Paystack. We do not store card numbers.</p>
          <p><strong className="text-white">Usage data:</strong> Pages visited, features used, and device/browser information.</p>
          <p><strong className="text-white">KYC data:</strong> Government-issued ID documents uploaded for identity verification, stored securely on Cloudinary.</p>
        </Section>

        <Section title="2. How We Use Your Data">
          <p>We use your data to: provide and improve the Platform; match projects with consultants; process payments; send transactional and service emails; comply with legal obligations; and prevent fraud.</p>
          <p>We do not sell your personal data to third parties.</p>
        </Section>

        <Section title="3. Data Sharing">
          <p>We share data with: Paystack (payment processing); Cloudinary (file storage); email service providers for transactional messages; and as required by law.</p>
          <p>When you hire a consultant or bid on a project, relevant profile information is shared with the other party.</p>
        </Section>

        <Section title="4. Data Retention">
          <p>We retain account data for the duration of your account and up to 2 years after deletion, unless a longer period is required by law. You may request earlier deletion via your account settings or at <a href="mailto:privacy@lamid.io" className="text-[#2563EB] hover:underline">privacy@lamid.io</a>.</p>
        </Section>

        <Section title="5. Your Rights (GDPR)">
          <p>If you are in the EU or UK, you have the right to: access your data; correct inaccurate data; request deletion; restrict processing; data portability; and object to processing.</p>
          <p>To exercise these rights, use the <a href="/client?tab=settings" className="text-[#2563EB] hover:underline">data export</a> feature in your settings or contact <a href="mailto:privacy@lamid.io" className="text-[#2563EB] hover:underline">privacy@lamid.io</a>.</p>
        </Section>

        <Section title="6. Cookies">
          <p>We use strictly necessary cookies for authentication (httpOnly, secure). We use functional cookies to remember your preferences. We do not use advertising or third-party tracking cookies.</p>
        </Section>

        <Section title="7. Security">
          <p>We use industry-standard encryption (TLS/HTTPS), bcrypt for password hashing, and httpOnly cookies for auth tokens. We conduct regular security reviews.</p>
        </Section>

        <Section title="8. Contact">
          <p>Data controller: Lamid Ltd · Lagos, Nigeria · London, UK<br/>
          Privacy enquiries: <a href="mailto:privacy@lamid.io" className="text-[#2563EB] hover:underline">privacy@lamid.io</a></p>
        </Section>
      </div>
    </main>
  );
}
