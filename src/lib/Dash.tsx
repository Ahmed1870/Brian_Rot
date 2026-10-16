import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, T} from '../theme';
import {MONO, ORB} from '../fonts';
import {clamp, easeOut, fmt, hash, ramp, smoothPath, sp, SP} from './anim';
import {glass} from './ui';

const TAU = Math.PI * 2;
const W = 940;

const Layer: React.FC<{z: number; cam: number; top: number; h: number; appear: number; children: React.ReactNode}> = ({z, cam, top, h, appear, children}) => {
  const tz = z + cam;
  const op = clamp(appear * 3) * (1 - ramp(tz, 200, 520));
  if (op < 0.01) return null;
  return (
    <div style={{position: 'absolute', left: 70, top, width: W, height: h, opacity: op, transformStyle: 'preserve-3d',
      transform: `translateZ(${tz}px) scale(${0.7 + 0.3 * Math.min(1.06, appear)})`}}>
      {children}
    </div>
  );
};

const box = (x: number, y: number, w: number, h: number, extra?: React.CSSProperties): React.CSSProperties => ({
  position: 'absolute', left: x, top: y, width: w, height: h,
  ...glass({r: 22, glow: 26, tint: 'rgba(0,240,255,0.16)'}), borderColor: 'rgba(0,240,255,0.55)', ...extra,
});
const tag: React.CSSProperties = {fontFamily: MONO, fontSize: 22, color: C.dim, letterSpacing: 2};

