import { defineConfig, devices } from "@playwright/test";

// QA tests 4, 6, 7, 8 of the plan. Locally: npx playwright test --project=chromium
export default defineConfig({
  testDir: "tests",
  timeout: 30_000,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL: "http://localhost:4173/studio-cgd-site/" },
  webServer: {
    command: "npm run preview -- --port 4173 --strictPort",
    url: "http://localhost:4173/studio-cgd-site/",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
