// Sound effects for Lesson 27 — Data Merge & Linking.
// 6 SFX files enforced. Map:
//   matrix_stack_snap → pop      | append_queries_sound → whoosh
//   folder_refresh_snap → pop     | merge_join_chime → chime
//   datamodel_relationship_lock → key | tool_switch_chime → key
//   engine_synergy_snap → pop    | enterprise_integration_seal → chime
//   academic_outro → chime
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START} from './theme';

type Cue = {at: number; file: string; vol: number; dur: number};
const cue = (file: string, vol: number, dur: number, times: number[]): Cue[] => times.map((at) => ({at, file, vol, dur}));

const CUES: Cue[] = [
  ...cue('sfx_whoosh.mp3', 0.28, 0.75, [START.s2, START.s3, START.s4, START.s5, START.s6].map((s) => s - 0.25)),
  // SC01: matrix stack snap (VSTACK + HSTACK)
  ...cue('sfx_pop.mp3', 0.4, 0.3, [6.0, 18.0]),
  ...cue('sfx_pop.mp3', 0.3, 0.3, [3.0, 10.0]),
  // SC02: append queries + folder refresh
  ...cue('sfx_whoosh.mp3', 0.35, 0.5, [45.0]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [65.0]),
  // SC03: merge join + datamodel lock
  ...cue('sfx_chime.mp3', 0.4, 1.5, [90.0]),
  ...cue('sfx_key.mp3', 0.45, 0.2, [110.0]),
  // SC04: tool switch + engine synergy
  ...cue('sfx_key.mp3', 0.4, 0.2, [135.0]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [145.0]),
  // SC05: enterprise integration seal
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