/** The holographic dashboard in four depth layers + a green metrics wall. cam pushes the world toward the viewer. */
export const Dash: React.FC<{cam: number}> = ({cam}) => {
  const f = useCurrentFrame();
  const t0 = T.s3 + 30; // layers start forming once the blocks collapse
  const a = (d: number) => sp(f, SP.bouncy, t0 + d);
  const orbit = ramp(f, T.s3, T.s4 + 200);
  const ry = -10 + Math.sin(f / 70) * 6 - cam * 0.004;
  const rx = 7 + Math.cos(f / 90) * 3;

  // liquid area chart: two waves breathing in perfect balance
  const CW = 900, CH = 280;
  const draw = easeOut(ramp(f, t0 + 18, t0 + 80));
  const ys = (k: number, ph: number) => Array.from({length: 40}, (_, i) => {
    const u = i / 39;
    const base = 0.35 + 0.5 * u * u + 0.07 * Math.sin(u * 9 + f * 0.05 + ph) + 0.04 * Math.sin(u * 17 - f * 0.08);
    return {x: 20 + u * (CW - 40), y: CH - 20 - clamp(base * k) * (CH - 50)};
  });
  const L1 = ys(1, 0), L2 = ys(0.72, 2);
  const d1 = smoothPath(L1), d2 = smoothPath(L2);
  const area = `${d1} L${L1[39].x} ${CH} L${L1[0].x} ${CH} Z`;

  const kpi = (x: number, label: string, v: string, delta: string, col: string, d: number) => (
    <div style={box(x, 0, 290, 210, {opacity: clamp(a(d) * 3), transform: `translateY(${(1 - Math.min(1, a(d))) * 50}px)`})}>
      <div style={{...tag, position: 'absolute', left: 24, top: 18}}>{label}</div>
      <div style={{position: 'absolute', left: 24, top: 62, fontFamily: ORB, fontWeight: 700, fontSize: 52, color: '#fff', textShadow: `0 0 18px ${col}`}}>{v}</div>
      <div style={{position: 'absolute', left: 24, bottom: 20, fontFamily: ORB, fontWeight: 700, fontSize: 28, color: col}}>{delta}</div>
    </div>
  );
  const tiles = [
    ['REVENUE', '+38%'], ['COST', '-18%'], ['ROI', '4.2x'], ['CONVERSION', '+27%'], ['CHURN', '-12%'], ['SPEED', '3.1x'],
  ];
  const lit = (i: number) => easeOut(ramp(f, T.s4 + 118 + i * 11, T.s4 + 138 + i * 11));
  const rev = Math.round(2480 * easeOut(ramp(f, t0 + 10, t0 + 90)));

  return (
    <AbsoluteFill style={{perspective: 1400, perspectiveOrigin: '50% 46%'}}>
      <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg)`}}>
        {/* L0 — KPI cards (front) */}
        <Layer z={0} cam={cam} top={330} h={210} appear={a(0)}>
          {kpi(0, 'REVENUE / USD', '$' + fmt(rev) + 'K', '+38.2%', C.green, 0)}
          {kpi(325, 'NET PROFIT', '$' + fmt(rev * 0.34) + 'K', '+24.7%', C.gold, 8)}
          {kpi(650, 'DECISIONS', fmt(1840 * easeOut(ramp(f, t0 + 20, t0 + 100))), 'LIVE', C.cyan, 16)}
        </Layer>
        {/* L1 — liquid charts */}
        <Layer z={-300} cam={cam} top={580} h={760} appear={a(10)}>
          <div style={box(0, 0, W, 400)}>
            <div style={{...tag, position: 'absolute', left: 26, top: 16}}>FLUID INSIGHT STREAM</div>
            <svg viewBox={`0 0 ${CW} ${CH}`} width={W - 40} height={CH} style={{position: 'absolute', left: 20, top: 90}}>
              <defs>
                <linearGradient id="liq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.cyan} stopOpacity=".5" /><stop offset="1" stopColor={C.cyan} stopOpacity="0" /></linearGradient>
                <clipPath id="liqClip"><rect x={0} y={0} width={CW * draw} height={CH} /></clipPath>
              </defs>
              <g clipPath="url(#liqClip)">
                <path d={area} fill="url(#liq)" />
                <path d={d2} fill="none" stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
                <path d={d1} fill="none" stroke={C.cyan} strokeWidth={5} strokeLinecap="round" style={{filter: 'drop-shadow(0 0 8px #00F0FF)'}} />
              </g>
            </svg>
          </div>
          <div style={box(0, 430, 450, 330)}>
            <div style={{...tag, position: 'absolute', left: 26, top: 16}}>SEGMENTS</div>
            <svg viewBox="0 0 450 330" width={450} height={330} style={{position: 'absolute', left: 0, top: 0}}>
              {[0.46, 0.3, 0.24].map((v, i) => {
                const R = 84 - i * 24;
                const C2 = TAU * R;
                return <circle key={i} cx={225} cy={185} r={R} fill="none" stroke={[C.cyan, C.gold, C.green][i]} strokeWidth={18} strokeLinecap="round"
                  strokeDasharray={`${C2 * v * easeOut(ramp(f, t0 + 40 + i * 8, t0 + 100))} ${C2}`} transform="rotate(-90 225 185)" />;
              })}
            </svg>
          </div>
          <div style={box(490, 430, 450, 330)}>
            <div style={{...tag, position: 'absolute', left: 26, top: 16}}>CHANNELS</div>
            <svg viewBox="0 0 450 330" width={450} height={330} style={{position: 'absolute', left: 0, top: 0}}>
              {[0.5, 0.8, 0.62, 0.95, 0.72, 0.88].map((v, i) => {
                const h = v * 220 * Math.min(1.08, sp(f, SP.bouncy, t0 + 40 + i * 5)) * (1 + 0.04 * Math.sin(f * 0.1 + i));
                return <rect key={i} x={30 + i * 66} y={290 - h} width={42} height={Math.max(0, h)} rx={8} fill={i % 2 ? C.cyan : C.green} opacity={0.9} />;
              })}
            </svg>
          </div>
        </Layer>
        {/* L2 — smart notifications */}
        <Layer z={-600} cam={cam} top={420} h={760} appear={a(26)}>
          {[['REVENUE SPIKE DETECTED', '+38% vs last month', C.green, 0, 20], ['LOST PROFIT RECOVERED', '$18.2K saved from returns', C.gold, 250, 360], ['DISCOUNT LEAK CLOSED', 'margin +6.4 pts', C.cyan, 60, 700]].map(([h, s, c, x, y], i) => (
            <div key={i} style={box(x as number, y as number, 680, 130, {borderColor: c as string, boxShadow: `0 0 30px ${c}`})}>
              <div style={{position: 'absolute', left: 26, top: 22, width: 16, height: 16, borderRadius: '50%', background: c as string, boxShadow: `0 0 14px ${c}`}} />
              <div style={{position: 'absolute', left: 62, top: 14, fontFamily: ORB, fontWeight: 700, fontSize: 30, color: '#fff'}}>{h}</div>
              <div style={{position: 'absolute', left: 62, top: 70, fontFamily: MONO, fontSize: 28, color: c as string}}>{s}</div>
            </div>
          ))}
        </Layer>
        {/* L3 — green metrics wall, revealed as the camera flies through */}
        <Layer z={-1100} cam={cam} top={380} h={1000} appear={ramp(cam, 120, 420)}>
          {tiles.map(([k, v], i) => {
            const x = (i % 2) * 490, y = Math.floor(i / 2) * 340;
            const l = lit(i);
            const col = l > 0.5 ? C.green : C.dim;
            return (
              <div key={i} style={box(x, y, 450, 300, {borderColor: col, boxShadow: l > 0.5 ? `0 0 ${30 + l * 30}px rgba(0,255,156,.65), inset 0 0 40px rgba(0,255,156,.2)` : undefined})}>
                <div style={{...tag, position: 'absolute', left: 28, top: 22, color: col}}>{k}</div>
                <div style={{position: 'absolute', left: 28, top: 90, fontFamily: ORB, fontWeight: 900, fontSize: 84, color: l > 0.5 ? '#fff' : C.dim, textShadow: l > 0.5 ? `0 0 26px ${C.green}` : 'none'}}>{v}</div>
                <div style={{position: 'absolute', left: 28, right: 28, bottom: 26, height: 10, borderRadius: 5, background: 'rgba(255,255,255,.1)'}}>
                  <div style={{width: `${l * 100}%`, height: '100%', borderRadius: 5, background: C.green, boxShadow: `0 0 14px ${C.green}`}} />
                </div>
              </div>
            );
          })}
        </Layer>
      </div>
      {orbit < 0 ? null : null}
    </AbsoluteFill>
  );
};
