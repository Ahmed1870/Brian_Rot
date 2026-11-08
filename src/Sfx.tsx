// Sound effects for Lesson 17 — UNIQUE, SORT, SORTBY.
// 6 SFX files enforced by the system. Map:
//   deduplication_laser → whoosh | reordering_cascade → whoosh
//   master_list_lock → chime     | multi_axis_alignment → key
//   custom_sort_snap → pop      | static_break → key
//   adaptive_spill_chime → chime | enterprise_sort_seal → chime
//   academic_outro → chime
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START} from './theme';

type Cue = {at: number; file: string; vol: number; dur: number};
const cue = (file: string, vol: number, dur: number, times: number[]): Cue[] => times.map((at) => ({at, file, vol, dur}));

const CUES: Cue[] = [
  ...cue('sfx_whoosh.mp3', 0.28, 0.75, [START.s2, START.s3, START.s4, START.s5, START.s6].map((s) => s - 0.25)),
  // SC01: deduplication laser sweep
  ...cue('sfx_whoosh.mp3', 0.32, 0.7, [6.0]),
  ...cue('sfx_pop.mp3', 0.35, 0.3, [3.0, 8.0, 12.0]),
  // SC02: reordering cascade + master list lock
  ...cue('sfx_whoosh.mp3', 0.3, 0.6, [45.0]),
  ...cue('sfx_chime.mp3', 0.4, 1.5, [70.0]),
  // SC03: multi-axis alignment + custom sort snap
  ...cue('sfx_key.mp3', 0.4, 0.2, [90.0]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [100.0]),
  // SC04: static break + adaptive spill chime
  ...cue('sfx_key.mp3', 0.45, 0.2, [135.0]),
  ...cue('sfx_chime.mp3', 0.4, 1.5, [145.0]),
  // SC05: enterprise sort seal
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
