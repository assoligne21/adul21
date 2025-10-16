import sharp from 'sharp';
import toIco from 'to-ico';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Créer l'image PNG avec sharp
const svg = readFileSync(join(publicDir, 'favicon.svg'));

async function generateFavicons() {
  // Générer PNG 32x32 pour le .ico
  const png32 = await sharp(svg)
    .resize(32, 32)
    .png()
    .toBuffer();

  // Générer PNG 16x16 pour le .ico (fallback)
  const png16 = await sharp(svg)
    .resize(16, 16)
    .png()
    .toBuffer();

  // Créer le fichier .ico avec plusieurs tailles
  const ico = await toIco([png16, png32]);
  writeFileSync(join(publicDir, 'favicon.ico'), ico);
  console.log('✅ favicon.ico créé (16x16, 32x32)');

  // Générer apple-touch-icon.png (180x180)
  await sharp(svg)
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('✅ apple-touch-icon.png créé (180x180)');

  // Générer différentes tailles pour PWA
  const sizes = [192, 512];
  for (const size of sizes) {
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, `icon-${size}x${size}.png`));
    console.log(`✅ icon-${size}x${size}.png créé`);
  }

  console.log('\n🎉 Tous les favicons ont été générés avec succès!');
}

generateFavicons().catch(console.error);
