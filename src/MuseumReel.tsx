import React from 'react';
import {AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {C} from './theme';
import {clamp} from './lib/anim';
import {Act1Pendulum} from './components/Act1Pendulum';
import {Act2Fracture} from './components/Act2Fracture';
import {Act3Lens} from './components/Act3Lens';
import {Act4BrandSeal, DOOR, SEAL} from './components/Act4BrandSeal';
import {STEMS, VOICE} from './utils/audioConfig';
import {SPRINGS} from './utils/springConfigs';

const PLUNGE: [number, number] = [676, 720];
const W0 = {x: 540, y: 960};

/** Loop camera: Act IV layer scales up about the doorway while the Act I layer (frame-0 state) grows inside it. */
const plunge = (f: number) => {
  if (f < PLUNGE[0]) return 1;
  const dur = PLUNGE[1] - PLUNGE[0];
  const p = spring({frame: f - PLUNGE[0], fps: 30, config: SPRINGS.plunge, durationInFrames: dur});
  const end = spring({frame: dur, fps: 30, config: SPRINGS.plunge, durationInFrames: dur});
  return Math.exp(Math.log(1 / DOOR.q) * clamp(p / end, 0, 1.02));
};

const shake = (f: number) => {
  let x = 0, y = 0;
  for (const [t, a] of [[90, 1], [510, 1.3]] as [number, number][]) {
    if (f >= t) {
      const d = Math.exp(-(f - t) / 6) * a;
      x += Math.sin((f - t) * 2.4) * 12 * d;
      y += Math.cos((f - t) * 1.9) * 16 * d;
    }
  }
  return {x, y};
};

export const MuseumReel: React.FC = () => {
  const f = useCurrentFrame();
  const sk = shake(f);
  const S = plunge(f);
  const q = DOOR.q;
  const cam = {x: SEAL.x + (W0.x - SEAL.x) * ((1 / S - q) / (1 - q)), y: SEAL.y + (W0.y - SEAL.y) * ((1 / S - q) / (1 - q))};
  const s1 = S * q;
  const iv = {s: S, tx: 540 + S * (W0.x - cam.x) - S * 540, ty: 960 + S * (W0.y - cam.y) - S * 960};
  const dr = {s: s1, tx: 540 + S * (SEAL.x - cam.x) - s1 * 540, ty: 960 + S * (SEAL.y - cam.y) - s1 * 960};
  const layer = (m: {s: number; tx: number; ty: number}): React.CSSProperties => ({
    position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, overflow: 'hidden', transformOrigin: '0 0', background: C.bg,
    transform: `translate(${m.tx}px, ${m.ty}px) scale(${m.s})`,
  });
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      {/* sound design */}
      <Audio src={staticFile(VOICE.file)} volume={VOICE.volume} />
      {STEMS.map((s) => (
        <Sequence key={s.file} from={s.frame} layout="none"><Audio src={staticFile(s.file)} volume={s.volume} /></Sequence>
      ))}

      <AbsoluteFill style={{transform: `translate(${sk.x}px, ${sk.y}px)`}}>
        {f >= 150 && f < 330 ? <Act2Fracture f={f} /> : null}
        {f >= 330 && f < 510 ? <Act3Lens f={f} /> : null}
        {f < 190 ? <Act1Pendulum f={f} /> : null}
        {f >= 510 && S * q < 1.0 ? <div style={layer(iv)}><Act4BrandSeal f={f} /></div> : null}
        {/* the doorway shows Act I at its frame-0 state, so the last frame == the first frame */}
        {f >= 534 ? <div style={layer(dr)}><Act1Pendulum f={0} text={false} /></div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
