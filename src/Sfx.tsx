// Lesson 56 sound design. Every effect is synthesized (scripts/make_sfx.py); times are absolute seconds on the lesson timeline.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START, TOTAL_FRAMES} from './theme';

const DUR: Record<string, number> = {key: 0.14, tick: 0.06, pop: 0.26, whoosh: 0.75, chime: 1.45, error: 0.52, alert: 0.52, scan: 0.92, shine: 1.62};
type Cue = {at: number; file: string; vol: number};
const one = (file: string, vol: number, ...times: number[]): Cue[] => times.map((at) => ({at, file, vol}));
const run = (file: string, vol: number, from: number, to: number, n: number): Cue[] => Array.from({length: n}, (_, i) => ({at: from + ((to - from) * i) / Math.max(1, n - 1), file, vol}));

const CUES: Cue[] = [
  ...one('whoosh', 0.3, START.s2 - 0.3, START.s3 - 0.3, START.s4 - 0.3, START.s5 - 0.3, START.s6 - 0.3),
  // ---- scene 1: diagnostics
  ...one('pop', 0.25, 0.9, 7.5), ...one('alert', 0.3, 14.8), ...one('pop', 0.25, 18.1, 23.0), ...one('scan', 0.4, 26.0), ...one('shine', 0.4, 31.3), ...one('chime', 0.3, 36.7),
  // ---- scene 2: cardinality
  ...one('pop', 0.25, 43.3), ...run('tick', 0.15, 47.2, 48.4, 5), ...one('alert', 0.3, 51.2, 55.4), ...one('error', 0.2, 61.5), ...one('click', 0.3, 70.0, 79.0, 80.2, 81.0, 81.8), ...one('pop', 0.25, 70.8), ...one('shine', 0.4, 74.8), ...one('pop', 0.3, 80.4, 82.0), ...one('shine', 0.45, 82.8),
  // ---- scene 3: blank rows
  ...one('click', 0.3, 99.9, 103.9, 113.0, 118.4), ...one('alert', 0.35, 99.9), ...one('pop', 0.25, 102.2, 105.5, 107.5), ...one('error', 0.25, 110.2), ...run('key', 0.2, 114.2, 117.6, 14), ...one('key', 0.3, 120.3), ...one('shine', 0.4, 122.0), ...one('chime', 0.35, 124.7),
  // ---- scene 4: pivot from the data model
  ...one('click', 0.3, 134.2, 138.2, 140.1, 141.6, 143.8, 145.6, 148.3, 166.0, 169.0), ...one('pop', 0.25, 138.4, 140.4), ...one('tick', 0.3, 143.8, 145.6, 148.3), ...one('scan', 0.35, 148.7), ...one('pop', 0.25, 158.3, 160.5, 164.0), ...one('chime', 0.3, 166.3),
  // ---- scene 5: enterprise audit
  ...one('pop', 0.3, 171.4), ...run('tick', 0.18, 171.4, 176.4, 16), ...one('chime', 0.3, 185.3, 187.2, 189.2, 191.0), ...one('pop', 0.25, 193.2), ...one('key', 0.3, 196.8), ...one('chime', 0.3, 197.6), ...one('shine', 0.5, 200.3), ...one('chime', 0.3, 200.6),
  // ---- scene 6: end card
  ...one('chime', 0.3, 209.9), ...one('pop', 0.25, 210.6, 211.2, 212.4, 213.6, 214.8, 216.0, 217.4, 220.9), ...one('tick', 0.3, 223.8), ...one('pop', 0.25, 225.4), ...one('shine', 0.3, 231.0),
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
