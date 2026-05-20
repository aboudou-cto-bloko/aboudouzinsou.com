import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/projets");

const SITES = [
  { slug: "pixel-mart",   url: "https://pixel-mart-bj.com" },
  { slug: "vitrinai",     url: "https://vitrinai-eta.vercel.app" },
  { slug: "zeat",         url: "https://zeat-bj.vercel.app" },
  { slug: "campus-plus",  url: "https://camplus-bj.vercel.app" },
];

async function capture(browser, slug, url) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  try {
    console.log(`→ ${slug}: ${url}`);
    await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(OUT_DIR, `${slug}.png`),
      clip: { x: 0, y: 0, width: 1280, height: 720 },
    });
    console.log(`  ✓ ${slug}.png`);
  } catch (e) {
    console.error(`  ✗ ${slug}: ${e.message}`);
  } finally {
    await page.close();
  }
}

const browser = await chromium.launch({ headless: true });
for (const { slug, url } of SITES) {
  await capture(browser, slug, url);
}
await browser.close();
console.log("Done.");
