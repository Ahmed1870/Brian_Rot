// Lesson 63 sound design. Every effect is synthesized (scripts/make_sfx.py); times are absolute seconds on the lesson timeline.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START, TOTAL_FRAMES} from './theme';

const DUR: Record<string, number> = {key: 0.14, tick: 0.06, pop: 0.26, whoosh: 0.75, chime: 1.45, error: 0.52, alert: 0.52, scan: 0.92, shine: 1.62};
type Cue = {at: number; file: string; vol: number};
const one = (file: string, vol: number, ...times: number[]): Cue[] => times.map((at) => ({at, file, vol}));
const run = (file: string, vol: number, from: number, to: number, n: number): Cue[] => Array.from({length: n}, (_, i) => ({at: from + ((to - from) * i) / Math.max(1, n - 1), file, vol}));

const CUES: Cue[] = [
  ...one('whoosh', 0.3, START.s2 - 0.3, START.s3 - 0.3, START.s4 - 0.3, START.s5 - 0.3, START.s6 - 0.3),
  // ---- scene 1: totals vs statistics
  ...one('pop', 0.25, 0.9, 7.5, 17.6), ...one('alert', 0.3, 26.2), ...one('scan', 0.4, 34.7), ...one('chime', 0.3, 36.4, 37.9),
  // ---- scene 2: ToolPak + descriptive statistics
  ...one('click', 0.3, 46.9, 47.9, 48.8, 49.5, 50.1, 50.9, 51.4, 51.9, 52.3, 53.4, 54.4, 55.4, 57.0, 58.8, 59.7, 60.4, 60.9, 61.4, 62.4), ...one('pop', 0.25, 47.0, 48.0, 50.2, 53.4, 55.6), ...one('shine', 0.4, 52.4), ...run('key', 0.15, 57.1, 58.6, 12), ...run('tick', 0.18, 65.6, 70.0, 16), ...one('chime', 0.3, 72.8, 75.6), ...one('pop', 0.25, 70.2, 78.9),
  // ---- scene 3: mean vs median vs mode
  ...one('pop', 0.25, 88.2, 91.2, 92.3, 93.4), ...one('click', 0.3, 95.4, 100.9, 105.6, 114.3), ...run('key', 0.2, 96.0, 97.8, 14), ...run('key', 0.2, 101.0, 102.2, 5), ...one('alert', 0.35, 102.4), ...one('error', 0.25, 103.6), ...run('key', 0.2, 106.0, 107.4, 13), ...run('tick', 0.15, 108.0, 109.6, 8), ...one('chime', 0.35, 109.9), ...run('key', 0.2, 114.8, 116.8, 16), ...one('shine', 0.4, 117.3), ...one('chime', 0.3, 121.9),
  // ---- scene 4: static vs dynamic
  ...one('error', 0.3, 139.1, 142.9), ...one('click', 0.3, 139.8, 140.3, 142.3, 144.8, 147.3, 149.7, 156.1, 158.6, 160.6, 164.8, 166.2, 168.0, 168.8), ...run('key', 0.2, 140.5, 141.5, 7), ...run('key', 0.2, 145.0, 146.4, 14), ...run('key', 0.2, 147.4, 148.2, 12), ...run('key', 0.2, 149.8, 151.6, 14), ...run('key', 0.2, 156.3, 157.9, 14), ...run('key', 0.2, 158.7, 160.4, 22), ...run('key', 0.2, 160.7, 162.4, 22), ...one('chime', 0.3, 146.6, 148.4, 151.8, 158.1, 166.4, 169.0),
  // ---- scene 5: enterprise
  ...one('pop', 0.3, 171.6, 177.3), ...one('click', 0.3, 181.8, 183.2, 183.9, 184.6), ...run('tick', 0.2, 185.0, 187.8, 7), ...one('scan', 0.35, 187.4), ...one('chime', 0.3, 192.2), ...one('shine', 0.5, 194.2), ...one('chime', 0.3, 194.5), ...one('pop', 0.25, 197.0, 199.4),
  // ---- scene 6: end card
  ...one('chime', 0.3, 208.9), ...one('pop', 0.25, 209.7, 210.2, 211.2, 212.2, 213.2, 214.2, 215.0, 217.9), ...one('tick', 0.3, 220.3), ...one('pop', 0.25, 225.4), ...one('shine', 0.3, 229.7),
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
