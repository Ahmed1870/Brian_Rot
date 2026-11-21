import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {SCENES, FADE} from './cues';
import type {Cues} from './cues';
import {VO_FILE, TOTAL_FRAMES} from './theme';
import {pop} from './lib/anim';
import {FontStyles} from './lib/fonts';
import {Scene1, CUES1} from './scenes/S1';
import {Scene2, CUES2} from './scenes/S2';
import {Scene3, CUES3} from './scenes/S3';
import {Scene4, CUES4} from './scenes/S4';
import {Scene5, CUES5} from './scenes/S5';
import {Scene6, CUES6} from './scenes/S6';
import {Scene7, Scene8, CUES7} from './scenes/S7';
import {useCurrentFrame} from 'remotion';
import type {ReactNode} from 'react';

const ALL: Cues[] = [CUES1, CUES2, CUES3, CUES4, CUES5, CUES6, CUES7];
const SILENT_FROM = SCENES[7].from; // final 5 s: no sound effects at all
const uniq = (xs: number[]) => Array.from(new Set(xs)).filter((x) => x < SILENT_FROM).sort((a, b) => a - b);
const CLICKS = uniq(ALL.flatMap((c) => c.click));
const POPS = uniq(ALL.flatMap((c) => c.pop));
const KEYS = uniq(ALL.flatMap((c) => c.key));

const Fade = ({children}: {children: ReactNode}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: pop(f, 0, FADE)}}>{children}</div>;
};

const Sfx = ({frames, file, vol}: {frames: number[]; file: string; vol: number}) => (
  <div style={{display: 'contents'}}>
    {frames.map((f) => (
      <Sequence key={f} from={f} durationInFrames={20}>
        <Audio src={staticFile(file)} volume={vol} />
      </Sequence>
    ))}
  </div>
);

export const Video = () => {
  const comps: Array<(p: {from: number}) => JSX.Element> = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, () => <Scene8 />];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <FontStyles />
      {SCENES.map((s, i) => {
        const Comp = comps[i];
        const dur = s.to - s.from + (i < SCENES.length - 1 ? FADE : 0);
        return (
          <Sequence key={s.key} from={s.from} durationInFrames={dur}>
            {i === 0 ? <Comp from={s.from} /> : <Fade><Comp from={s.from} /></Fade>}
          </Sequence>
        );
      })}
      <Audio src={staticFile(VO_FILE)} />
      <Sfx frames={CLICKS} file="sfx_click.wav" vol={0.22} />
      <Sfx frames={POPS} file="sfx_pop.wav" vol={0.16} />
      <Sfx frames={KEYS} file="sfx_key.wav" vol={0.2} />
    </AbsoluteFill>
  );
};

export const _total = TOTAL_FRAMES;
