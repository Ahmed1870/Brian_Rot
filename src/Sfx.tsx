// Lesson 46 sound design. Every effect is synthesized (scripts/make_sfx.py); times are absolute seconds on the lesson timeline.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START, TOTAL_FRAMES} from './theme';

const DUR: Record<string, number> = {key: 0.14, tick: 0.06, pop: 0.26, whoosh: 0.75, chime: 1.45, error: 0.52, alert: 0.52, scan: 0.92, shine: 1.62};
type Cue = {at: number; file: string; vol: number};
const one = (file: string, vol: number, ...times: number[]): Cue[] => times.map((at) => ({at, file, vol}));
const run = (file: string, vol: number, from: number, to: number, n: number): Cue[] => Array.from({length: n}, (_, i) => ({at: from + ((to - from) * i) / Math.max(1, n - 1), file, vol}));

const CUES: Cue[] = [
  ...one('whoosh', 0.3, START.s2 - 0.3, START.s3 - 0.3, START.s4 - 0.3, START.s5 - 0.3, START.s6 - 0.3),
  // ---- scene 1: ETL concept
  ...one('pop', 0.25, 2.1, 7.0), ...one('shine', 0.3, 17.9), ...one('alert', 0.25, 22.8, 26.4), ...one('pop', 0.3, 28.6, 31.9, 33.5), ...one('chime', 0.35, 35.2), ...one('shine', 0.3, 36.0),
  // ---- scene 2: launch editor + 4 zones
  ...one('pop', 0.25, 43.8), ...one('shine', 0.35, 50.4), ...one('scan', 0.3, 59.3, 61.9, 63.9, 66.0), ...one('chime', 0.3, 70.8),
  // ---- scene 3: applied steps
  ...one('pop', 0.3, 93.6, 97.5, 100.7), ...one('chime', 0.25, 94.0, 97.9, 101.1), ...one('scan', 0.3, 105.0), ...one('tick', 0.3, 108.0, 109.0), ...one('alert', 0.35, 112.3), ...one('chime', 0.35, 113.6), ...one('pop', 0.3, 121.9),
  // ---- scene 4: load target
  ...one('pop', 0.3, 137.0, 138.0), ...one('alert', 0.25, 143.5), ...one('chime', 0.35, 150.6), ...one('shine', 0.4, 152.8), ...one('pop', 0.3, 155.7), ...one('scan', 0.35, 156.4), ...one('shine', 0.3, 160.0),
  // ---- scene 5: enterprise refresh
  ...one('pop', 0.3, 176.8), ...run('tick', 0.18, 182.4, 185.0, 14), ...run('pop', 0.2, 185.6, 187.6, 5), ...one('pop', 0.3, 190.0), ...one('scan', 0.35, 191.6), ...one('pop', 0.3, 192.8), ...one('key', 0.4, 194.7), ...one('scan', 0.35, 194.8),
  ...one('shine', 0.4, 195.6), ...one('chime', 0.35, 195.9), ...one('shine', 0.5, 198.0),
  // ---- scene 6: end card
  ...one('chime', 0.3, 210.6), ...one('pop', 0.25, 211.5, 212.6, 213.7, 214.6, 215.4, 215.7), ...one('tick', 0.3, 219.4), ...one('pop', 0.25, 223.9), ...one('shine', 0.3, 230.2),
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
