import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {C, VOICE_FILE} from "./theme";
import {SCENE_START, SCENE_LEN} from "./sync";
import {Backdrop, Move} from "./kit";
import {Scene1, Scene2, Scene3} from "./scenes_a";
import {Scene4, Scene5, Scene6} from "./scenes_b";
import {MUSIC_FADE_AT, MUSIC_FILE, MUSIC_VOL, SFX} from "./sfx";

type Dir = "x" | "y" | "none" | "cut";
const wrap = (i: number, inD: Dir, outD: Dir, Comp: React.FC<{f: number}>) => {
  const Inner: React.FC = () => {
    const f = useCurrentFrame();
    return (
      <Move f={f} len={SCENE_LEN[i]} inD={inD} outD={outD} n={14}>
        <Comp f={f} />
      </Move>
    );
  };
  return Inner;
};
const S = [
  wrap(0, "cut", "none", Scene1),
  wrap(1, "none", "x", Scene2),
  wrap(2, "x", "y", Scene3),
  wrap(3, "y", "none", Scene4),
  wrap(4, "none", "none", Scene5),
  wrap(5, "none", "cut", Scene6),
];

export const Video: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Backdrop />
    <Audio src={staticFile(VOICE_FILE)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(fr: number) => MUSIC_VOL * Math.max(0, Math.min(1, 1 - (fr - MUSIC_FADE_AT) / 60))} />
    {SFX.map((s, i) => (
      <Sequence key={"sfx" + i} from={s.at} durationInFrames={s.frames}>
        <Audio src={staticFile(s.file)} volume={s.vol} />
      </Sequence>
    ))}
    {S.map((Comp, i) => (
      <Sequence key={i} from={SCENE_START[i]} durationInFrames={SCENE_LEN[i]}>
        <Comp />
      </Sequence>
    ))}
  </AbsoluteFill>
);
export const SCENES = S;
