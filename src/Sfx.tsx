// Sound effects (synthesized by scripts/make_sfx.py). Absolute seconds on the lesson timeline.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, START} from './theme';

type Cue = {at: number; file: string; vol: number; dur: number};
const cue = (file: string, vol: number, dur: number, times: number[]): Cue[] => times.map((at) => ({at, file, vol, dur}));

const CUES: Cue[] = [
  // scene transitions
  ...cue('sfx_whoosh.mp3', 0.28, 0.75, [START.s2, START.s3, START.s4, START.s5, START.s6].map((s) => s - 0.25)),
  // Scene 1: Ctrl+F1 collapse/expand, then the four region frames
  ...cue('sfx_key.mp3', 0.4, 0.2, [10.6, 11.0, 14.6, 15.0]),
  ...cue('sfx_pop.mp3', 0.35, 0.3, [22.77, 24.18, 27.8, 30.85]),
  // Scene 2: Alt, 1, 2 key tips
  ...cue('sfx_key.mp3', 0.4, 0.2, [67.4, 68.34, 70.16]),
  // Scene 3: Name Box typing, Ctrl+Shift+U
  ...cue('sfx_tick.mp3', 0.3, 0.1, [0, 1, 2, 3, 4, 5, 6, 7].map((i) => 93.8 + i * 0.1)),
  ...cue('sfx_key.mp3', 0.4, 0.2, [106.0, 106.15, 106.3]),
  // Scene 4: Alt, F, T
  ...cue('sfx_key.mp3', 0.4, 0.2, [146.2, 146.6, 147.0]),
  // Scene 5: Ctrl+Down, Ctrl+Home, Alt+2, Alt+1, seal
  ...cue('sfx_key.mp3', 0.4, 0.2, [173.4, 175.0, 175.8, 178.66]),
  ...cue('sfx_chime.mp3', 0.35, 1.5, [187.2]),
  // Scene 6: end card
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
