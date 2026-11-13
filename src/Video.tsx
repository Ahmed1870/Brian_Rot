import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, LESSON, LESSONS, UNIT, UNITS, VOICE, DURATION } from "./theme";
import { SC_START } from "./timing";
import { TopBadge } from "./kit";
import { Scene1, Scene2, Scene3 } from "./scenes1";
import { Scene4, Scene5, Scene6 } from "./scenes2";

const SCENES = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];

export const Video: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Audio src={staticFile(VOICE)} />
      {SCENES.map((S, i) => {
        const from = SC_START[i];
        const end = i + 1 < SCENES.length ? SC_START[i + 1] : DURATION;
        return (
          <Sequence key={i} from={from} durationInFrames={end - from}>
            <S />
          </Sequence>
        );
      })}
      {f < SC_START[5] + 10 ? <TopBadge lesson={LESSON} lessons={LESSONS} unit={UNIT} units={UNITS} title="Linear Regression & Trend Forecasting Engine" f={f} a={20} b={SC_START[5] + 6} /> : null}
    </AbsoluteFill>
  );
};
