import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC05 (frames 5100-6300, global 170-210s): a non-correlated scalar subquery is evaluated ONCE and cached (illustrative timings).
const S = 170;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const win = prog(f, t(171.4), 24);
  const nc = pop(f, t(174.6));
  const init = pop(f, t(178.6));
  const run = prog(f, t(180.7), sec(2.8));
  const timeTag = pop(f, t(183.6));
  const cache = pop(f, t(186.4));
  const pass = prog(f, t(189.7), sec(5.1));
  const eff = prog(f, t(195.4), 30);
  const seal = pop(f, t(202.9));
  const rows = Math.round(lerp(0, 100000, pass));
  const glow = 0.5 + 0.5 * Math.sin(f / 7);
  const scroll = (f * 14) % 56;

  return (
    <Stage dur={1200} inFx="zoom" outFx="down">
      <TopBadge text="كواليس المحرك | Single Execution & Caching" from={t(171.4)} to={t(187)} color={C.blue} />

      {/* planner */}
      <Win x={90} y={150} w={840} h={590} title="Query Planner · InitPlan" accent={C.blue} opacity={win}>
        <div dir="ltr" style={{padding: '22px 34px', fontFamily: MONO}}>
          <div style={{transform: `scale(${clamp(nc)})`, opacity: clamp(nc), transformOrigin: 'left center'}}><Chip color={C.blue} style={{fontSize: 24}}>Non-Correlated Subquery</Chip></div>

          <div style={{marginTop: 26, borderRadius: 16, border: `2px solid ${C.blue}`, background: C.deep, padding: '18px 22px', fontSize: 22, color: C.text, opacity: clamp(init), transform: `translateY(${(1 - clamp(init)) * 20}px)`}}>
            <div style={{color: C.blue, fontWeight: 700}}>① evaluate ONCE</div>
            <div style={{marginTop: 8}}>(SELECT AVG(unit_price) FROM products)</div>
            <div style={{marginTop: 14, height: 14, borderRadius: 7, background: C.card, overflow: 'hidden'}}>
              <div style={{width: `${run * 100}%`, height: '100%', background: C.blue}} />
            </div>
            <div style={{marginTop: 10, fontSize: 30, fontWeight: 700, color: C.green, opacity: clamp(timeTag), transform: `scale(${0.9 + 0.1 * clamp(timeTag)})`, transformOrigin: 'left center'}}>0.0002 s ✓</div>
          </div>

          <div style={{display: 'flex', justifyContent: 'center', height: 50, alignItems: 'center', opacity: clamp(cache)}}>
            <svg width={30} height={40} viewBox="0 0 30 40"><path d="M15 2 V30 M5 20 L15 32 L25 20" fill="none" stroke={C.blue} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: 24, borderRadius: 16, border: `2px solid ${C.blue}`, padding: '16px 22px', background: `${C.blue}14`, boxShadow: `0 0 ${34 * clamp(cache) * glow}px ${C.blue}55`, opacity: clamp(cache), transform: `scale(${0.9 + 0.1 * clamp(cache)})`, transformOrigin: 'left center'}}>
            <span style={{fontSize: 22, color: C.blue, fontWeight: 700}}>② cached in memory</span>
            <span style={{padding: '8px 24px', borderRadius: 12, border: `3px solid ${C.green}`, background: `${C.green}22`, fontSize: 38, fontWeight: 700, color: C.green}}>$45.50</span>
          </div>
        </div>
      </Win>

      {/* outer table stream */}
      <Win x={990} y={150} w={840} h={590} title="Outer table · 100,000 rows" accent={pass > 0 ? C.green : C.border} opacity={win}>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 14, width: 240, height: 520, borderRadius: 16, border: `2px solid ${C.blue}`, background: `${C.blue}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, opacity: clamp(cache)}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.blue}}>cached value</div>
          <div style={{fontFamily: MONO, fontSize: 42, fontWeight: 700, color: C.green}}>$45.50</div>
          <div style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>reused, never recomputed</div>
        </div>
        <div style={{position: 'absolute', left: 300, top: 14, width: 500, height: 520, overflow: 'hidden'}}>
          {Array.from({length: 11}).map((_, i) => {
            const y = i * 56 - scroll;
            const on = pass > 0 && pass < 1;
            return (
              <div key={i} style={{position: 'absolute', left: 0, top: y, width: 500, height: 44, borderRadius: 8, background: C.deep, border: `2px solid ${on ? C.green : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontFamily: MONO, fontSize: 20, color: C.muted, opacity: pass > 0 ? 1 : 0.35}}>
                <span>row</span>
                <span style={{color: on ? C.green : C.muted}}>{on ? '> $45.50 ✓' : '···'}</span>
              </div>
            );
          })}
        </div>
      </Win>

      {/* KPIs */}
      <div dir="ltr" style={{position: 'absolute', left: 90, right: 90, top: 780, display: 'flex', gap: 24}}>
        {[
          {k: 'Inner evaluations', v: '1', c: C.green, p: clamp(timeTag)},
          {k: 'Outer rows scanned', v: rows.toLocaleString('en-US'), c: C.blue, p: prog(f, t(189.7), 16)},
          {k: 'Re-calculations', v: '0', c: C.green, p: prog(f, t(194.8), 18)},
        ].map((x) => (
          <div key={x.k} style={{flex: 1, height: 120, borderRadius: 20, border: `2px solid ${x.c}`, background: C.card, padding: '12px 26px', opacity: x.p}}>
            <div style={{fontFamily: MONO, fontSize: 20, color: C.muted}}>{x.k}</div>
            <div style={{fontFamily: MONO, fontSize: 54, fontWeight: 700, color: x.c, lineHeight: 1.15}}>{x.v}</div>
          </div>
        ))}
        <div style={{flex: 1.1, height: 120, borderRadius: 20, border: `2px solid ${C.green}`, background: `${C.green}14`, padding: '14px 26px', opacity: eff}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: clamp(seal)}}>
            <Check p={clamp(seal)} size={40} />
            <span style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Fast analytics</span>
          </div>
          <div style={{marginTop: 14, height: 16, borderRadius: 8, background: C.deep, overflow: 'hidden'}}>
            <div style={{width: `${eff * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`}} />
          </div>
          <div style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginTop: 6}}>illustrative timings</div>
        </div>
      </div>

      <Caption text="Non-Correlated Subquery ──► Evaluated ONCE Before Outer Query Execution" from={t(174.8)} to={t(187)} />
      <Caption text="Engine Caching ──► Reuses Scalar Value for 100k Rows with Zero Re-calculation" from={t(189.9)} to={t(206)} />
    </Stage>
  );
};
