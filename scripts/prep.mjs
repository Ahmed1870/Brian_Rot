// Safety gate for CI: the render must be for THIS lesson, with narration, or it fails loudly.
import fs from 'node:fs';
const LESSON = '18', COMP = 'Ahmed-SQL-L18';
const root = new URL('../', import.meta.url);
const fail = (m) => { console.error('✗ ' + m); process.exit(1); };

const voice = new URL(`public/voiceover_lesson_${LESSON}.mp3`, root);
if (!fs.existsSync(voice)) fail(`public/voiceover_lesson_${LESSON}.mp3 is missing`);

const lessons = fs.readdirSync(new URL('src/', root)).filter((f) => /^Lesson\d+\.tsx$/.test(f));
if (lessons.length !== 1 || lessons[0] !== `Lesson${LESSON}.tsx`) fail(`expected only src/Lesson${LESSON}.tsx, found: ${lessons.join(', ') || 'none'}`);

if (!fs.readFileSync(new URL('src/Root.tsx', root), 'utf8').includes(`id="${COMP}"`)) fail(`Root.tsx must register composition ${COMP}`);

fs.writeFileSync(new URL('src/generated.ts', root), 'export const HAS_VOICEOVER = true;\n');
console.log(`✓ prep OK: lesson ${LESSON} · composition ${COMP} · narration found`);
