import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, 'public/images/hero_bg_daruzen.png');
const outputPath = join(__dirname, 'public/images/hero_bg_daruzen.webp');

try {
  await sharp(inputPath)
    .webp({ 
      quality: 85,
      effort: 6,
      smartSubsample: true
    })
    .toFile(outputPath);
  
  console.log('✓ Successfully converted hero_bg_daruzen.png to WebP');
  console.log(`  Output: ${outputPath}`);
} catch (error) {
  console.error('Error converting image:', error);
  process.exit(1);
}