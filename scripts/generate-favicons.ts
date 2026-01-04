import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve } from "path";

const sizes: number[] = [16, 32, 48, 64, 128, 256];

const INPUT_SVG_PATH = resolve(process.cwd(), "public/logo-icon.svg");
const OUTPUT_DIR = resolve(process.cwd(), "public");

async function generateFavicons(): Promise<void> {
  const svgBuffer = readFileSync(INPUT_SVG_PATH);

  // PNG favicons
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(`${OUTPUT_DIR}/favicon-${size}.png`);
  }

  // favicon.ico (standard 32x32)
  await sharp(svgBuffer).resize(32, 32).toFile(`${OUTPUT_DIR}/favicon.ico`);

  console.log("✅ Favicons générés avec succès");
}

generateFavicons().catch((error) => {
  console.error("❌ Erreur lors de la génération des favicons", error);
  process.exit(1);
});
