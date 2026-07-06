const { chromium } = require("playwright");
const path = require("path");

const BASE = "http://localhost:3000";

const routes = [
  { path: "/", name: "01-landing" },
  { path: "/onboarding", name: "02-onboarding" },
  { path: "/atlas", name: "03-atlas" },
  { path: "/place/buxar", name: "04-place" },
  { path: "/wound/1", name: "05-wound-journey" },
  { path: "/report", name: "06-report" },
  { path: "/pressure/1", name: "07-pressure-thread" },
  { path: "/pulse", name: "08-pulse" },
  { path: "/stream", name: "09-stream" },
  { path: "/flow", name: "10-flow" },
  { path: "/search", name: "11-search" },
  { path: "/notifications", name: "12-notifications" },
  { path: "/profile", name: "13-citizen-profile" },
  { path: "/ngo", name: "14-ngo-workspace" },
  { path: "/corporate", name: "15-corporate-console" },
  { path: "/verifier", name: "16-verifier" },
  { path: "/government", name: "17-government" },
  { path: "/settings", name: "18-settings" },
  { path: "/states", name: "19-system-states" },
  { path: "/dock", name: "20-dock" },
];

const desktopDir = path.join(__dirname, "screenshots", "desktop");
const mobileDir = path.join(__dirname, "screenshots", "mobile");

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const route of routes) {
    console.log(`Capturing: ${route.name}`);

    // Desktop
    const desktopCtx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const desktopPage = await desktopCtx.newPage();
    await desktopPage.goto(BASE + route.path, {
      waitUntil: "networkidle",
      timeout: 15000,
    });
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({
      path: path.join(desktopDir, `${route.name}.png`),
      fullPage: true,
    });
    await desktopCtx.close();

    // Mobile
    const mobileCtx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileCtx.newPage();
    await mobilePage.goto(BASE + route.path, {
      waitUntil: "networkidle",
      timeout: 15000,
    });
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({
      path: path.join(mobileDir, `${route.name}.png`),
      fullPage: true,
    });
    await mobileCtx.close();

    console.log(`  Done: ${route.name}`);
  }

  await browser.close();
  console.log("\nAll screenshots captured!");
})();
