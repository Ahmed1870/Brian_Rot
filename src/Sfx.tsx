// Lesson 31 sound design. Every effect is synthesized (scripts/make_sfx.py); times are absolute seconds on the lesson timeline.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START, TOTAL_FRAMES} from './theme';

const DUR: Record<string, number> = {key: 0.14, tick: 0.06, pop: 0.26, whoosh: 0.75, chime: 1.45, error: 0.52, alert: 0.52, scan: 0.92, shine: 1.62};
type Cue = {at: number; file: string; vol: number};
const one = (file: string, vol: number, ...times: number[]): Cue[] => times.map((at) => ({at, file, vol}));
const run = (file: string, vol: number, from: number, to: number, n: number): Cue[] => Array.from({length: n}, (_, i) => ({at: from + ((to - from) * i) / Math.max(1, n - 1), file, vol}));

const CUES: Cue[] = [
  ...one('whoosh', 0.3, START.s2 - 0.3, START.s3 - 0.3, START.s4 - 0.3, START.s5 - 0.3, START.s6 - 0.3),
  // ---- scene 1: canvas setup
  ...one('pop', 0.25, 3.0, 14.5), ...one('shine', 0.3, 16.0), ...one('pop', 0.3, 28.0, 32.1, 33.0), ...run('tick', 0.2, 33.5, 36.3, 19),
  ...one('key', 0.4, 36.4), ...one('whoosh', 0.25, 37.0, 38.0), ...one('chime', 0.35, 38.6), ...one('pop', 0.3, 39.0),
  // ---- scene 2: linked KPI cards
  ...one('pop', 0.3, 46.0, 49.2, 50.0, 51.5), ...one('whoosh', 0.25, 51.8), ...one('pop', 0.3, 53.7), ...run('tick', 0.2, 54.8, 56.3, 10), ...one('key', 0.4, 56.5),
  ...run('tick', 0.15, 56.6, 58.8, 14), ...one('chime', 0.4, 58.9), ...one('pop', 0.3, 65.3, 69.0, 72.0), ...one('tick', 0.3, 65.6, 69.3, 72.3),
  ...one('key', 0.4, 73.3, 73.6), ...one('pop', 0.3, 73.5, 74.7, 75.9), ...one('chime', 0.3, 76.2), ...one('pop', 0.3, 78.0, 79.0, 81.8), ...one('shine', 0.3, 82.0),
  // ---- scene 3: multi-column slicers
  ...one('alert', 0.25, 85.2), ...one('pop', 0.3, 97.8, 98.6, 100.8), ...one('tick', 0.3, 103.4), ...one('whoosh', 0.3, 104.0, 109.4), ...one('chime', 0.35, 110.6),
  ...one('pop', 0.3, 112.4, 113.6), ...run('tick', 0.2, 114.0, 115.6, 13), ...one('pop', 0.25, 116.0, 117.0), ...one('key', 0.4, 117.9), ...one('shine', 0.4, 118.4), ...one('pop', 0.3, 119.5, 122.5, 125.7), ...one('chime', 0.3, 126.5),
  // ---- scene 4: app-like UX + object lock
  ...one('pop', 0.3, 136.0, 138.0, 141.0, 143.4), ...one('scan', 0.3, 138.2, 141.2, 143.6), ...one('whoosh', 0.3, 145.1), ...one('shine', 0.3, 147.6),
  ...one('pop', 0.25, 148.9, 149.5, 150.1, 150.7, 151.5, 152.3, 153.0), ...one('key', 0.4, 154.0), ...one('pop', 0.3, 154.95, 155.4), ...one('key', 0.45, 157.2),
  ...one('chime', 0.35, 158.1, 158.4, 158.7, 159.0), ...one('shine', 0.45, 159.8),
  // ---- scene 5: enterprise
  ...run('tick', 0.18, 167.0, 170.4, 18), ...one('pop', 0.3, 171.2, 174.6), ...one('scan', 0.3, 176.3), ...one('pop', 0.3, 180.5, 183.0, 185.5, 188.0), ...one('tick', 0.3, 180.8, 183.3, 185.8, 188.3),
  ...one('scan', 0.4, 190.5), ...one('shine', 0.5, 192.0), ...one('chime', 0.3, 192.3),
  // ---- scene 6: end card
  ...one('chime', 0.3, 206.0), ...one('pop', 0.25, 208.4, 209.6, 210.8, 212.0, 217.0, 227.4), ...one('tick', 0.3, 218.9), ...one('shine', 0.3, 229.4),
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
