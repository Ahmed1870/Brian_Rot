// Lesson 54 sound design. Every effect is synthesized (scripts/make_sfx.py); times are absolute seconds on the lesson timeline.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START, TOTAL_FRAMES} from './theme';

const DUR: Record<string, number> = {key: 0.14, tick: 0.06, pop: 0.26, whoosh: 0.75, chime: 1.45, error: 0.52, alert: 0.52, scan: 0.92, shine: 1.62};
type Cue = {at: number; file: string; vol: number};
const one = (file: string, vol: number, ...times: number[]): Cue[] => times.map((at) => ({at, file, vol}));
const run = (file: string, vol: number, from: number, to: number, n: number): Cue[] => Array.from({length: n}, (_, i) => ({at: from + ((to - from) * i) / Math.max(1, n - 1), file, vol}));

const CUES: Cue[] = [
  ...one('whoosh', 0.3, START.s2 - 0.3, START.s3 - 0.3, START.s4 - 0.3, START.s5 - 0.3, START.s6 - 0.3),
  // ---- scene 1: tangled joins -> star
  ...one('pop', 0.25, 0.9, 7.9), ...one('alert', 0.25, 15.9), ...one('shine', 0.4, 22.4), ...one('chime', 0.3, 24.2), ...one('pop', 0.25, 28.0),
  // ---- scene 2: keys
  ...one('pop', 0.25, 44.7, 50.5, 53.0, 56.5, 58.2, 66.0), ...one('chime', 0.35, 46.5, 54.8, 61.6), ...run('tick', 0.18, 57.0, 58.4, 6), ...one('shine', 0.4, 60.4),
  // ---- scene 3: drag & drop relationships
  ...one('pop', 0.3, 89.2), ...one('chime', 0.3, 93.0), ...one('shine', 0.4, 96.7), ...one('pop', 0.3, 100.6, 102.2, 103.4, 107.9, 110.4, 112.6), ...one('shine', 0.45, 113.3), ...one('chime', 0.3, 114.2),
  // ---- scene 4: filter flow + inactive relationship
  ...one('pop', 0.3, 134.9, 139.6, 152.0), ...one('chime', 0.35, 136.3, 140.8), ...one('scan', 0.3, 136.6, 141.0), ...one('alert', 0.3, 144.2, 155.4), ...one('chime', 0.3, 156.0), ...one('error', 0.25, 158.0),
  // ---- scene 5: enterprise
  ...one('pop', 0.3, 171.0), ...run('tick', 0.18, 171.4, 176.4, 16), ...one('pop', 0.3, 178.4, 180.4, 182.0, 183.5), ...one('chime', 0.35, 184.0), ...one('pop', 0.3, 185.4, 186.35, 192.0, 196.0), ...one('tick', 0.3, 187.0, 187.7, 188.4), ...one('scan', 0.35, 188.7),
  ...one('shine', 0.5, 198.4), ...one('chime', 0.3, 198.7),
  // ---- scene 6: end card
  ...one('chime', 0.3, 210.6), ...one('pop', 0.25, 211.4, 212.5, 213.5, 214.4, 215.3, 215.8), ...one('tick', 0.3, 219.5), ...one('pop', 0.25, 224.0), ...one('shine', 0.3, 230.2),
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
