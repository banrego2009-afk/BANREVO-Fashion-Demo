/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node CommonJS asset import script. */
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

// Copy and compress the approved generated sources; preserve genuine alpha on cutouts.
async function main() {
  const manifest = JSON.parse(await fs.readFile(path.join(__dirname, '../docs/garment-generation-2026.json'), 'utf8'));
  for (const garment of manifest.garments) {
    const target = path.join(__dirname, '../public/images/collection-2026', garment.slug);
    await fs.mkdir(target, { recursive: true });
    for (const view of ['front', 'side', 'back', 'cutout']) {
      if (!garment[view]) continue;
      await sharp(garment[view]).resize({ width: view === 'cutout' ? 720 : 900, withoutEnlargement: true })
        .webp({ quality: 88, alphaQuality: 100, effort: 5 }).toFile(path.join(target, view + '.webp'));
    }
  }
  console.log('Imported available generated collection assets.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
