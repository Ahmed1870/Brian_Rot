// Lesson 22 sound design. Every effect is synthesized (scripts/make_sfx.py); times are absolute seconds on the lesson timeline.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START, TOTAL_FRAMES} from './theme';

const DUR: Record<string, number> = {key: 0.14, tick: 0.06, pop: 0.26, whoosh: 0.75, chime: 1.45, error: 0.52, alert: 0.52, scan: 0.92, shine: 1.62};
type Cue = {at: number; file: string; vol: number};
const one = (file: string, vol: number, ...times: number[]): Cue[] => times.map((at) => ({at, file, vol}));
const run = (file: string, vol: number, from: number, to: number, n: number): Cue[] => Array.from({length: n}, (_, i) => ({at: from + ((to - from) * i) / Math.max(1, n - 1), file, vol}));

const CUES: Cue[] = [
  ...one('whoosh', 0.3, START.s2 - 0.3, START.s3 - 0.3, START.s4 - 0.3, START.s5 - 0.3, START.s6 - 0.3),
  // ---- scene 1: why validation
  ...one('pop', 0.25, 3.0), ...run('tick', 0.22, 9.2, 10.0, 3), ...one('alert', 0.3, 10.8), ...one('shine', 0.35, 14.5), ...one('error', 0.3, 15.7),
  ...run('tick', 0.2, 16.6, 18.2, 7), ...one('key', 0.4, 19.5, 19.9, 20.3, 20.7), ...one('pop', 0.3, 20.0, 28.2, 29.6, 31.9),
  ...run('tick', 0.2, 34.2, 35.2, 7), ...one('key', 0.4, 36.0), ...run('tick', 0.2, 36.5, 37.2, 3), ...one('error', 0.45, 37.7),
  // ---- scene 2: dynamic list
  ...one('pop', 0.3, 44.4, 49.4), ...run('tick', 0.2, 51.6, 56.2, 30), ...one('key', 0.4, 56.9), ...one('chime', 0.3, 57.2), ...one('scan', 0.3, 57.5),
  ...one('key', 0.4, 59.9, 60.2, 60.5, 60.8), ...one('pop', 0.3, 60.6), ...run('tick', 0.25, 62.6, 64.6, 4), ...one('shine', 0.35, 64.8),
  ...one('key', 0.4, 66.4), ...one('pop', 0.3, 67.5, 69.9), ...run('tick', 0.2, 73.3, 75.8, 19), ...one('key', 0.4, 76.0), ...one('chime', 0.4, 76.3), ...one('pop', 0.3, 77.4), ...one('shine', 0.3, 80.0),
  // ---- scene 3: custom rules
  ...run('tick', 0.2, 86.0, 87.5, 7), ...one('key', 0.4, 88.4, 88.7, 89.0, 89.3), ...one('pop', 0.3, 91.4), ...run('tick', 0.2, 96.3, 99.0, 18), ...one('key', 0.4, 99.6),
  ...run('tick', 0.2, 101.0, 102.6, 8), ...one('key', 0.4, 103.0), ...one('error', 0.45, 104.5), ...one('alert', 0.3, 104.6),
  ...run('tick', 0.2, 108.2, 109.0, 6), ...run('tick', 0.2, 109.9, 112.4, 24), ...one('key', 0.4, 113.2), ...run('tick', 0.2, 115.0, 115.9, 8), ...one('error', 0.4, 116.4),
  ...run('tick', 0.2, 117.0, 117.9, 8), ...one('chime', 0.35, 118.2), ...one('shine', 0.3, 121.0),
  // ---- scene 4: alert styles + input message
  ...one('pop', 0.3, 131.2, 136.5), ...one('error', 0.4, 137.0), ...one('pop', 0.3, 142.0), ...one('alert', 0.35, 142.4), ...one('pop', 0.3, 145.8), ...one('chime', 0.3, 146.2),
  ...one('pop', 0.3, 148.7), ...run('tick', 0.2, 149.4, 150.4, 6), ...run('tick', 0.2, 150.8, 153.4, 22), ...one('key', 0.4, 154.0), ...one('pop', 0.4, 155.0), ...one('shine', 0.3, 157.5),
  // ---- scene 5: enterprise
  ...run('tick', 0.18, 171.7, 174.2, 11), ...one('pop', 0.3, 174.5), ...one('scan', 0.3, 185.4),
  ...run('tick', 0.2, 185.6, 186.6, 9), ...one('key', 0.4, 186.9), ...one('pop', 0.4, 187.2), ...run('tick', 0.2, 187.9, 188.9, 9), ...one('key', 0.4, 189.0), ...one('pop', 0.4, 189.3),
  ...run('tick', 0.2, 189.6, 190.6, 9), ...one('key', 0.4, 190.7), ...one('pop', 0.4, 191.0), ...one('scan', 0.4, 192.5), ...one('shine', 0.5, 195.0), ...one('chime', 0.3, 195.2),
  // ---- scene 6: end card
  ...one('chime', 0.3, 210.4), ...one('pop', 0.25, 211.4, 212.6, 213.8, 215.0, 217.0, 226.0), ...one('tick', 0.3, 219.8), ...one('shine', 0.3, 229.5),
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
