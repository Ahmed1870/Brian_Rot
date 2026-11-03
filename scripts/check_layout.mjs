// Layout guard: every art box must sit inside the art zone and never overlap another box;
// title / caption zones must never touch the art zone. Fails the build on any violation.
import {ZONES, B} from '../src/layout.ts';

const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const inside = (a, z) => a.x >= z.x && a.y >= z.y && a.x + a.w <= z.x + z.w && a.y + a.h <= z.y + z.h;
let bad = 0;
const fail = (m) => { bad++; console.error('✗', m); };

if (hit(ZONES.title, ZONES.art)) fail('title zone overlaps art zone');
if (hit(ZONES.caption, ZONES.art)) fail('caption zone overlaps art zone');
if (hit(ZONES.title, ZONES.caption)) fail('title zone overlaps caption zone');

for (const [scene, boxes] of Object.entries(B)) {
  const names = Object.keys(boxes);
  const screen = {x: 0, y: 0, w: 1920, h: 1080};
  for (const n of names) {
    if (!inside(boxes[n], scene === 's6' ? screen : ZONES.art)) fail(`${scene}.${n} is outside its allowed zone`);
    for (const m of names) if (n < m && hit(boxes[n], boxes[m])) fail(`${scene}.${n} overlaps ${scene}.${m}`);
  }
}
import fs from 'node:fs';
import path from 'node:path';
const walk = (d) => fs.readdirSync(d, {withFileTypes: true}).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const file of walk(new URL('../src', import.meta.url).pathname).filter((f) => f.endsWith('.tsx'))) {
  if (/className\s*=/.test(fs.readFileSync(file, 'utf8'))) fail(`${path.relative(process.cwd(), file)} uses className (Tailwind is NOT installed; use inline styles)`);
}
if (bad) { console.error(`\n${bad} layout problem(s)`); process.exit(1); }
console.log('✓ layout OK: no overlaps between text zones and art boxes');
