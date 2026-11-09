// Sound effects for Lesson 34 — UNIQUE & SORT Engine.
// 6 SFX files enforced. Map:
//   unique_extraction_pop → pop | sorting_shift_chime → whoosh
//   external_sort_lock → pop | formula_combination_sound → pop
//   dropdown_autosync_snap → key | rare_values_chime → chime
//   multilevel_sort_lock → pop | enterprise_seal → chime
//   academic_outro → chime
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START} from './theme';

type Cue = {at: number; file: string; vol: number; dur: number};
const cue = (file: string, vol: number, dur: number, times: number[]): Cue[] => times.map((at) => ({at, file, vol, dur}));

const CUES: Cue[] = [
  ...cue('sfx_whoosh.mp3', 0.28, 0.75, [START.s2, START.s3, START.s4, START.s5, START.s6].map((s) => s - 0.25)),
  // SC01: unique extraction pop
  ...cue('sfx_pop.mp3', 0.4, 0.3, [6.0]),
  ...cue('sfx_pop.mp3', 0.3, 0.3, [3.0, 10.0]),
  // SC02: sorting shift + external sort lock
  ...cue('sfx_whoosh.mp3', 0.32, 0.5, [45.0]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [60.0]),
  // SC03: formula combination + dropdown autosync
  ...cue('sfx_pop.mp3', 0.4, 0.3, [90.0]),
  ...cue('sfx_key.mp3', 0.4, 0.2, [110.0]),
  // SC04: rare values chime + multilevel sort lock
  ...cue('sfx_chime.mp3', 0.4, 1.5, [135.0]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [145.0]),
  // SC05: enterprise seal
  ...cue('sfx_whoosh.mp3', 0.3, 0.5, [175.0]),
  ...cue('sfx_chime.mp3', 0.4, 1.5, [190.0]),
  // SC06: academic outro
  ...cue('sfx_chime.mp3', 0.3, 1.5, [START.s6 + 1.0]),
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
