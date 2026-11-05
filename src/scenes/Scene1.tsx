import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Chip, Editor, Stage, TopBadge, Win, clamp, pop, prog, sec} from '../kit';

// SC01 (frames 0-1200): ORDER BY inside OVER() turns a static total into a running (cumulative) total.
const t = (g: number) => sec(g);
const DAYS = ['01-Jan', '02-Jan', '03-Jan', '04-Jan', '05-Jan', '06-Jan', '07-Jan', '08-Jan'];
const AMT = [120, 80, 150, 60, 200, 90, 130, 170];
const RUN = AMT.map((_, i) => AMT.slice(0, i + 1).reduce((a, b) => a + b, 0));
const RH = 52;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const tbl = prog(f, t(1.4), 24);
  const stat = prog(f, t(5.0), 20) * (1 - prog(f, t(19.4), 14));
  const statChip = pop(f, t(8.1));
  const q = pop(f, t(14.5));
  const frame = prog(f, t(18.5), 22);
  const swap = prog(f, t(18.5), 12);
  const p = clamp((f - t(24.0)) / sec(1.3), 0, 8);
  const cur = Math.min(7, Math.floor(p));
  const frac = p - Math.floor(p);
  const running = p > 0;
  const glow = 0.5 + 0.5 * Math.sin(f / 7);
  const done = pop(f, t(35.2));

  return (
    <Stage dur={1200} inFx="none" outFx="zoom">
      <TopBadge text="المجاميع التراكمية والترتيب | Running Totals & Cumulative Windows" from={t(2)} to={t(18)} color={C.blue} />

      <div style={{opacity: 1 - swap}}>
        <Editor x={90} y={150} w={1100} h={200} title="static.sql" lines={['SELECT sale_date, amount,', '       SUM(amount) OVER() AS static_total', 'FROM sales;']} start={t(4.6)} cps={1.2} size={24} accent={C.border} />
      </div>
      <div style={{opacity: swap, position: 'absolute', inset: 0}}>
        <Editor x={90} y={150} w={1100} h={200} title="running_total.sql" lines={['SELECT sale_date, amount,', '       SUM(amount) OVER(ORDER BY sale_date) AS running_total', 'FROM sales;']} start={t(18.7)} cps={1.5} size={24} accent={C.blue} />
      </div>

      <Win x={90} y={380} w={1200} h={512} title="sales" accent={frame > 0.5 ? C.blue : C.border} opacity={tbl}>
        <div dir="ltr" style={{position: 'relative', padding: '0 22px'}}>
          <div style={{display: 'flex', height: 40, alignItems: 'center', fontFamily: MONO, fontSize: 20, color: C.muted, borderBottom: `2px solid ${C.border}`}}>
            <div style={{width: 230, paddingLeft: 12}}>sale_date</div>
            <div style={{width: 200}}>amount</div>
            <div style={{width: 330, opacity: stat}}>SUM(amount) OVER()</div>
            <div style={{color: C.blue, fontWeight: 700, opacity: prog(f, t(23.5), 14)}}>running_total</div>
          </div>
          {DAYS.map((d, i) => {
            const shown = running && (i < cur || (i === cur && frac > 0.25));
            const now = running && p < 8 && i === cur;
            const swell = now ? 1 + 0.22 * Math.sin(Math.PI * clamp(frac * 1.5)) : 1;
            return (
              <div key={d} style={{display: 'flex', alignItems: 'center', height: RH, fontFamily: MONO, fontSize: 24, color: C.text, borderBottom: `1px solid ${C.border}`, background: now ? `${C.green}1F` : 'transparent', borderRadius: 6, opacity: clamp(tbl * 1.3 - i * 0.04)}}>
                <div style={{width: 230, paddingLeft: 12, color: frame > 0.5 ? C.blue : C.text}}>{d}</div>
                <div style={{width: 200}}>{AMT[i]}</div>
                <div style={{width: 330, color: C.muted, opacity: stat}}>1000</div>
                <div style={{color: C.green, fontWeight: 700, transform: `scale(${swell})`, transformOrigin: 'left center', opacity: shown ? 1 : 0}}>{RUN[i]}</div>
              </div>
            );
          })}
          <div style={{position: 'absolute', left: 4, right: 4, top: 40, bottom: 4, borderRadius: 12, border: `3px solid ${C.blue}`, boxShadow: `0 0 ${24 * glow}px ${C.blue}66`, opacity: frame, pointerEvents: 'none'}} />
        </div>
      </Win>

      {/* side panel */}
      <div dir="ltr" style={{position: 'absolute', left: 1340, top: 380, width: 490, display: 'flex', flexDirection: 'column', gap: 20}}>
        <div style={{transform: `scale(${clamp(statChip)})`, opacity: clamp(statChip), transformOrigin: 'left center'}}><Chip color={C.muted} style={{fontSize: 24}}>static: same total on every row</Chip></div>
        <div style={{transform: `scale(${clamp(q)})`, opacity: clamp(q), transformOrigin: 'left center'}}><Chip color={C.amber} style={{fontSize: 24}}>how to track growth over time?</Chip></div>
        <div style={{borderRadius: 22, border: `2px solid ${C.green}`, background: C.card, padding: '20px 28px', opacity: prog(f, t(23.8), 18)}}>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.muted}}>accumulator</div>
          <div style={{fontFamily: MONO, fontSize: 84, fontWeight: 700, color: C.green, lineHeight: 1.1}}>{running ? RUN[cur] : 0}</div>
        </div>
        <div style={{transform: `scale(${clamp(done)})`, opacity: clamp(done), transformOrigin: 'left center'}}><Chip color={C.green} style={{fontSize: 24, background: `${C.green}26`}}>cumulative aggregation ✓</Chip></div>
      </div>

      <Caption text="SUM(amount) OVER(ORDER BY sale_date) ──► Builds Dynamic Cumulative Totals" from={t(22.4)} to={t(38)} />
    </Stage>
  );
};
