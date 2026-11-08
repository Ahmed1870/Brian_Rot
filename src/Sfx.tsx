// Sound effects for Lesson 11 — VLOOKUP Architecture.
// All cues are absolute seconds on the lesson timeline.
// The system enforces exactly 6 SFX files (click, key, tick, pop, whoosh, chime),
// so every requested effect maps to the closest matching file:
//   vertical_scan_sweep → whoosh   | exact_match_snap → pop
//   wrong_value_alert → key        | barrier_impact → key (thump)
//   function_failure → chime       | insert_column → pop
//   silent_corruption_alert → key  | enterprise_seal → chime
//   academic_outro → chime
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START} from './theme';

type Cue = {at: number; file: string; vol: number; dur: number};
const cue = (file: string, vol: number, dur: number, times: number[]): Cue[] => times.map((at) => ({at, file, vol, dur}));

const CUES: Cue[] = [
  // scene transitions (whoosh 0.25s before each scene start)
  ...cue('sfx_whoosh.mp3', 0.28, 0.75, [START.s2, START.s3, START.s4, START.s5, START.s6].map((s) => s - 0.25)),
  // SC01: vertical scan sweep at 6.0s, formula block pops
  ...cue('sfx_whoosh.mp3', 0.3, 0.75, [6.0]),
  ...cue('sfx_pop.mp3', 0.3, 0.3, [2.5, 5.0, 7.5, 10.0]),
  // SC02: exact match snap (green) then wrong value alert (red)
  ...cue('sfx_pop.mp3', 0.4, 0.3, [46.5]),
  ...cue('sfx_key.mp3', 0.45, 0.2, [54.0]),
  ...cue('sfx_pop.mp3', 0.35, 0.3, [70.0]),
  // SC03: barrier impact + function failure chime (#N/A)
  ...cue('sfx_key.mp3', 0.5, 0.2, [95.0]),
  ...cue('sfx_chime.mp3', 0.4, 1.5, [100.0]),
  // SC04: insert column pop + silent corruption alert
  ...cue('sfx_pop.mp3', 0.4, 0.3, [135.0]),
  ...cue('sfx_key.mp3', 0.5, 0.2, [145.5]),
  ...cue('sfx_key.mp3', 0.4, 0.2, [160.0]),
  // SC05: enterprise execution — fast data merge + green seal
  ...cue('sfx_whoosh.mp3', 0.3, 0.5, [173.0]),
  ...cue('sfx_chime.mp3', 0.4, 1.5, [185.0]),
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
