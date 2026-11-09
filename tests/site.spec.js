import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { eventStatus } from "../src/lib/eventStatus.js";

const SECTIONS = ["accueil", "competences", "formations", "temoignages", "carrieres", "ressources", "contact"];

test("the seven sections render and the nav reaches each one", async ({ page }) => {
  await page.goto("./");
  for (const id of SECTIONS) await expect(page.locator(`section#${id}`)).toBeVisible();
  // On a phone the links sit behind the Menu button: open it first, and it must close after the jump.
  const menu = page.getByRole("button", { name: /menu/i });
  const phone = await menu.isVisible();
  if (phone) {
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
  }
  await page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Carrières" }).click();
  await expect(page).toHaveURL(/#carrieres$/);
  await expect(page.locator("section#carrieres h2")).toBeInViewport();
  if (phone) await expect(menu).toHaveAttribute("aria-expanded", "false");
});

for (const width of [360, 768, 1280]) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

for (const scheme of ["light", "dark"]) {
  test(`no serious or critical accessibility violation (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await page.goto("./");
    const { violations } = await new AxeBuilder({ page }).analyze();
    const bad = violations.filter((v) => ["serious", "critical"].includes(v.impact));
    expect(bad.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
  });
}

test("theme toggle sets and remembers the theme", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Sombre" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Auto" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
});

test("family filter keeps only the matching cards", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Technique" }).click();
  await expect(page.locator("article.skill")).toHaveCount(3);
  await expect(page.locator("article.skill .code").first()).toContainText("Technique");
});

test("event line stays hidden while the seat is not booked", async ({ page }) => {
  // events.json ships booked: false until the user confirms the reservation.
  await page.clock.setFixedTime(new Date("2026-11-10T12:00:00+01:00"));
  await page.goto("./");
  await expect(page.locator("#skill-X2")).toBeVisible();
  await expect(page.locator("#skill-X2 .event")).toHaveCount(0);
});

test("event rule: booked before the date, attended after it, nothing else", () => {
  const ev = { start: "2026-11-19T18:00:00+01:00", booked: false, attended: null };
  const before = new Date("2026-11-10T12:00:00+01:00");
  const after = new Date("2026-11-20T12:00:00+01:00");
  expect(eventStatus(ev, before)).toBe("non réservé");
  expect(eventStatus({ ...ev, booked: true }, before)).toBe("prévu");
  expect(eventStatus({ ...ev, booked: true }, after)).toBe("à confirmer");
  expect(eventStatus({ ...ev, booked: true, attended: true }, after)).toBe("a participé");
  expect(eventStatus({ ...ev, attended: false }, after)).toBe("à confirmer");
});

test("skip link lands on the main content", async ({ page }) => {
  await page.goto("./");
  const skip = page.getByRole("link", { name: "Aller au contenu" });
  // Wait for React to render the page: a Tab sent before that lands on <body>.
  await expect(skip).toBeAttached();
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contenu$/);
});

test("contact section never shows a dead form", async ({ page }) => {
  await page.goto("./");
  const contact = page.locator("section#contact");
  const form = contact.locator("form");
  if (await form.count()) {
    await expect(form.getByRole("button", { name: "Envoyer" })).toBeEnabled();
    await expect(form.locator("#cf-consent")).toHaveAttribute("required", "");
  } else {
    await expect(contact).toContainText("arrive bientôt");
  }
});

test("contact form posts the six Google Form fields (request intercepted, nothing sent)", async ({ page }) => {
  const config = (await import("../src/data/contact.json", { with: { type: "json" } })).default;
  test.skip(!config.formId, "form not linked yet");
  let posted = null;
  await page.route("https://docs.google.com/forms/**", async (route) => {
    posted = { url: route.request().url(), body: new URLSearchParams(route.request().postData() || "") };
    await route.fulfill({ status: 200, body: "" });
  });
  await page.goto("./#contact");
  await page.fill("#cf-name", "Test QA");
  await page.fill("#cf-email", "qa@example.org");
  await page.selectOption("#cf-skill", { index: 1 });
  await page.fill("#cf-message", "Message de test automatique.");
  await page.check("#cf-consent");
  await page.getByRole("button", { name: "Envoyer" }).click();
  await expect(page.locator("#contact")).toContainText("Message envoyé");
  expect(posted.url).toContain(`/forms/d/e/${config.formId}/formResponse`);
  for (const entry of Object.values(config.entries)) expect(posted.body.get(entry), entry).toBeTruthy();
  expect(posted.body.get(config.entries.organization)).toBe("Non renseignée");
});

test("campaign source from a social link travels with the form (request intercepted)", async ({ page }) => {
  const config = (await import("../src/data/contact.json", { with: { type: "json" } })).default;
  test.skip(!config.formId, "form not linked yet");
  let consent = null;
  await page.route("https://docs.google.com/forms/**", async (route) => {
    consent = new URLSearchParams(route.request().postData() || "").get(config.entries.consent);
    await route.fulfill({ status: 200, body: "" });
  });
  await page.goto("./?utm_source=LinkedIn&utm_medium=social&utm_campaign=lancement-site<script>#contact");
  await page.fill("#cf-name", "Test QA");
  await page.fill("#cf-email", "qa@example.org");
  await page.fill("#cf-org", "QA");
  await page.selectOption("#cf-skill", { index: 2 });
  await page.fill("#cf-message", "Test UTM.");
  await page.check("#cf-consent");
  await page.getByRole("button", { name: "Envoyer" }).click();
  await expect(page.locator("#contact")).toContainText("Message envoyé");
  expect(consent).toMatch(/^Oui, \d{4}-\d\d-\d\dT.*, utm=linkedin\/social\/lancement-sitescript$/);
});

test("share preview: Open Graph image is declared and served", async ({ page, request }) => {
  await page.goto("./");
  const img = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(img).toBe("https://aguennoune.github.io/studio-cgd-site/og-image.png");
  const res = await request.get("og-image.png");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});
