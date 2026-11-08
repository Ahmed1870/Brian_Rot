// Sound effects for Lesson 26 — Unpivoting & Data Reshaping.
// 6 SFX files enforced. Map:
//   structural_split → whoosh | power_query_open → chime
//   unpivot_collapse_snap → pop | matrix_flatten → whoosh
//   vector_wrap_snap → pop | reshaping_pipeline_flow → whoosh
//   flat_table_matrix_lock → chime | enterprise_unpivot_seal → chime
//   academic_outro → chime
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START} from './theme';

type Cue = {at: number; file: string; vol: number; dur: number};
const cue = (file: string, vol: number, dur: number, times: number[]): Cue[] => times.map((at) => ({at, file, vol, dur}));

const CUES: Cue[] = [
  ...cue('sfx_whoosh.mp3', 0.28, 0.75, [START.s2, START.s3, START.s4, START.s5, START.s6].map((s) => s - 0.25)),
  // SC01: structural split
  ...cue('sfx_whoosh.mp3', 0.32, 0.6, [6.0]),
  ...cue('sfx_pop.mp3', 0.3, 0.3, [3.0, 10.0]),
  // SC02: power query open + unpivot collapse
  ...cue('sfx_chime.mp3', 0.35, 1.0, [42.0]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [55.0]),
  // SC03: matrix flatten + vector wrap
  ...cue('sfx_whoosh.mp3', 0.32, 0.5, [90.0]),
  ...cue('sfx_pop.mp3', 0.4, 0.3, [100.0]),
  // SC04: reshaping pipeline flow + flat table lock
  ...cue('sfx_whoosh.mp3', 0.32, 0.6, [135.0]),
  ...cue('sfx_chime.mp3', 0.4, 1.5, [145.0]),
  // SC05: enterprise unpivot seal
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
