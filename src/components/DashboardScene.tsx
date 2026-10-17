import React from 'react';
import {CAIRO} from '../fonts';
import {C, STARTS} from '../theme';
import {clamp, easeOut, lerp, ramp, sp, SP} from '../lib/anim';
import {GlassBadge} from './GlassBadge';

const T0 = STARTS[2];
const TAU = Math.PI * 2;

const Bar: React.FC<{label: string; before: number; after: number; t: number; i: number}> = ({label, before, after, t, i}) => {
  const grow = easeOut(ramp(t, 40 + i * 8, 86 + i * 8));
  const fix = easeOut(ramp(t, 92 + i * 8, 130 + i * 8));
  const v = lerp(before, after, fix) * grow;
  return (
    <div style={{position: 'relative', height: 74, direction: 'rtl', display: 'flex', alignItems: 'center', gap: 20, opacity: easeOut(ramp(t, 34 + i * 8, 52 + i * 8))}}>
      <div style={{width: 190, fontFamily: CAIRO, fontWeight: 800, fontSize: 34, color: C.white}}>{label}</div>
      <div style={{flex: 1, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.10)', overflow: 'hidden'}}>
        <div style={{width: `${v * 3.4}%`, height: '100%', background: fix > 0.6 ? C.cyan : C.yellow, borderRadius: 11}} />
      </div>
      <div style={{width: 96, textAlign: 'left', fontFamily: CAIRO, fontWeight: 900, fontSize: 36, color: fix > 0.6 ? C.cyan : C.yellow, direction: 'ltr'}}>{Math.round(v)}%</div>
    </div>
  );
};

/** Frames 540-780: 2.5D B2B decision dashboard - Profit Leakage / Margin Audit. */
export const DashboardScene: React.FC<{f: number}> = ({f}) => {
  const t = f - T0;
  const draw = easeOut(ramp(t, 10, 70));
  const fix = easeOut(ramp(t, 92, 140));
  // margin gauge: leak shrinks, net margin grows
  const leak = lerp(23, 6, fix);
  const net = lerp(62, 79, fix);
  const cost = 100 - leak - net;
  const R = 285, SW = 62, CIRC = TAU * R;
  const segs = [{v: net, c: C.cyan}, {v: leak, c: C.yellow}, {v: cost, c: 'rgba(255,255,255,0.5)'}];
  let acc = 0;
  const arcs = segs.map((s, i) => {
    const len = (s.v / 100) * CIRC * draw;
    const off = (acc / 100) * CIRC;
    acc += s.v;
    return <circle key={i} cx={0} cy={0} r={R} fill="none" stroke={s.c} strokeWidth={SW} strokeDasharray={`${Math.max(0, len - 4)} ${CIRC}`} strokeDashoffset={-off} transform="rotate(-90)" />;
  });
  const intro = sp(f, SP.soft, T0);
  const tilt = 16 + Math.sin(t / 40) * 2;
  const spin = t * 0.6;
  const line = Array.from({length: 24}, (_, i) => ({x: 20 + (i / 23) * 860, y: 150 - (0.15 + 0.7 * Math.pow(i / 23, 1.4) + 0.05 * Math.sin(i * 1.7)) * 130}));
  const lineD = line.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  return (
    <div style={{position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.08,
        backgroundImage: 'linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(90deg, #00F0FF 1px, transparent 1px)', backgroundSize: '90px 90px'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', transform: `translateY(${(1 - Math.min(1, intro)) * -60}px)`, opacity: clamp(intro * 3)}}>
        <GlassBadge title="مركز إنقاذ المشروعات" sub="analytics.gomaaintelligence.me" subLtr accent={C.cyan} titleSize={56} subSize={28} f={f} radius={52} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900, fontSize: 44, color: C.white, direction: 'rtl', opacity: easeOut(ramp(t, 12, 28))}}>
        تدقيق تسريب الأرباح <span style={{color: C.yellow}}>•</span> Margin Audit
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 380, height: 1200, perspective: 1700, perspectiveOrigin: '50% 30%'}}>
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${tilt * 0.4}deg) rotateY(${Math.sin(t / 55) * 5}deg)`}}>
          {/* gauge plane */}
          <svg viewBox="0 0 1080 1200" width={1080} height={1200} style={{position: 'absolute', left: 0, top: 0, transform: 'translateZ(0px)'}}>
            <g transform="translate(540 420)">
              <circle r={R + 52} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} strokeDasharray="4 14" transform={`rotate(${spin})`} />
              <circle r={R - 52} fill="none" stroke="rgba(0,240,255,0.5)" strokeWidth={2} strokeDasharray="2 10" transform={`rotate(${-spin * 1.4})`} />
              {arcs}
              {Array.from({length: 48}, (_, i) => {
                const a = (i / 48) * TAU;
                return <line key={i} x1={Math.cos(a) * 214} y1={Math.sin(a) * 214} x2={Math.cos(a) * (i % 4 ? 226 : 244)} y2={Math.sin(a) * (i % 4 ? 226 : 244)} stroke="#fff" strokeWidth={i % 4 ? 2 : 4} opacity={0.5} />;
              })}
              {/* portal frame: camera dives into this hollow (180x320 at gauge centre) */}
              <rect x={-96} y={-166} width={192} height={332} fill="none" stroke={C.yellow} strokeWidth={5} />
            </g>
          </svg>
          {/* floating value chips (z offset = 2.5D) */}
          <div style={{position: 'absolute', left: 80, top: 130, transform: 'translateZ(90px)', opacity: easeOut(ramp(t, 24, 44))}}>
            <GlassBadge title={`${Math.round(net)}%`} sub="صافي الهامش" accent={C.cyan} titleSize={54} subSize={26} radius={34} f={f} />
          </div>
          <div style={{position: 'absolute', right: 80, top: 130, transform: 'translateZ(90px)', opacity: easeOut(ramp(t, 30, 50))}}>
            <GlassBadge title={`${Math.round(leak)}%`} sub="تسريب" accent={C.yellow} titleSize={54} subSize={26} radius={34} f={f} titleColor={C.yellow} />
          </div>
          {fix > 0.5 ? (
            <div style={{position: 'absolute', left: 0, right: 0, top: 790, textAlign: 'center', transform: 'translateZ(120px)', opacity: ramp(fix, 0.5, 0.9)}}>
              <div style={{display: 'inline-block', padding: '10px 40px', borderRadius: 999, background: C.yellow, fontFamily: CAIRO, fontWeight: 900, fontSize: 44, color: C.bg}}>+17% أرباح</div>
            </div>
          ) : null}
          {/* leakage rows */}
          <div style={{position: 'absolute', left: 90, right: 90, top: 870, transform: 'translateZ(40px)'}}>
            <Bar label="خصومات" before={18} after={5} t={t} i={0} />
            <Bar label="مرتجعات" before={9} after={3} t={t} i={1} />
            <Bar label="هدر تشغيلي" before={12} after={4} t={t} i={2} />
          </div>
        </div>
      </div>
      <svg viewBox="0 0 900 170" width={900} height={170} style={{position: 'absolute', left: 90, top: 1620}}>
        <path d={lineD} fill="none" stroke={C.cyan} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - easeOut(ramp(t, 100, 170))} />
      </svg>
    </div>
  );
};
