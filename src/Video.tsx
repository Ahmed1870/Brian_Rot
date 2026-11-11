import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import type {ReactNode} from "react";
import {SCENE_START} from "./anchors";
import {Sc1} from "./scenes/Sc1";
import {Sc2} from "./scenes/Sc2";
import {Sc3} from "./scenes/Sc3";
import {Sc4} from "./scenes/Sc4";
import {Sc5} from "./scenes/Sc5";
import {Sc6} from "./scenes/Sc6";
import {C, SFX_FILE, VOICE_FILE} from "./theme";
import {eo, prog} from "./kit";

const SCENES = [Sc1, Sc2, Sc3, Sc4, Sc5, Sc6];

/** Calm 2D scene entrance + dip-to-slate exit (slide / zoom per plan transitions). */
const Shell = ({i, dur, children}: {i: number; dur: number; children: ReactNode}) => {
  const f = useCurrentFrame();
  const k = eo(prog(f, 0, 12));
  const out = i === 5 ? 1 - prog(f, dur - 50, 50) : 1 - prog(f, dur - 6, 6);
  const tx = i === 1 ? (1 - k) * 60 : 0;
  const ty = i === 2 ? (1 - k) * -36 : i === 4 ? (1 - k) * 30 : 0;
  const sc = i === 3 ? 0.97 + 0.03 * k : i === 4 ? 0.98 + 0.02 * k : 1;
  return <div style={{position: "absolute", inset: 0, opacity: (i === 0 ? 1 : k) * out, transform: `translate(${tx}px, ${ty}px) scale(${sc})`}}>{children}</div>;
};

export const Video = () => (
  <AbsoluteFill style={{background: C.slate}}>
    <Audio src={staticFile(VOICE_FILE)} />
    <Audio src={staticFile(SFX_FILE)} />
    {SCENES.map((S, i) => (
      <Sequence key={i} from={SCENE_START[i]} durationInFrames={SCENE_START[i + 1] - SCENE_START[i]}>
        <Shell i={i} dur={SCENE_START[i + 1] - SCENE_START[i]}><S /></Shell>
      </Sequence>
    ))}
  </AbsoluteFill>
);
