import React from 'react';
import {C, SCENES} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, easeOut, hash, ramp, sp, SP} from '../lib/anim';
import {IsoBoxes, IsoFloor} from '../lib/IsoView';
import {isoP} from '../lib/iso';
import {ISO2B, ISO2T, S2_OUT, s2Crates, s2Mean, s2TopBoxes} from '../lib/scenegeo';
import {Ring, SceneShell, glass} from '../lib/ui';

const T0 = SCENES.s2.from;

const Title: React.FC<{ar: string; en: string; color: string; right?: number}> = ({ar, en, color, right = 30}) => (
  <div style={{position: 'absolute', right, top: 18, textAlign: 'right', direction: 'rtl', fontFamily: CAIRO, lineHeight: 1.15}}>
    <div style={{fontWeight: 900, fontSize: 46, color}}>{ar}</div>
    <div style={{fontWeight: 700, fontSize: 26, color: C.dim, direction: 'ltr', textAlign: 'right'}}>{en}</div>
  </div>
);

/** Frames 336-798: screen splits into Overpricing (one outlier drags the Mean) and Stagnant Inventory. */
export const Scene2_BusinessDamage: React.FC<{f: number}> = ({f}) => {
  const split = sp(f, SP.soft, T0);
  const slide = 1 - Math.min(1, split);
  const flash = Math.max(0, 1 - (f - T0) / 14);
  const mean = s2Mean(f);
  const meanTxt = Math.round(mean / 0.9);
  const mp = (x: number) => isoP(x, mean, 45, ISO2T);
  const outTop = isoP(8 * 130 + 45, S2_OUT * 0.9, 45, ISO2T);
  const spot = ramp(f, 477, 500) * (1 - ramp(f, 640, 660));
  const botOn = ramp(f, 660, 690);
  const a = mp(-60), b = mp(1200);
  return (
    <SceneShell dur={SCENES.s2.dur} fadeIn={10} fadeOut={12}>
      {/* TOP: overpricing */}
      <div style={{position: 'absolute', left: 60, top: 190, width: 960, height: 640, ...glass({r: 40, glow: 26, tint: 'rgba(248,250,252,0.10)'}), borderColor: 'rgba(248,250,252,0.55)',
        transform: `translateY(${slide * 330}px)`, opacity: clamp(split * 3), overflow: 'hidden'}}>
        <Title ar="تسعير مبالغ فيه" en="Overpricing" color={C.coral} />
        <svg viewBox="0 0 960 640" width={960} height={640} style={{position: 'absolute', left: 0, top: 0}} />
      </div>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${slide * 330}px)`, opacity: clamp(split * 3)}}>
        <g>
          <IsoFloor o={ISO2T} x0={-80} x1={1250} z0={-60} z1={160} step={130} op={0.8} />
          <IsoBoxes boxes={s2TopBoxes(f)} o={ISO2T} />
          {f >= 380 ? (
            <g opacity={ramp(f, 380, 396)}>
              <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.coral} strokeWidth={4} strokeDasharray="14 10" />
            </g>
          ) : null}
          {spot > 0 ? <circle cx={outTop[0]} cy={outTop[1] - 20} r={70 + 12 * Math.sin(f / 5)} fill="none" stroke={C.yellow} strokeWidth={5} opacity={spot} /> : null}
          <Ring f={f} start={372} x={isoP(8 * 130 + 45, 0, 45, ISO2T)[0]} y={isoP(8 * 130 + 45, 0, 45, ISO2T)[1]} max={260} life={22} color={C.coral} w={7} />
        </g>
      </svg>
      {f >= 394 ? (
        <div style={{position: 'absolute', left: b[0] - 330, top: b[1] - 78 + slide * 330, width: 330, textAlign: 'right', direction: 'rtl', opacity: ramp(f, 396, 414)}}>
          <span style={{display: 'inline-block', padding: '6px 24px', borderRadius: 999, background: C.coral, fontFamily: CAIRO, fontWeight: 900, fontSize: 36, color: C.text}}>Mean = {meanTxt}K</span>
        </div>
      ) : null}
      {spot > 0 ? (
        <>
          <div style={{position: 'absolute', left: outTop[0] - 120, top: outTop[1] - 170, width: 240, textAlign: 'center', opacity: spot, fontFamily: CAIRO, fontWeight: 900, fontSize: 36, color: C.yellow}}>عميل واحد!</div>
          <div style={{position: 'absolute', left: 90, top: 300, opacity: spot, fontFamily: CAIRO, fontWeight: 900, fontSize: 38, color: C.text, direction: 'rtl'}}>
            <span style={{padding: '8px 26px', borderRadius: 999, border: `3px solid ${C.coral}`, background: 'rgba(15,23,42,.7)'}}>مبيعات ممتازة؟</span>
          </div>
        </>
      ) : null}

      {/* BOTTOM: stagnant inventory */}
      <div style={{position: 'absolute', left: 60, top: 870, width: 960, height: 640, ...glass({r: 40, glow: 26, tint: 'rgba(239,68,68,0.14)'}), borderColor: botOn > 0.3 ? C.coral : 'rgba(248,250,252,0.35)',
        transform: `translateY(${-slide * 330}px)`, opacity: clamp(split * 3) * (0.55 + 0.45 * botOn), overflow: 'hidden'}}>
        <Title ar="مخزون راكد" en="Stagnant Inventory" color={C.coral} />
      </div>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${-slide * 330}px)`, opacity: clamp(split * 3)}}>
        <IsoFloor o={ISO2B} x0={-60} x1={640} z0={-60} z1={420} step={125} op={0.8} />
        <IsoBoxes boxes={s2Crates(f)} o={ISO2B} />
        {f >= 700 ? Array.from({length: 26}, (_, i) => {
          const t = ((f - 700 + hash(i) * 90) % 90) / 90;
          const p = isoP(hash(i * 3) * 600, 70 + 120 * t, hash(i * 5) * 360, ISO2B);
          return <circle key={i} cx={p[0]} cy={p[1]} r={2 + hash(i * 7) * 3} fill="rgba(148,163,184,0.7)" opacity={(1 - t) * ramp(f, 700, 720)} />;
        }) : null}
      </svg>
      {f >= 690 ? ['−45K', '−72K', '−31K', '−58K'].map((t, i) => {
        const u = ((f - 690 - i * 22) % 88) / 88;
        if (f - 690 - i * 22 < 0) return null;
        return <div key={i} style={{position: 'absolute', left: 170 + i * 200, top: 1000 + u * 380 - slide * 330, opacity: Math.sin(Math.PI * u), fontFamily: CAIRO, fontWeight: 900, fontSize: 42, color: C.coral}}>{t}</div>;
      }) : null}
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, height: 4, background: C.text, opacity: flash, transform: `scaleX(${0.2 + flash * 0.8})`}} />
    </SceneShell>
  );
};
