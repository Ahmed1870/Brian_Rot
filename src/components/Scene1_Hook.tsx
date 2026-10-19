import React from 'react';
import {C} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, easeOut, lerp, ramp, sp, SP} from '../lib/anim';
import {IsoBoxes, IsoFloor} from '../lib/IsoView';
import {isoP} from '../lib/iso';
import {ISO1, MEAN_H, s1Boxes} from '../lib/scenegeo';
import {Burst, Ring, SceneShell, glass} from '../lib/ui';
import {SCENES} from '../theme';

const HIT = 120;

/** Frames 0-348: "ملايين أم إفلاس؟" -> 5 equal cards -> the red billionaire lands -> the Mean lies. */
export const Scene1_Hook: React.FC<{f: number}> = ({f}) => {
  const o = ISO1;
  const boxes = s1Boxes(f);
  const intro = sp(f, SP.pop, 0);
  const introOut = ramp(f, 76, 100);
  const meanVal = f < HIT ? 50 : lerp(50, 100040, easeOut(ramp(f, HIT, HIT + 55)));
  const meanTxt = f < HIT ? '50K' : meanVal >= 1000 ? `${(meanVal / 1000).toFixed(1)}M+` : `${Math.round(meanVal)}K`;
  const lie = ramp(f, HIT + 40, HIT + 60);
  const truth = ramp(f, 206, 224);
  const trick = ramp(f, 250, 268);
  const label = (x: number, y: number, z: number, h: number) => isoP(x, h, z, o);
  return (
    <SceneShell dur={SCENES.s1.dur} fadeIn={0} fadeOut={12}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <IsoFloor o={o} x0={-150} x1={800} z0={-450} z1={300} step={100} op={ramp(f, 40, 70)} />
        <IsoBoxes boxes={boxes} o={o} />
        {/* the Mean line the billionaire creates */}
        {f >= 150 && f < 206 ? (() => {
          const a = isoP(-70, MEAN_H, 60, o), b = isoP(760, MEAN_H, 60, o);
          return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.coral} strokeWidth={4} strokeDasharray="14 10" opacity={ramp(f, 150, 170) * (1 - ramp(f, 196, 206))} />;
        })() : null}
        <Ring f={f} start={HIT} x={isoP(370, 0, -180, o)[0]} y={isoP(370, 0, -180, o)[1]} max={420} life={26} color={C.coral} w={8} />
        <Ring f={f} start={HIT + 4} x={isoP(370, 0, -180, o)[0]} y={isoP(370, 0, -180, o)[1]} max={300} life={22} color={C.text} w={4} />
        <Burst f={f} start={0} x={540} y={760} count={46} speed={34} life={40} size={6} gravity={0.2} seed={7} colors={[C.yellow, C.coral, C.text]} />
        <Burst f={f} start={HIT} x={isoP(370, 0, -180, o)[0]} y={isoP(370, 0, -180, o)[1]} count={36} speed={26} life={34} size={5} gravity={0.25} seed={11} colors={[C.coral, '#FCA5A5', C.text]} />
      </svg>

      {/* kinetic hook */}
      {f < 104 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', direction: 'rtl', fontFamily: CAIRO, fontWeight: 900, fontSize: 170, lineHeight: 1.1,
          opacity: (1 - introOut) * clamp(intro * 3), transform: `scale(${(0.3 + 0.7 * Math.min(1.12, intro)) * (1 + introOut * 1.4)})`}}>
          <span style={{color: C.yellow}}>ملايين</span> <span style={{color: C.text}}>أم</span><br /><span style={{color: C.coral}}>إفلاس؟</span>
        </div>
      ) : null}

      {/* the lying Mean meter */}
      <div style={{position: 'absolute', left: 90, right: 90, top: 150, height: 190, ...glass({r: 34, glow: 30, tint: 'rgba(239,68,68,0.20)'}), borderColor: f >= HIT ? C.coral : 'rgba(248,250,252,0.5)',
        opacity: ramp(f, 56, 76), transform: `translateX(${f >= HIT && f < HIT + 14 ? Math.sin(f * 3) * 8 : 0}px)`, direction: 'rtl'}}>
        <div style={{position: 'absolute', right: 34, top: 16, fontFamily: CAIRO, fontWeight: 700, fontSize: 34, color: C.dim}}>المتوسط الحسابي · Mean</div>
        <div style={{position: 'absolute', left: 34, top: 36, fontFamily: CAIRO, fontWeight: 900, fontSize: 100, color: f >= HIT ? C.coral : C.text, direction: 'ltr', textShadow: f >= HIT ? '0 0 34px rgba(239,68,68,.8)' : 'none'}}>
          {meanTxt}<span style={{fontSize: 44, marginLeft: 10}}> EGP</span>
        </div>
        {lie > 0 ? <div style={{position: 'absolute', right: 34, bottom: 14, fontFamily: CAIRO, fontWeight: 900, fontSize: 36, color: C.coral, opacity: lie}}>كلهم ملاك ملايين؟</div> : null}
      </div>

      {/* labels */}
      {f >= 140 ? (() => {
        const p = label(370, 0, -180, 700);
        return <div style={{position: 'absolute', left: p[0] - 120, top: p[1] - 70, width: 240, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900, fontSize: 40, color: C.text, opacity: ramp(f, 150, 166), direction: 'rtl'}}>
          <span style={{padding: '6px 22px', borderRadius: 999, background: C.coral}}>مليارير · 600M</span></div>;
      })() : null}
      {[0, 1, 2, 3, 4].map((i) => {
        const gp = isoP(i * 150 + 50, MEAN_H, 50, o);
        const bp = isoP(i * 150 + 50, 110, 50, o);
        return (
          <React.Fragment key={i}>
            {f >= 160 && f < 200 ? <div style={{position: 'absolute', left: gp[0] - 80, top: gp[1] - 56, width: 160, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900, fontSize: 34, color: C.coral, opacity: ramp(f, 160, 176) * (1 - ramp(f, 190, 200))}}>ملايين؟</div> : null}
            {truth > 0 ? (
              <div style={{position: 'absolute', left: bp[0] - 70, top: bp[1] - 62 - 20 * (1 - truth), width: 140, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900, fontSize: 36, color: C.text, opacity: truth}}>50K</div>
            ) : null}
            {f >= 216 + i * 5 ? (() => {
              const s = sp(f, SP.pop, 216 + i * 5);
              return <div style={{position: 'absolute', left: bp[0] - 62, top: bp[1] + 6, width: 124, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900, fontSize: 30, color: C.coral, border: `3px solid ${C.coral}`, borderRadius: 10,
                padding: '0 6px', transform: `rotate(-9deg) scale(${Math.max(0, s)})`, opacity: clamp(s * 3), background: 'rgba(15,23,42,0.75)'}}>مفلس</div>;
            })() : null}
          </React.Fragment>
        );
      })}

      {/* the trick: profits sink */}
      {trick > 0 ? (
        <div style={{position: 'absolute', left: 90, right: 90, top: 1280, height: 250, ...glass({r: 30, glow: 24, tint: 'rgba(239,68,68,0.16)'}), borderColor: C.coral, opacity: trick, transform: `translateY(${(1 - trick) * 50}px)`, direction: 'rtl'}}>
          <div style={{position: 'absolute', right: 30, top: 14, fontFamily: CAIRO, fontWeight: 900, fontSize: 48, color: C.coral}}>الخدعة</div>
          <div style={{position: 'absolute', right: 30, top: 80, fontFamily: CAIRO, fontWeight: 700, fontSize: 30, color: C.dim}}>أرباح الشركة</div>
          <svg viewBox="0 0 500 200" width={500} height={200} style={{position: 'absolute', left: 20, top: 30}}>
            <polyline points="10,30 90,50 160,40 230,95 300,120 370,150 440,185 490,196" fill="none" stroke={C.coral} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"
              pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - easeOut(ramp(f, 262, 310))} />
            <polygon points="468,166 498,198 456,204" fill={C.coral} opacity={ramp(f, 300, 312)} />
          </svg>
        </div>
      ) : null}
    </SceneShell>
  );
};
