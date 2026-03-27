import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { Resvg } from '@resvg/resvg-js';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src', 'content', 'philes');
const OUTPUT_DIR = path.join(ROOT, 'public', 'og');
const WIDTH = 1200;
const HEIGHT = 630;

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function createSvg({ title, subtitle, eyebrow, footer, palette }) {
  const [base = '#0b1020', accent = '#3d5af1', glow = '#d3b06a'] = palette;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${WIDTH}" y2="${HEIGHT}" gradientUnits="userSpaceOnUse">
      <stop stop-color="${base}"/>
      <stop offset="0.58" stop-color="${accent}"/>
      <stop offset="1" stop-color="${glow}"/>
    </linearGradient>
    <radialGradient id="orbA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(220 140) rotate(46) scale(340 220)">
      <stop stop-color="rgba(255,255,255,0.28)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <radialGradient id="orbB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(980 120) rotate(121) scale(260 200)">
      <stop stop-color="rgba(255,255,255,0.16)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#07070c"/>
  <rect width="${WIDTH}" height="${HEIGHT}" rx="36" fill="url(#bg)"/>
  <rect x="24" y="24" width="${WIDTH - 48}" height="${HEIGHT - 48}" rx="28" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#orbA)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#orbB)"/>
  <g fill="#F4EFE6">
    <text x="64" y="92" font-size="18" font-family="Arial, Helvetica, sans-serif" letter-spacing="6" opacity="0.78">${escapeXml(eyebrow)}</text>
    <text x="64" y="248" font-size="82" font-family="Georgia, 'Times New Roman', serif" font-weight="700" letter-spacing="-3" fill="#FFFFFF">${escapeXml(title)}</text>
    <text x="64" y="318" font-size="28" font-family="Arial, Helvetica, sans-serif" opacity="0.92">${escapeXml(subtitle)}</text>
    <text x="64" y="574" font-size="20" font-family="Arial, Helvetica, sans-serif" letter-spacing="3" opacity="0.76">${escapeXml(footer)}</text>
    <text x="${WIDTH - 190}" y="574" font-size="20" font-family="Arial, Helvetica, sans-serif" letter-spacing="3" opacity="0.76">PHILEPEDIA</text>
  </g>
</svg>`;
}

async function readEntries() {
  const files = (await fs.readdir(CONTENT_DIR)).filter((file) => file.endsWith('.md')).sort();
  return Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(CONTENT_DIR, file);
      const { data } = matter(await fs.readFile(fullPath, 'utf8'));
      return data;
    })
  );
}

async function writePng(svg, outputPath) {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: WIDTH
    }
  });
  const png = resvg.render().asPng();
  await fs.writeFile(outputPath, png);
}

await fs.mkdir(OUTPUT_DIR, { recursive: true });

await writePng(
  createSvg({
    eyebrow: 'THE LIVING ENCYCLOPEDIA OF PASSIONS',
    title: 'Philepedia',
    subtitle: 'Search what you love. Find the word that names it.',
    footer: '60 FLAGSHIP PHILES',
    palette: ['#0b1020', '#3d5af1', '#d3b06a']
  }),
  path.join(OUTPUT_DIR, 'site.png')
);

const entries = await readEntries();
for (const entry of entries) {
  await writePng(
    createSvg({
      eyebrow: `${entry.category} | ${entry.heroStyle}`.toUpperCase(),
      title: entry.name,
      subtitle: entry.shortDescription,
      footer: `/${entry.slug}`,
      palette: entry.colorPalette
    }),
    path.join(OUTPUT_DIR, `${entry.slug}.png`)
  );
}

console.log(`Generated ${entries.length + 1} OG images in public/og.`);
