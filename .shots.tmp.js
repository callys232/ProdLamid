const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:3000";
const OUT  = path.join(process.cwd(), "public", "screenshots");

const SUPPRESS = [
  "lamid_onboarding_done", "lamid_cookie_consent", "hasShownBizSphereModal",
  "lamid-enterprise-guide-v1", "lamid-concierge-guide-v1",
  "lamid-client-profile-header-guide", "lamid-consultant-profile-header-guide",
  "lamid-freelancer-sidebar-guide-v1",
];

/* Strip chrome that is not part of the product surface. */
const HIDE_CHROME = `
  nav, header, [role="banner"] { display: none !important; }
  main, body > div > div { padding-top: 0 !important; }
  .fixed.bottom-4, [class*="QuickTools"], [class*="quick-tools"] { display: none !important; }
  body > *:last-child:has(button[aria-label*="chat" i]) { display: none !important; }
`;

const TARGETS = [
  { file: "core-dashboard.png",    url: "/q46-predictive-foresight",     label: "CORE — Predictive Foresight" },
  { file: "grow-dashboard.png",    url: "/r14-real-time-cadence-pulse",          label: "GROW — Cadence Pulse" },
  { file: "talent-dashboard.png",  url: "/a26-workforce-forecasting", label: "TALENT — Workforce roster" },
  { file: "finance-dashboard.png", url: "/f02-budgeting-forecasting", label: "FINANCE — Budget Engine", fill: "budget" },
];

async function fillBudget(page) {
  await page.type("#bp-name", "Regional Data Centre Build", { delay: 6 });
  await page.type("#bp-scope",
    "Two-floor colocation facility, 400 racks, redundant power and cooling, commissioning and 12-month warranty support.",
    { delay: 1 });
  await page.type("#bp-region", "Western Europe", { delay: 6 });
  await page.type("#bp-team", "8 engineers, 2 PMs", { delay: 6 });

  const buttons = await page.$$("button");
  for (const b of buttons) {
    const t = await page.evaluate((el) => el.textContent?.trim(), b);
    if (t === "Add Line") { for (let i = 0; i < 4; i++) await b.click(); break; }
  }
  await new Promise((r) => setTimeout(r, 500));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  const login = await page.evaluate(async (base) => {
    const r = await fetch(base + "/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ email: "demo.enterprise@lamidone.com", password: "Demo@Enterprise1" }),
    });
    return { status: r.status, ok: r.ok };
  }, BASE);
  console.log("  login →", login.status, login.ok ? "OK" : "FAILED");
  if (!login.ok) { await browser.close(); process.exit(1); }

  await page.evaluate((keys) => {
    for (const k of keys) localStorage.setItem(k, k === "lamid_cookie_consent" ? "accepted" : "true");
  }, SUPPRESS);

  for (const t of TARGETS) {
    try {
      await page.goto(BASE + t.url, { waitUntil: "networkidle2", timeout: 90000 });
      await page.addStyleTag({ content: HIDE_CHROME });
      await new Promise((r) => setTimeout(r, 1500));

      if (t.fill === "budget") await fillBudget(page);
      await new Promise((r) => setTimeout(r, 1000));

      // Re-apply after any client re-render, then scroll past residual top gap.
      await page.addStyleTag({ content: HIDE_CHROME });
      await page.evaluate(() => window.scrollTo(0, 90));
      await new Promise((r) => setTimeout(r, 500));

      const dest = path.join(OUT, t.file);
      await page.screenshot({ path: dest, type: "png" });
      console.log(`  ✓ ${t.file.padEnd(24)} ${String(Math.round(fs.statSync(dest).size / 1024)).padStart(4)}kb  ${t.label}`);
    } catch (e) {
      console.log(`  ✗ ${t.file} — ${e.message.split("\n")[0]}`);
    }
  }
  await browser.close();
})();
