// Lesson 40 sound design. Every effect is synthesized (scripts/make_sfx.py); times are absolute seconds on the lesson timeline.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START, TOTAL_FRAMES} from './theme';

const DUR: Record<string, number> = {key: 0.14, tick: 0.06, pop: 0.26, whoosh: 0.75, chime: 1.45, error: 0.52, alert: 0.52, scan: 0.92, shine: 1.62};
type Cue = {at: number; file: string; vol: number};
const one = (file: string, vol: number, ...times: number[]): Cue[] => times.map((at) => ({at, file, vol}));
const run = (file: string, vol: number, from: number, to: number, n: number): Cue[] => Array.from({length: n}, (_, i) => ({at: from + ((to - from) * i) / Math.max(1, n - 1), file, vol}));

const CUES: Cue[] = [
  ...one('whoosh', 0.3, START.s2 - 0.3, START.s3 - 0.3, START.s4 - 0.3, START.s5 - 0.3, START.s6 - 0.3),
  // ---- scene 1: A2# spilled bulk lookup
  ...one('pop', 0.25, 3.0), ...run('tick', 0.18, 3.6, 5.9, 14), ...one('key', 0.4, 6.2), ...run('pop', 0.2, 6.3, 7.2, 6), ...one('tick', 0.3, 12.0), ...one('alert', 0.25, 23.5),
  ...run('tick', 0.18, 28.9, 34.8, 28), ...one('key', 0.4, 35.0), ...run('pop', 0.25, 35.1, 36.2, 6), ...one('chime', 0.35, 36.4),
  // ---- scene 2: multi-column + if_not_found
  ...one('key', 0.4, 42.0), ...one('tick', 0.3, 41.2, 43.3, 46.3), ...run('tick', 0.15, 43.6, 44.4, 5), ...one('key', 0.35, 44.7), ...run('tick', 0.18, 46.6, 52.4, 28), ...one('key', 0.4, 52.6),
  ...run('pop', 0.3, 52.7, 53.0, 3), ...one('chime', 0.35, 53.4), ...one('tick', 0.3, 58.9), ...run('tick', 0.15, 59.1, 60.0, 5), ...one('key', 0.35, 60.2), ...one('shine', 0.35, 60.5),
  ...one('alert', 0.25, 64.9), ...one('tick', 0.3, 67.3, 69.2), ...run('tick', 0.15, 67.5, 68.4, 5), ...one('key', 0.35, 68.6), ...run('tick', 0.18, 69.5, 72.4, 14), ...one('key', 0.4, 72.5), ...one('error', 0.3, 72.7),
  ...one('chime', 0.35, 75.5),
  // ---- scene 3: reverse + horizontal
  ...one('tick', 0.3, 86.5), ...run('tick', 0.18, 87.0, 90.6, 16), ...one('key', 0.4, 90.8), ...one('pop', 0.3, 91.0), ...one('tick', 0.3, 96.7),
  ...run('tick', 0.18, 97.3, 105.6, 34), ...one('key', 0.4, 105.8), ...one('scan', 0.35, 105.9), ...one('chime', 0.4, 108.6),
  ...one('pop', 0.3, 111.2), ...one('tick', 0.3, 112.2), ...run('tick', 0.18, 112.6, 115.8, 14), ...one('key', 0.4, 116.0), ...one('scan', 0.3, 116.1), ...one('chime', 0.35, 118.0),
  ...one('tick', 0.3, 120.7), ...run('pop', 0.25, 121.3, 124.0, 5), ...one('shine', 0.4, 124.4),
  // ---- scene 4: pipeline
  ...one('tick', 0.3, 131.4), ...run('tick', 0.18, 131.8, 145.0, 60), ...one('pop', 0.3, 139.4, 142.5), ...one('whoosh', 0.2, 142.5), ...one('key', 0.4, 145.2), ...run('pop', 0.3, 145.3, 145.8, 3), ...one('shine', 0.4, 146.0),
  ...one('tick', 0.3, 153.0), ...run('tick', 0.15, 153.3, 154.0, 5), ...one('key', 0.35, 154.1), ...one('pop', 0.3, 154.3), ...one('chime', 0.35, 154.8), ...one('shine', 0.3, 157.0),
  // ---- scene 5: enterprise
  ...run('tick', 0.18, 171.8, 175.2, 18), ...one('pop', 0.3, 175.8), ...one('key', 0.4, 177.2, 179.0), ...one('scan', 0.3, 177.4), ...one('tick', 0.3, 180.8),
  ...run('tick', 0.18, 181.0, 183.4, 12), ...one('key', 0.4, 183.6), ...run('pop', 0.25, 183.7, 184.8, 8), ...one('tick', 0.3, 184.2), ...run('tick', 0.18, 184.4, 190.4, 30), ...one('key', 0.4, 190.6),
  ...run('pop', 0.2, 190.7, 191.4, 8), ...one('scan', 0.4, 190.7), ...one('shine', 0.5, 192.2), ...one('chime', 0.3, 192.5),
  // ---- scene 6: end card
  ...one('chime', 0.3, 210.4), ...one('pop', 0.25, 210.9, 212.0, 213.1, 214.2, 215.3, 216.7, 225.5), ...one('tick', 0.3, 220.0), ...one('shine', 0.3, 229.5),
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
