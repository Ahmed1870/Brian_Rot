// Sound effects for Lesson 13 — XLOOKUP Architecture & Dynamic Features.
// All cues are absolute seconds on the lesson timeline.
// The system enforces exactly 6 SFX files (click, key, tick, pop, whoosh, chime):
//   bidirectional_sweep → whoosh   | native_catch_chime → chime
//   default_match_snap → pop        | spill_flow → whoosh
//   spill_border_snap → pop         | bottomup_scan → whoosh
//   latest_record_lock → chime      | enterprise_seal → chime
//   academic_outro → chime
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START} from './theme';

type Cue = {at: number; file: string; vol: number; dur: number};
const cue = (file: string, vol: number, dur: number, times: number[]): Cue[] => times.map((at) => ({at, file, vol, dur}));

const CUES: Cue[] = [
  // scene transitions (whoosh 0.25s before each scene start)
  ...cue('sfx_whoosh.mp3', 0.28, 0.75, [START.s2, START.s3, START.s4, START.s5, START.s6].map((s) => s - 0.25)),
  // SC01: bidirectional sweep at 6.0s, formula block pops
  ...cue('sfx_whoosh.mp3', 0.3, 0.75, [6.0]),
  ...cue('sfx_pop.mp3', 0.3, 0.3, [2.5, 5.0, 7.5, 10.0, 12.5, 15.0]),
  // SC02: native catch chime + default match snap
  ...cue('sfx_chime.mp3', 0.4, 1.5, [45.0]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [60.0]),
  // SC03: spill flow + spill border snap
  ...cue('sfx_whoosh.mp3', 0.3, 0.6, [90.0]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [100.0]),
  // SC04: bottom-up scan + latest record lock
  ...cue('sfx_whoosh.mp3', 0.35, 0.7, [135.0]),
  ...cue('sfx_chime.mp3', 0.4, 1.5, [145.0]),
  // SC05: enterprise execution — fast array spill + green seal
  ...cue('sfx_whoosh.mp3', 0.3, 0.5, [180.0]),
  ...cue('sfx_chime.mp3', 0.4, 1.5, [195.0]),
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
