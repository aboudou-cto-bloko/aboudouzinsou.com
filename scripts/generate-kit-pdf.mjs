/**
 * Génère le PDF du Dev Onboarding Kit depuis le HTML local.
 * Usage : node scripts/generate-kit-pdf.mjs
 *
 * Prérequis : pnpm add -D playwright && npx playwright install chromium
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath   = resolve(__dirname, '../public/kit/index.html');
const outputPath = resolve(__dirname, '../public/kit/dev-onboarding-kit.pdf');

if (!existsSync(htmlPath)) {
  console.error('❌  HTML source introuvable :', htmlPath);
  process.exit(1);
}

console.log('⏳  Génération du PDF en cours...');

const browser = await chromium.launch();
const page    = await browser.newPage();

await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

await page.waitForTimeout(1500);

await page.pdf({
  path:              outputPath,
  format:            'A4',
  printBackground:   true,
  margin:            { top: '0', right: '0', bottom: '0', left: '0' },
  displayHeaderFooter: false,
});

await browser.close();

console.log('✅  PDF généré :', outputPath);
