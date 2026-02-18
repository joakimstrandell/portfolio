import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const publicDir = path.join(repoRoot, 'public');
const sourceSvgPath = path.join(publicDir, 'icon.svg');

async function renderPng(svg, size, outFile) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
  });

  const png = resvg.render().asPng();
  await fs.writeFile(path.join(publicDir, outFile), png);
}

const svg = await fs.readFile(sourceSvgPath, 'utf8');

await fs.copyFile(sourceSvgPath, path.join(publicDir, 'favicon.svg'));
await renderPng(svg, 16, 'favicon-16x16.png');
await renderPng(svg, 32, 'favicon-32x32.png');
await renderPng(svg, 180, 'apple-touch-icon.png');

console.log('Favicons generated in public/.');

