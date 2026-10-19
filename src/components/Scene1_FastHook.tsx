import React from 'react';
import {C, SCENES} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, easeOut, ramp} from '../lib/anim';
import {SPRINGS, sp} from '../utils/springConfigs';
import {SceneShell} from '../lib/ui';

const W = 900, H = 1100, N = 4, SH = H / N;

/** The editorial warning printed on the sheet (Swiss layout, RTL). */
const SheetContent: React.FC<{f: number}> = ({f}) => {
  const hl = easeOut(ramp(f, 103, 118)); // marker sweep on "كركبة" when the VO says it
  return (
    <div style={{position: 'absolute', inset: 0, direction: 'rtl', color: C.carbon, fontFamily: CAIRO}}>
      <div style={{position: 'absolute', right: 60, left: 60, top: 54, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 30, letterSpacing: 1}}>
        <span>قوالب Excel مجانية</span><span style={{direction: 'ltr'}}>No. 01</span>
      </div>
      <div style={{position: 'absolute', right: 60, left: 60, top: 112, height: 5, background: C.carbon}} />
      <div style={{position: 'absolute', right: 60, top: 150, fontWeight: 900, fontSize: 260, lineHeight: 1.08}}>وقف</div>
      <div style={{position: 'absolute', right: 60, top: 420, fontWeight: 900, fontSize: 260, lineHeight: 1.08}}>
        <span style={{position: 'relative', display: 'inline-block'}}>
          <span style={{position: 'absolute', right: 0, bottom: 40, height: 120, width: `${hl * 100}%`, background: C.yellow, zIndex: 0, transform: 'rotate(-1.5deg)'}} />
          <span style={{position: 'relative', zIndex: 1}}>كركبة</span>
        </span>
      </div>
      <div style={{position: 'absolute', right: 60, top: 745, fontWeight: 900, fontSize: 92, lineHeight: 1.2}}>وحسابات بالبركة!</div>
      <div style={{position: 'absolute', right: 60, left: 60, top: 930, height: 3, background: C.carbon, opacity: 0.5}} />
      <div style={{position: 'absolute', right: 60, left: 60, top: 960, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 28, opacity: 0.8}}>
        <span>مصاريف · تسعير · فواتير</span><span style={{direction: 'ltr', fontWeight: 900}}>Monzoma Digital</span>
      </div>
    </div>
  );
};

const Slice: React.FC<{i: number; f: number; angles: number[]}> = ({i, f, angles}) => {
  const a = i === 0 ? 0 : angles[i - 1];
  const dark = 0.5 * Math.abs(Math.sin((a * Math.PI) / 180));
  return (
    <div style={{position: 'relative', width: W, height: SH, transformStyle: 'preserve-3d'}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', backfaceVisibility: 'hidden', background: C.cream}}>
        <div style={{position: 'absolute', left: 0, top: -i * SH, width: W, height: H, background: `linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 20%), ${C.cream}`}}>
          <SheetContent f={f} />
        </div>
        <div style={{position: 'absolute', inset: 0, background: '#000', opacity: dark}} />
        {i > 0 ? <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 3, background: 'rgba(0,0,0,0.18)'}} /> : null}
      </div>
      <div style={{position: 'absolute', inset: 0, background: C.paperDark, backfaceVisibility: 'hidden', transform: 'rotateX(180deg)'}} />
      {i < N - 1 ? (
        <div style={{position: 'absolute', left: 0, top: SH, width: W, height: SH, transformOrigin: '50% 0%', transformStyle: 'preserve-3d', transform: `rotateX(${angles[i]}deg)`}}>
          <Slice i={i + 1} f={f} angles={angles} />
        </div>
      ) : null}
    </div>
  );
};

/** Frames 0-144: a folded sheet is thrown in, snaps open like an accordion and prints the warning. */
export const Scene1_FastHook: React.FC<{f: number}> = ({f}) => {
  const toss = sp(f, SPRINGS.snap, 0);
  const angles = [1, 2, 3].map((i) => {
    const s = sp(f, SPRINGS.main, 8 + i * 5);
    return (i % 2 ? 1 : -1) * 172 * (1 - Math.min(1.05, s));
  });
  const open = Math.min(1, sp(f, SPRINGS.main, 12));
  const exit = easeOut(ramp(f, 122, 142));
  const thump = f >= 103 ? 0.03 * Math.exp(-(f - 103) / 6) * Math.cos((f - 103) * 0.9) : 0;
  return (
    <SceneShell dur={SCENES.s1.dur} fadeIn={0} fadeOut={10}>
      {/* contact shadow on the studio table */}
      <div style={{position: 'absolute', left: 140, top: 1330, width: 800, height: 90, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.55), rgba(0,0,0,0) 70%)', opacity: open * (1 - exit)}} />
      <div style={{position: 'absolute', inset: 0, perspective: 2800, perspectiveOrigin: '50% 30%'}}>
        <div style={{position: 'absolute', left: 90, top: 250, width: W, height: SH, transformStyle: 'preserve-3d',
          transform: `translateY(${(1 - Math.min(1.1, toss)) * -900 - exit * 1500}px) rotateZ(${(1 - Math.min(1, toss)) * -24 + exit * 9}deg) rotateX(${-6 * (1 - open)}deg) scale(${1 + thump})`}}>
          <Slice i={0} f={f} angles={angles} />
        </div>
      </div>
    </SceneShell>
  );
};
