// Sound effects for Lesson 15 — Dynamic Arrays & Spill Engine.
// 6 SFX files enforced by the system. Map:
//   dynamic_array_spill → whoosh   | spill_border_snap → pop
//   array_expansion_chime → chime  | spill_blocked_alert → key
//   spill_clearance_snap → pop     | implicit_intersection_snap → key
//   array_unleash_chime → chime    | enterprise_seal → chime
//   academic_outro → chime
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START} from './theme';

type Cue = {at: number; file: string; vol: number; dur: number};
const cue = (file: string, vol: number, dur: number, times: number[]): Cue[] => times.map((at) => ({at, file, vol, dur}));

const CUES: Cue[] = [
  ...cue('sfx_whoosh.mp3', 0.28, 0.75, [START.s2, START.s3, START.s4, START.s5, START.s6].map((s) => s - 0.25)),
  // SC01: liquid spill flow
  ...cue('sfx_whoosh.mp3', 0.32, 0.7, [6.0]),
  ...cue('sfx_pop.mp3', 0.35, 0.3, [3.0, 10.0]),
  // SC02: spill border snap + array expansion chime
  ...cue('sfx_pop.mp3', 0.4, 0.3, [45.0]),
  ...cue('sfx_chime.mp3', 0.4, 1.5, [70.0]),
  // SC03: spill blocked alert + clearance snap
  ...cue('sfx_key.mp3', 0.45, 0.2, [90.0]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [110.0]),
  // SC04: implicit intersection snap + array unleash chime
  ...cue('sfx_key.mp3', 0.45, 0.2, [135.0]),
  ...cue('sfx_chime.mp3', 0.4, 1.5, [145.0]),
  // SC05: enterprise dynamic array seal
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
