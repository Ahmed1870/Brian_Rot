// Lesson 07 sound design. Every effect is synthesized (scripts/make_sfx.py); times are absolute seconds on the lesson timeline.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START, TOTAL_FRAMES} from './theme';

const DUR: Record<string, number> = {key: 0.14, tick: 0.06, pop: 0.26, whoosh: 0.75, chime: 1.45, error: 0.52, alert: 0.52, scan: 0.92, shine: 1.62};
type Cue = {at: number; file: string; vol: number};
const one = (file: string, vol: number, ...times: number[]): Cue[] => times.map((at) => ({at, file, vol}));
const run = (file: string, vol: number, from: number, to: number, n: number): Cue[] => Array.from({length: n}, (_, i) => ({at: from + ((to - from) * i) / Math.max(1, n - 1), file, vol}));

const CUES: Cue[] = [
  ...one('whoosh', 0.3, START.s2 - 0.3, START.s3 - 0.3, START.s4 - 0.3, START.s5 - 0.3, START.s6 - 0.3),
  // ---- scene 1: SUM + AutoSum
  ...one('pop', 0.25, 2.0, 10.35, 10.85, 11.7, 12.25),
  ...run('tick', 0.22, 21.9, 23.0, 11), ...one('alert', 0.25, 22.0),
  ...one('key', 0.4, 25.25, 25.95, 30.8), ...one('scan', 0.3, 28.0), ...one('pop', 0.4, 30.85), ...run('tick', 0.2, 30.85, 32.0, 12), ...one('chime', 0.3, 32.1),
  ...one('pop', 0.25, 32.6),
  // ---- scene 2: AVERAGE, blank vs zero
  ...run('tick', 0.22, 44.6, 46.1, 16), ...one('key', 0.4, 46.4), ...one('pop', 0.3, 46.8, 49.0),
  ...one('key', 0.4, 54.0, 54.6), ...one('scan', 0.3, 57.1), ...one('pop', 0.3, 63.7),
  ...one('key', 0.4, 67.9, 68.6), ...one('alert', 0.4, 69.0), ...one('pop', 0.3, 72.3), ...one('chime', 0.25, 72.6),
  // ---- scene 3: COUNT vs COUNTA
  ...one('pop', 0.3, 88.9, 90.2), ...run('tick', 0.22, 91.6, 93.2, 14),
  ...run('tick', 0.35, 93.4, 95.05, 6), ...one('key', 0.4, 95.6), ...one('chime', 0.3, 95.7),
  ...one('alert', 0.25, 98.3), ...run('tick', 0.22, 101.3, 102.9, 15),
  ...run('tick', 0.35, 102.6, 104.76, 9), ...one('key', 0.4, 105.4), ...one('chime', 0.3, 105.5),
  ...one('tick', 0.4, 107.1, 107.8, 108.4, 110.0), ...one('alert', 0.2, 109.2), ...one('pop', 0.3, 111.0), ...one('chime', 0.25, 116.3, 120.1), ...one('pop', 0.3, 121.4),
  // ---- scene 4: traps and errors
  ...one('error', 0.35, 133.4), ...one('scan', 0.3, 136.0), ...one('alert', 0.3, 139.0), ...one('tick', 0.4, 140.4, 143.3, 145.3),
  ...run('tick', 0.22, 147.8, 148.6, 5), ...one('key', 0.4, 148.8), ...one('error', 0.4, 148.9, 150.4), ...one('error', 0.25, 152.6),
  ...one('pop', 0.3, 156.4), ...one('chime', 0.3, 157.7), ...run('tick', 0.22, 160.8, 161.4, 3), ...one('key', 0.4, 161.6), ...one('chime', 0.4, 161.8), ...one('shine', 0.3, 162.2),
  // ---- scene 5: enterprise file + KPI cards
  ...run('tick', 0.18, 171.7, 174.2, 11), ...one('pop', 0.3, 174.5),
  ...one('key', 0.4, 180.7, 181.0, 182.6), ...run('tick', 0.15, 180.6, 182.4, 14),
  ...run('tick', 0.22, 183.5, 184.7, 12), ...run('tick', 0.22, 185.7, 187.1, 14), ...run('tick', 0.22, 188.0, 189.2, 12), ...run('tick', 0.22, 190.0, 191.3, 13),
  ...one('key', 0.4, 185.0, 187.4, 189.45, 191.6), ...one('pop', 0.45, 185.1, 187.5, 189.5, 191.7),
  ...one('scan', 0.35, 192.4), ...one('shine', 0.5, 196.7), ...one('chime', 0.3, 196.9),
  // ---- scene 6: end card
  ...one('chime', 0.3, 210.4), ...one('pop', 0.25, 211.4, 212.4, 213.4, 214.4, 216.6, 224.6), ...one('tick', 0.3, 219.8), ...one('shine', 0.3, 230.4),
];

export const Sfx: React.FC = () => (
  <div style={{display: 'contents'}}>
    <Sequence from={0} durationInFrames={TOTAL_FRAMES} layout="none"><Audio src={staticFile('sfx_ambient.mp3')} volume={0.1} /></Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.round(c.at * FPS)} durationInFrames={Math.ceil((DUR[c.file] ?? 0.3) * FPS) + 2} layout="none">
        <Audio src={staticFile(`sfx_${c.file}.mp3`)} volume={c.vol} />
      </Sequence>
    ))}
  </div>
);
