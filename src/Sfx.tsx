// Sound effects for Lesson 25 — Formula Auditing.
// 6 SFX files enforced. Map:
//   vector_arrow_swoosh → whoosh | evaluate_step_click → key
//   watch_window_dock_snap → pop | error_diagnostic_alert → key
//   safe_handling_lock → chime | circular_loop_alert → key
//   clear_arrows_sweep → whoosh | enterprise_diagnostics_seal → chime
//   academic_outro → chime
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START} from './theme';

type Cue = {at: number; file: string; vol: number; dur: number};
const cue = (file: string, vol: number, dur: number, times: number[]): Cue[] => times.map((at) => ({at, file, vol, dur}));

const CUES: Cue[] = [
  ...cue('sfx_whoosh.mp3', 0.28, 0.75, [START.s2, START.s3, START.s4, START.s5, START.s6].map((s) => s - 0.25)),
  // SC01: vector arrow swoosh
  ...cue('sfx_whoosh.mp3', 0.32, 0.6, [6.0]),
  ...cue('sfx_whoosh.mp3', 0.32, 0.6, [18.0]),
  ...cue('sfx_pop.mp3', 0.3, 0.3, [3.0, 10.0]),
  // SC02: evaluate step clicks + watch window dock
  ...cue('sfx_key.mp3', 0.4, 0.2, [45.0, 48.0, 51.0, 54.0]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [65.0]),
  // SC03: error diagnostic + safe handling lock
  ...cue('sfx_key.mp3', 0.45, 0.2, [90.0]),
  ...cue('sfx_chime.mp3', 0.4, 1.5, [110.0]),
  // SC04: circular loop alert + clear arrows sweep
  ...cue('sfx_key.mp3', 0.45, 0.2, [135.0]),
  ...cue('sfx_whoosh.mp3', 0.35, 0.6, [145.0]),
  // SC05: enterprise diagnostics seal
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
