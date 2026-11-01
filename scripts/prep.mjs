// Writes src/generated.ts so the build never crashes if the voiceover mp3 isn't in /public yet.
import fs from 'node:fs';
const has = fs.existsSync(new URL('../public/voiceover_lesson_05.mp3', import.meta.url));
fs.writeFileSync(new URL('../src/generated.ts', import.meta.url), `export const HAS_VOICEOVER = ${has};\n`);
console.log(has ? '[prep] voiceover_lesson_05.mp3 found' : '[prep] WARNING: public/voiceover_lesson_05.mp3 missing -> rendering WITHOUT narration');
