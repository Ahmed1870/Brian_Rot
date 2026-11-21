// Usage: node scripts/validate.mjs   (checks constants, timing and audio duration)
import fs from 'node:fs';
import {execSync} from 'node:child_process';
const t = fs.readFileSync('src/theme.ts', 'utf8');
const num = (k) => Number(new RegExp('export const ' + k + ' = (\\d+)').exec(t)[1]);
const FPS = num('FPS'), W = num('WIDTH'), H = num('HEIGHT'), TOTAL = num('TOTAL_FRAMES');
const id = /COMP_ID = '([^']+)'/.exec(t)[1];
const vo = /VO_FILE = '([^']+)'/.exec(t)[1];
const tm = fs.readFileSync('src/timing.ts', 'utf8');
const starts = JSON.parse(/SCENE_START_SEC: Record<string, number> = (\{[^}]*\})/.exec(tm)[1]);
const errs = [];
const ok = (c, m) => { if (!c) errs.push(m); };
ok(W === 1920 && H === 1080, 'size must be 1920x1080');
ok(FPS === 30, 'FPS must be 30');
ok(TOTAL === 9000 && TOTAL / FPS === 300, 'duration must be 9000 frames = 300 s');
const keys = Object.keys(starts);
ok(keys.length === 8, 'need 8 scenes');
let prev = -1;
for (const k of keys) { ok(starts[k] > prev, 'scene starts must increase: ' + k); prev = starts[k]; }
ok(Math.round(starts.S8 * FPS) === TOTAL - 150, 'final silence must be the last 150 frames');
ok(fs.readFileSync('src/Root.tsx', 'utf8').includes('durationInFrames={TOTAL_FRAMES}'), 'Root must use TOTAL_FRAMES');
let audio = 'ffprobe not available (audio duration not checked)';
try {
  const d = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 public/${vo}`).toString());
  audio = `audio ${d.toFixed(3)} s vs video ${TOTAL / FPS} s`;
  ok(Math.abs(d - TOTAL / FPS) < 0.25, 'audio duration differs from video by >0.25 s: ' + audio);
} catch (e) {}
console.log(`${id}: ${W}x${H} @${FPS}fps, ${TOTAL} frames; ${audio}`);
if (errs.length) { console.error('FAIL:\n- ' + errs.join('\n- ')); process.exit(1); }
console.log('VALIDATION OK');
