import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Scene1, Scene2, Scene3, Scene4, Scene5, Scene6 } from "./scenes";
import { SCENES } from "./sync";
import { C, VOICE_FILE } from "./theme";

const COMPS = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: C.slate }}>
    <Audio src={staticFile(VOICE_FILE)} />
    {SCENES.map((s, i) => {
      const Comp = COMPS[i];
      return (
        <Sequence key={i} from={s.start} durationInFrames={s.end - s.start}>
          <Comp />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
