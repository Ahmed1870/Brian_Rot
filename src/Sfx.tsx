// Sound effects for Lesson 71 — Macro Recorder Automation.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START} from './theme';

type Cue = {at: number; file: string; vol: number; dur: number};
const cue = (file: string, vol: number, dur: number, times: number[]): Cue[] => times.map((at) => ({at, file, vol, dur}));

const CUES: Cue[] = [
  // SC01 — automation engine intro
  ...cue('sfx_whoosh.mp3', 0.28, 0.7, [START.s2, START.s3, START.s4, START.s5, START.s6].map((s) => s - 0.25)),
  ...cue('sfx_chime.mp3', 0.35, 1.0, [5.5]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [11.0, 17.0]),
  ...cue('sfx_tick.mp3', 0.3, 0.15, [25.0, 27.0]),

  // SC02 — developer tab + relative references
  ...cue('sfx_click.mp3', 0.4, 0.2, [41.0, 47.0, 53.0]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [50.0]),
  ...cue('sfx_tick.mp3', 0.3, 0.15, [60.0, 68.0]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [80.0]),
  ...cue('sfx_chime.mp3', 0.35, 0.8, [82.0]),

  // SC03 — storage scope + file types
  ...cue('sfx_pop.mp3', 0.35, 0.3, [88.0, 96.0]),
  ...cue('sfx_chime.mp3', 0.35, 1.0, [99.0]),
  ...cue('sfx_whoosh.mp3', 0.25, 0.5, [110.0]),
  ...cue('sfx_tick.mp3', 0.3, 0.15, [115.0, 122.0]),
  ...cue('sfx_pop.mp3', 0.35, 0.3, [125.0]),

  // SC04 — assign macro + shortcut
  ...cue('sfx_click.mp3', 0.45, 0.2, [132.0, 138.0, 144.0]),
  ...cue('sfx_chime.mp3', 0.35, 1.0, [148.0]),
  ...cue('sfx_key.mp3', 0.4, 0.2, [155.0, 158.0, 160.0]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [165.0, 170.0]),
  ...cue('sfx_chime.mp3', 0.35, 0.7, [168.0]),

  // SC05 — enterprise execution
  ...cue('sfx_whoosh.mp3', 0.3, 0.6, [171.0]),
  ...cue('sfx_tick.mp3', 0.3, 0.15, [178.0, 184.0, 190.0, 196.0]),
  ...cue('sfx_chime.mp3', 0.4, 1.5, [200.0]),
  ...cue('sfx_pop.mp3', 0.35, 0.3, [205.0]),

  // SC06 — academy outro
  ...cue('sfx_chime.mp3', 0.4, 2.0, [START.s6 + 1.0]),
  ...cue('sfx_chime.mp3', 0.35, 1.5, [START.s6 + 8.0]),
];

export const Sfx: React.FC = () => (
  <div style={{display: 'contents'}}>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.round(c.at * FPS)} durationInFrames={Math.ceil(c.dur * FPS) + 2} layout="none">
        <Audio src={staticFile(c.file)} volume={c.vol} />
      </Sequence>
    ))}
  </div>
);
