import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const SECTIONS = ["accueil", "competences", "formations", "temoignages", "carrieres", "ressources", "contact"];

test("the seven sections render and the nav reaches each one", async ({ page }) => {
  await page.goto("./");
  for (const id of SECTIONS) await expect(page.locator(`section#${id}`)).toBeVisible();
  await page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Carrières" }).click();
  await expect(page).toHaveURL(/#carrieres$/);
  await expect(page.locator("section#carrieres h2")).toBeInViewport();
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

test("event line says 'prévue' before the show and disappears after it while unconfirmed", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-11-10T12:00:00+01:00"));
  await page.goto("./");
  await expect(page.locator("#skill-X2 .event")).toContainText("participation prévue");
  await page.clock.setFixedTime(new Date("2026-11-20T12:00:00+01:00"));
  await page.reload();
  await expect(page.locator("#skill-X2 .event")).toHaveCount(0);
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
