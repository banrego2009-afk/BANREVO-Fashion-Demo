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
      let source = sharp(garment[view]);
      if (view === 'cutout' && garment.cutoutNeutralBackdrop) {
        const { data, info } = await source.removeAlpha().raw().toBuffer({ resolveWithObject: true });
        const rgba = Buffer.alloc(info.width * info.height * 4);
        for (let input = 0, output = 0; input < data.length; input += info.channels, output += 4) {
          const red = data[input];
          const green = data[input + 1];
          const blue = data[input + 2];
          const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
          rgba[output] = red;
          rgba[output + 1] = green;
          rgba[output + 2] = blue;
          rgba[output + 3] = Math.round(Math.max(0, Math.min(1, (chroma - 2) / 12)) * 255);
        }
        source = sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } });
      }
      await source.resize({ width: view === 'cutout' ? 720 : 900, withoutEnlargement: true })
        .webp({ quality: 88, alphaQuality: 100, effort: 5 }).toFile(path.join(target, view + '.webp'));
    }
  }
  console.log('Imported available generated collection assets.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
