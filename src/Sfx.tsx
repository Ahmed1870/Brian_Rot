// Lesson 41 sound design. Every effect is synthesized (scripts/make_sfx.py); times are absolute seconds on the lesson timeline.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START, TOTAL_FRAMES} from './theme';

const DUR: Record<string, number> = {key: 0.14, tick: 0.06, pop: 0.26, whoosh: 0.75, chime: 1.45, error: 0.52, alert: 0.52, scan: 0.92, shine: 1.62};
type Cue = {at: number; file: string; vol: number};
const one = (file: string, vol: number, ...times: number[]): Cue[] => times.map((at) => ({at, file, vol}));
const run = (file: string, vol: number, from: number, to: number, n: number): Cue[] => Array.from({length: n}, (_, i) => ({at: from + ((to - from) * i) / Math.max(1, n - 1), file, vol}));

const CUES: Cue[] = [
  ...one('whoosh', 0.3, START.s2 - 0.3, START.s3 - 0.3, START.s4 - 0.3, START.s5 - 0.3, START.s6 - 0.3),
  // ---- scene 1: spilled SUMIFS
  ...one('pop', 0.25, 3.0), ...one('tick', 0.3, 3.6), ...run('tick', 0.18, 3.8, 6.2, 14), ...one('key', 0.4, 6.4), ...run('pop', 0.2, 6.5, 7.2, 4), ...one('tick', 0.3, 11.5), ...one('alert', 0.25, 22.4),
  ...run('tick', 0.18, 22.4, 28.2, 28), ...one('key', 0.4, 30.3), ...run('pop', 0.25, 30.4, 31.2, 4), ...one('chime', 0.35, 31.6),
  // ---- scene 2: 2D matrix
  ...one('tick', 0.3, 41.2, 45.5), ...run('tick', 0.18, 41.6, 44.6, 16), ...one('key', 0.4, 44.8), ...run('pop', 0.2, 44.9, 45.4, 3), ...run('tick', 0.18, 45.9, 53.3, 36), ...one('key', 0.4, 54.6),
  ...run('pop', 0.25, 54.7, 56.5, 12), ...one('chime', 0.4, 57.0), ...one('shine', 0.3, 57.6), ...one('alert', 0.25, 65.7), ...one('chime', 0.3, 72.4),
  // ---- scene 3: zero-maintenance
  ...one('tick', 0.3, 86.6), ...run('tick', 0.18, 87.0, 90.0, 14), ...one('key', 0.4, 90.3), ...run('pop', 0.2, 90.4, 91.0, 4), ...run('tick', 0.18, 91.8, 100.8, 40), ...one('key', 0.4, 101.2), ...run('pop', 0.25, 101.3, 102.0, 4), ...one('shine', 0.3, 102.2),
  ...one('tick', 0.3, 110.1), ...run('tick', 0.15, 110.5, 113.8, 16), ...one('key', 0.35, 111.2, 112.1, 113.1, 114.0), ...one('pop', 0.3, 114.2), ...one('shine', 0.4, 114.5), ...one('chime', 0.4, 115.0), ...one('alert', 0.2, 123.8),
  // ---- scene 4: COUNTIFS / AVERAGEIFS
  ...run('tick', 0.15, 131.6, 133.2, 5), ...one('key', 0.35, 133.4, 135.8), ...run('tick', 0.15, 134.0, 135.6, 5), ...run('pop', 0.2, 133.5, 134.2, 4), ...run('tick', 0.18, 136.8, 143.0, 30), ...one('key', 0.4, 143.2), ...run('pop', 0.3, 143.3, 144.8, 12), ...one('chime', 0.35, 145.0),
  ...run('tick', 0.18, 143.8, 148.2, 20), ...one('key', 0.4, 148.4), ...run('pop', 0.25, 148.5, 149.2, 4), ...one('scan', 0.3, 150.6), ...one('shine', 0.45, 157.0),
  // ---- scene 5: enterprise
  ...run('tick', 0.18, 171.8, 175.2, 18), ...one('pop', 0.3, 175.8), ...one('key', 0.4, 177.2, 179.2), ...one('scan', 0.3, 177.4), ...one('tick', 0.3, 180.2),
  ...run('tick', 0.18, 180.6, 183.0, 12), ...one('key', 0.4, 183.2), ...run('pop', 0.2, 183.3, 184.2, 5), ...run('tick', 0.18, 183.6, 186.6, 14), ...one('key', 0.4, 186.8), ...run('tick', 0.18, 187.2, 191.6, 22), ...one('key', 0.4, 191.8),
  ...run('pop', 0.2, 191.9, 193.0, 12), ...one('scan', 0.4, 191.9), ...one('shine', 0.5, 192.4), ...one('chime', 0.3, 192.7),
  // ---- scene 6: end card
  ...one('chime', 0.3, 210.6), ...one('pop', 0.25, 211.4, 212.5, 213.6, 214.7, 215.8, 217.2, 225.6), ...one('tick', 0.3, 220.9), ...one('shine', 0.3, 229.8),
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
