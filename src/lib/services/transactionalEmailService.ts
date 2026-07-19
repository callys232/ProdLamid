import { notificationTransporter } from "@/lib/mailer";
import { Users } from "@/lib/models/User";

const BASE = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
const FROM  = `"Lamid" <${process.env.NOTIFICATION_EMAIL_USER}>`;

async function getEmail(userId: string): Promise<string | null> {
  const user = await Users.findById(userId).select("email username notificationPrefs").lean() as any;
  if (!user?.email) return null;
  if (user?.notificationPrefs?.emailNotifications === false) return null;
  return user.email;
}

function card(content: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#0a0a0a;color:#fff;border-radius:12px;padding:32px;">
    <div style="margin-bottom:24px;"><span style="color:#2563EB;font-size:20px;font-weight:bold;">Lamid</span></div>
    ${content}
    <p style="color:#555;font-size:11px;margin-top:32px;">Manage notifications at <a href="${BASE}/client?tab=settings" style="color:#666;">${BASE}</a></p>
  </div>`;
}

function btn(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:#2563EB;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin-top:20px;">${label}</a>`;
}

// ── Bid accepted ─────────────────────────────────────────────────────────────
export async function emailBidAccepted(params: { consultantId: string; projectTitle: string; projectId: string }) {
  const email = await getEmail(params.consultantId);
  if (!email) return;
  await notificationTransporter.sendMail({
    from: FROM, to: email,
    subject: `Your bid was accepted — ${params.projectTitle}`,
    html: card(`
      <h2 style="font-size:18px;font-weight:600;">Your bid was accepted! 🎉</h2>
      <p style="color:#aaa;font-size:14px;">Congratulations! The client has accepted your bid for <strong style="color:#fff;">${params.projectTitle}</strong>.</p>
      <p style="color:#aaa;font-size:14px;">Head to your workspace to get started.</p>
      ${btn("Open Project Workspace", `${BASE}/projects/${params.projectId}/workspace`)}
    `),
  }).catch(console.error);
}

// ── Consultant hired ─────────────────────────────────────────────────────────
export async function emailConsultantHired(params: { consultantId: string; clientId: string; projectTitle: string; projectId: string; clientMessage?: string }) {
  const [consultantEmail, clientEmail] = await Promise.all([
    getEmail(params.consultantId),
    getEmail(params.clientId),
  ]);

  if (consultantEmail) {
    await notificationTransporter.sendMail({
      from: FROM, to: consultantEmail,
      subject: `You have been hired — ${params.projectTitle}`,
      html: card(`
        <h2 style="font-size:18px;font-weight:600;">You have been hired! 🚀</h2>
        <p style="color:#aaa;font-size:14px;">You have been formally hired for <strong style="color:#fff;">${params.projectTitle}</strong>.</p>
        ${params.clientMessage ? `<blockquote style="border-left:3px solid #2563EB;padding-left:12px;color:#aaa;font-style:italic;">"${params.clientMessage}"</blockquote>` : ""}
        ${btn("Open Project Workspace", `${BASE}/projects/${params.projectId}/workspace`)}
      `),
    }).catch(console.error);
  }

  if (clientEmail) {
    await notificationTransporter.sendMail({
      from: FROM, to: clientEmail,
      subject: `Consultant hired — ${params.projectTitle}`,
      html: card(`
        <h2 style="font-size:18px;font-weight:600;">Hiring confirmed ✅</h2>
        <p style="color:#aaa;font-size:14px;">You have successfully hired a consultant for <strong style="color:#fff;">${params.projectTitle}</strong>. They have been notified and will begin shortly.</p>
        ${btn("Manage Project", `${BASE}/client?tab=projects`)}
      `),
    }).catch(console.error);
  }
}

// ── Milestone approved ───────────────────────────────────────────────────────
export async function emailMilestoneApproved(params: { consultantId: string; milestoneTitle: string; projectTitle: string; amount: number; projectId: string }) {
  const email = await getEmail(params.consultantId);
  if (!email) return;
  await notificationTransporter.sendMail({
    from: FROM, to: email,
    subject: `Milestone approved — ${params.milestoneTitle}`,
    html: card(`
      <h2 style="font-size:18px;font-weight:600;">Milestone approved ✅</h2>
      <p style="color:#aaa;font-size:14px;">The client approved <strong style="color:#fff;">${params.milestoneTitle}</strong> on <em>${params.projectTitle}</em>.</p>
      <p style="color:#aaa;font-size:14px;">Amount: <strong style="color:#2563EB;">$${params.amount.toLocaleString()}</strong></p>
      ${btn("View Project", `${BASE}/projects/${params.projectId}/workspace`)}
    `),
  }).catch(console.error);
}

// ── Payment released ─────────────────────────────────────────────────────────
export async function emailPaymentReleased(params: { consultantId: string; amount: number; projectTitle: string; reference?: string }) {
  const email = await getEmail(params.consultantId);
  if (!email) return;
  await notificationTransporter.sendMail({
    from: FROM, to: email,
    subject: `Payment released — $${params.amount.toLocaleString()}`,
    html: card(`
      <h2 style="font-size:18px;font-weight:600;">Payment released 💸</h2>
      <p style="color:#aaa;font-size:14px;">A payment of <strong style="color:#2563EB;">$${params.amount.toLocaleString()}</strong> for <em>${params.projectTitle}</em> has been released to your account.</p>
      ${params.reference ? `<p style="color:#555;font-size:12px;">Reference: ${params.reference}</p>` : ""}
      ${btn("View Wallet", `${BASE}/profile?tab=escrow`)}
    `),
  }).catch(console.error);
}

// ── Dispute opened ───────────────────────────────────────────────────────────
export async function emailDisputeOpened(params: { clientId: string; consultantId: string; projectTitle: string; reason: string }) {
  const [clientEmail, consultantEmail] = await Promise.all([
    getEmail(params.clientId),
    getEmail(params.consultantId),
  ]);
  const body = (role: string) => card(`
    <h2 style="font-size:18px;font-weight:600;">Dispute opened ⚠️</h2>
    <p style="color:#aaa;font-size:14px;">A dispute has been raised on <strong style="color:#fff;">${params.projectTitle}</strong> by the ${role}.</p>
    <p style="color:#aaa;font-size:14px;"><strong style="color:#fff;">Reason:</strong> ${params.reason}</p>
    <p style="color:#aaa;font-size:14px;">Our team will review within 2 business days and mediate a resolution.</p>
    ${btn("View Dispute", `${BASE}/escrow`)}
  `);
  if (clientEmail)     await notificationTransporter.sendMail({ from: FROM, to: clientEmail,     subject: `Dispute opened — ${params.projectTitle}`, html: body("consultant") }).catch(console.error);
  if (consultantEmail) await notificationTransporter.sendMail({ from: FROM, to: consultantEmail, subject: `Dispute opened — ${params.projectTitle}`, html: body("client") }).catch(console.error);
}
