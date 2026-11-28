import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT_UI, SFX_FILE, TOTAL_FRAMES, VOICE_FILE } from './theme';
import { SCENES, VOICE_END_FRAME } from './data/scenes';
import { useLessonFonts } from './lib/fonts';
import { Header } from './lib/ui';
import { S01 } from './scenes/S01';
import { S02 } from './scenes/S02';
import { S03 } from './scenes/S03';
import { S04 } from './scenes/S04';
import { S05 } from './scenes/S05';
import { S06 } from './scenes/S06';
import { S07 } from './scenes/S07';
import { S08 } from './scenes/S08';
import { S09 } from './scenes/S09';
import { S10 } from './scenes/S10';
import { Closing } from './scenes/Closing';

const COMPONENTS: React.FC[] = [S01, S02, S03, S04, S05, S06, S07, S08, S09, S10];

export const Lesson: React.FC = () => {
  useLessonFonts();
  const frame = useCurrentFrame();
  let idx = 0;
  SCENES.forEach((s, i) => { if (frame >= s.startF) idx = i; });
  const inClosing = frame >= VOICE_END_FRAME;
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT_UI }}>
      <style>{'*{box-sizing:border-box}'}</style>
      <Audio src={staticFile(VOICE_FILE)} />
      <Audio src={staticFile(SFX_FILE)} volume={0.7} />
      {!inClosing && <Header frame={frame} sceneIdx={idx} title={SCENES[idx].title} />}
      {SCENES.map((s, i) => {
        const Comp = COMPONENTS[i];
        return (
          <Sequence key={s.id} from={s.startF} durationInFrames={s.durF}>
            <Comp />
          </Sequence>
        );
      })}
      <Sequence from={VOICE_END_FRAME} durationInFrames={TOTAL_FRAMES - VOICE_END_FRAME}>
        <Closing />
      </Sequence>
    </AbsoluteFill>
  );
};
