import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Stage, TopBadge, Win, clamp, lerp, lin, pop, sec} from '../kit';
import {LONG, Q_TOTAL, QS} from '../data';

// SC04 (130-170s): single-pass aggregation in work_mem.
// Anchors (s): 131.2 engineering side | 141.7 query planner | 147.6 reads table once | 153.1 distributes to columns | 156.9 no repeated disk scan | 161.8 structural understanding
const S = START.s4;
const t = (g: number) => sec(g - S);
const RH = 46;
const TY = 180 + 56 + 52;
const SWEEP_AT = t(141.7);
const SWEEP_LEN = sec(10);
const rowAt = (i: number) => SWEEP_AT + ((i + 0.5) / LONG.length) * SWEEP_LEN;
const cx = (q: number) => 780 + 30 + q * 250 + 115;
const CY = 180 + 56 + 40 + 75;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const win = clamp(lin(f, t(131.2), 16));
  const sweep = lin(f, SWEEP_AT, SWEEP_LEN);
  const totals = [0, 0, 0, 0];
  LONG.forEach((r, i) => {
    if (f >= rowAt(i) + 22) totals[r.qi] += r.amount;
  });
  const badge = clamp(pop(f, t(147.6)));
  const disk = clamp(lin(f, t(156.9), 24));
  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="كواليس المحرك | Single-Pass Aggregation" from={sec(1)} to={sec(40)} color={C.blue} />

      <Win x={80} y={180} w={640} h={700} title="branch_sales · read ONCE" accent={C.blue} opacity={win}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: 52, display: 'flex', alignItems: 'center', padding: '0 26px', fontFamily: MONO, fontSize: 22, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 200}}>branch</span><span style={{width: 130}}>quarter</span><span>amount</span>
        </div>
        {LONG.map((r, i) => {
          const passed = f >= rowAt(i);
          return (
            <div key={i} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: 56 + i * RH, height: RH - 4, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 24, background: passed ? `${C.blue}26` : 'transparent', color: passed ? C.text : C.muted}}>
              <span style={{width: 200}}>{r.branch}</span><span style={{width: 130, color: passed ? C.green : C.muted}}>{r.q}</span><span>{r.amount}K</span>
            </div>
          );
        })}
      </Win>
      {sweep > 0 && sweep < 1 ? (
        <div style={{position: 'absolute', left: 88, width: 624, top: TY + sweep * LONG.length * RH - 2, height: 5, background: C.blue, boxShadow: `0 0 22px 6px ${C.blue}`, borderRadius: 3}} />
      ) : null}

      <Win x={780} y={180} w={1060} h={700} title="work_mem (RAM)" accent={C.blue} opacity={win}>
        {QS.map((q, qi) => (
          <div key={q} dir="ltr" style={{boxSizing: 'border-box', position: 'absolute', left: 30 + qi * 250, top: 40, width: 230, height: 150, borderRadius: 18, border: `3px solid ${C.blue}`, background: `${C.blue}1a`, boxShadow: `0 0 ${totals[qi] > 0 ? 22 : 0}px ${C.blue}88`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: MONO}}>
            <div style={{fontSize: 26, color: C.muted}}>{q}</div>
            <div style={{fontSize: 52, fontWeight: 700, color: C.text}}>{totals[qi]}K</div>
          </div>
        ))}
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 215, fontFamily: MONO, fontSize: 22, color: C.muted}}>running totals · accumulated in one sweep</div>
        <div style={{position: 'absolute', left: 30, top: 270, opacity: badge, transform: `scale(${0.85 + 0.15 * badge})`, transformOrigin: 'left center'}}>
          <Chip color={C.green} style={{fontSize: 30, padding: '10px 28px'}}><Check p={badge} size={34} /> Single Pass ✓</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 30, right: 30, top: 380, opacity: disk, fontFamily: MONO}}>
          <div style={{fontSize: 22, color: C.muted}}>table scans needed</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 10}}>
            <div style={{height: 34, width: 640 * disk, borderRadius: 10, background: `${C.red}88`}} />
            <span style={{fontSize: 24, color: C.red}}>4 · one per column</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 14}}>
            <div style={{height: 34, width: 160 * disk, borderRadius: 10, background: C.green, boxShadow: `0 0 18px ${C.green}88`}} />
            <span style={{fontSize: 24, color: C.green}}>1 · Zero Extra Disk Scans</span>
          </div>
        </div>
        <div style={{position: 'absolute', left: 30, top: 570, opacity: clamp(pop(f, t(161.8)))}}>
          <Chip color={C.blue} style={{fontSize: 26}}>huge pivot reports · minimal server resources</Chip>
        </div>
      </Win>
      {LONG.map((r, i) => {
        const p = lin(f, rowAt(i), 22);
        if (p <= 0 || p >= 1) return null;
        const e = p * p * (3 - 2 * p);
        return (
          <div key={i} dir="ltr" style={{position: 'absolute', left: lerp(560, cx(r.qi), e) - 50, top: lerp(TY + i * RH + 21, CY, e) - 20, width: 100, height: 40, borderRadius: 20, background: C.blue, color: C.bg, fontFamily: MONO, fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${C.blue}`}}>{r.amount}K</div>
        );
      })}
      <Caption text="PostgreSQL Query Engine ──► Single-Pass Aggregation in work_mem" from={t(141)} to={t(154)} />
      <Caption text="Zero Disk Re-scans ──► Filters & Pivots Metrics in a Single Sweep" from={t(156)} to={sec(39)} tone="ok" />
    </Stage>
  );
};
