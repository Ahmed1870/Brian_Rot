import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Mix, Sql, Stage, TopBadge, Warn, clamp, pop, prog, sec} from '../kit';

// SC05 (global 173.3-213.4s): engineering benchmark - 3 subqueries + LEFT JOINs (3 disk scans, RAM, 45ms) vs FILTER single scan (0.003s).
// Anchors (s): 175.1 engineering view | 183.3 LEFT JOIN | 186.8 JOINs eat RAM | 191.0 pages read several times | 193.1 FILTER walks row by row
// 197.1 one single read | 200.9 under a fraction of a millisecond | 203.0 mastery = the difference | 207.3 very slowly | 209.4 blink of an eye
const S = START.s5;
const t = (g: number) => sec(g - S);

const PW = 840;
const LX = 90;
const RX = 990;
const PY = 190;
const PH = 715;
const COLS = 8;
const ROWS = 3;
const CW = 80;
const CH = 54;
const GAP = 12;
const GRID_W = COLS * CW + (COLS - 1) * GAP;

type Sweep = {at: number; dur: number};

const PageGrid: React.FC<{x: number; y: number; color: string; sweeps: Sweep[]}> = ({x, y, color, sweeps}) => {
  const f = useCurrentFrame();
  const gx = x + (PW - GRID_W) / 2;
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let lit = 0;
      sweeps.forEach((s) => {
        const p = clamp((f - t(s.at)) / sec(s.dur));
        if (p <= 0) return;
        const reached = c + 0.5 <= p * COLS;
        if (!reached) return;
        const fade = p >= 1 ? clamp(1 - (f - t(s.at) - sec(s.dur)) / sec(1.0)) : 1;
        lit = Math.max(lit, fade);
      });
      cells.push(
        <div key={`${r}-${c}`} style={{position: 'absolute', left: c * (CW + GAP), top: r * (CH + GAP), width: CW, height: CH, borderRadius: 10, background: lit > 0.02 ? `${color}${Math.round(lit * 60 + 14).toString(16).padStart(2, '0')}` : C.deep, border: `2px solid ${lit > 0.02 ? color : C.border}`, boxShadow: lit > 0.5 ? `0 0 14px ${color}66` : 'none'}} />,
      );
    }
  }
  const active = sweeps
    .map((s) => ({p: clamp((f - t(s.at)) / sec(s.dur)), i: 0}))
    .filter((s) => s.p > 0 && s.p < 1)[0];
  return (
    <div style={{position: 'absolute', left: gx, top: y, width: GRID_W, height: ROWS * CH + (ROWS - 1) * GAP}}>
      {cells}
      {active ? <div style={{position: 'absolute', left: active.p * GRID_W - 3, top: -10, width: 6, height: ROWS * CH + (ROWS - 1) * GAP + 20, borderRadius: 3, background: color, boxShadow: `0 0 20px 6px ${color}88`}} /> : null}
    </div>
  );
};

const Bar: React.FC<{x: number; y: number; w: number; label: string; pct: number; color: string}> = ({x, y, w, label, pct, color}) => (
  <div dir="ltr" style={{position: 'absolute', left: x, top: y, width: w}}>
    <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 21, color: C.muted, marginBottom: 8}}>
      <span>{label}</span>
      <span style={{color}}>{Math.round(pct * 100)}%</span>
    </div>
    <div style={{height: 24, borderRadius: 12, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden'}}>
      <div style={{width: `${clamp(pct) * 100}%`, height: '100%', background: color, borderRadius: 12}} />
    </div>
  </div>
);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const left = prog(f, t(175.2), 24);
  const code1 = prog(f, t(183.3), 20);
  const ram1 = 0.9 * prog(f, t(186.8), sec(3.6));
  const ms = Math.round(45 * clamp((f - t(190.9)) / sec(5.8)));
  const msShow = f >= t(190.9);
  const right = 0.3 + 0.7 * prog(f, t(193.1), 22);
  const code2 = prog(f, t(193.2), 20);
  const ram2 = 0.08 * prog(f, t(197.05), sec(1));
  const time2 = pop(f, t(200.89));
  const seal = prog(f, t(202.95), 18);
  const slow = prog(f, t(207.27), 24);
  const bolt = pop(f, t(209.42));
  const shake = f >= t(207.27) && f < t(209.3) ? Math.sin(f * 2.2) * 5 : 0;
  const reads1 = [t(191.0), t(192.7), t(194.4)].filter((x) => f >= x).length;
  const reads2 = f >= t(197.05) ? 1 : 0;

  return (
    <Stage dur={1202} inFx="up" outFx="fade">
      <TopBadge text="الأداء الفائق · Single Scan vs Multiple JOINs" from={t(175.4)} to={t(191)} color={C.green} />

      {/* ================= LEFT: subqueries + LEFT JOIN */}
      <div style={{position: 'absolute', left: LX, top: PY, width: PW, height: PH, borderRadius: 26, background: 'rgba(30,41,59,0.6)', border: `2px solid ${C.red}`, boxShadow: `0 0 40px ${C.red}22`, opacity: left * (1 - 0.35 * slow), transform: `translateX(${shake}px)`}}>
        <div style={{position: 'absolute', left: 26, top: 18}}>
          <Chip color={C.red} style={{fontSize: 22}}>3 Subqueries + LEFT JOIN</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 26, right: 26, top: 80, height: 130, borderRadius: 14, background: C.deep, border: `2px solid ${C.border}`, padding: '14px 18px', fontFamily: MONO, fontSize: 19, lineHeight: 1.55, opacity: code1, transform: `translateY(${(1 - code1) * 16}px)`}}>
          <div><Sql text="FROM (SELECT SUM(total_amount) … 'Completed') a" /></div>
          <div><Sql text="LEFT JOIN (SELECT SUM(total_amount) … 'Returned') b" /></div>
          <div><Sql text="LEFT JOIN (SELECT COUNT(*) … 'Cancelled') c" /></div>
        </div>
        <Bar x={26} y={495} w={PW - 52} label="RAM · temp tables" pct={ram1} color={C.red} />
      </div>
      <PageGrid x={LX} y={PY + 245} color={C.red} sweeps={[{at: 191.0, dur: 1.5}, {at: 192.7, dur: 1.5}, {at: 194.4, dur: 1.5}]} />
      <div dir="ltr" style={{position: 'absolute', left: LX + 26, top: PY + 436, fontFamily: MONO, fontSize: 24, color: C.red, opacity: left}}>
        DISK READS <span style={{fontSize: 34, fontWeight: 700}}>{reads1}×</span>
      </div>
      <div dir="ltr" style={{position: 'absolute', left: LX + 26, top: PY + 572, opacity: left * (msShow ? 1 : 0.3)}}>
        <div style={{fontFamily: MONO, fontSize: 22, color: C.muted}}>execution time</div>
        <div style={{fontFamily: MONO, fontSize: 92, fontWeight: 700, lineHeight: 1.1, color: C.red}}>
          {msShow ? ms : '—'}
          <span style={{fontSize: 44, color: C.muted}}> ms</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: LX + PW - 190, top: PY + 590, opacity: slow}}>
        <Warn size={96} />
      </div>
      <div style={{position: 'absolute', left: LX + PW - 400, top: PY + 690 - 40, width: 360, textAlign: 'right', opacity: slow}}>
        <Mix style={{fontSize: 30, fontWeight: 700, color: C.red}}>بطيء جداً</Mix>
      </div>

      {/* ================= RIGHT: FILTER single scan */}
      <div style={{position: 'absolute', left: RX, top: PY, width: PW, height: PH, borderRadius: 26, background: 'rgba(30,41,59,0.6)', border: `2px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}22`, opacity: right}}>
        <div style={{position: 'absolute', left: 26, top: 18}}>
          <Chip color={C.green} style={{fontSize: 22}}>FILTER · Single Scan</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 26, right: 26, top: 80, height: 130, borderRadius: 14, background: C.deep, border: `2px solid ${C.border}`, padding: '14px 18px', fontFamily: MONO, fontSize: 19, lineHeight: 1.55, opacity: code2, transform: `translateY(${(1 - code2) * 16}px)`}}>
          <div><Sql text="SUM(total_amount) FILTER (WHERE … 'Completed')," /></div>
          <div><Sql text="SUM(total_amount) FILTER (WHERE … 'Returned')," /></div>
          <div><Sql text="COUNT(*) FILTER (WHERE … 'Cancelled')" /></div>
        </div>
        <Bar x={26} y={495} w={PW - 52} label="RAM · no temp tables" pct={ram2} color={C.green} />
      </div>
      <PageGrid x={RX} y={PY + 245} color={C.green} sweeps={[{at: 197.05, dur: 0.9}]} />
      <div dir="ltr" style={{position: 'absolute', left: RX + 26, top: PY + 436, fontFamily: MONO, fontSize: 24, color: C.green, opacity: right}}>
        DISK READS <span style={{fontSize: 34, fontWeight: 700}}>{reads2}×</span>
      </div>
      <div dir="ltr" style={{position: 'absolute', left: RX + 26, top: PY + 572, opacity: clamp(time2), transform: `scale(${0.85 + 0.15 * clamp(time2)})`, transformOrigin: 'left center'}}>
        <div style={{fontFamily: MONO, fontSize: 22, color: C.muted}}>execution time</div>
        <div style={{fontFamily: MONO, fontSize: 92, fontWeight: 700, lineHeight: 1.1, color: C.green, textShadow: `0 0 28px ${C.green}66`}}>
          0.003<span style={{fontSize: 44, color: C.muted}}> s</span>
        </div>
      </div>

      {/* quality seal */}
      <div style={{position: 'absolute', left: RX + PW - 330, top: PY + 585, opacity: seal, transform: `rotate(-8deg) scale(${1.7 - 0.7 * seal})`, transformOrigin: 'center'}}>
        <div style={{border: `5px double ${C.green}`, borderRadius: 18, padding: '14px 26px', textAlign: 'center', background: `${C.green}14`}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 34, fontWeight: 700, color: C.green}}>OPTIMIZED ✓</div>
          <Mix style={{display: 'block', fontSize: 22, color: C.text}}>اعتماد بنيوي</Mix>
        </div>
      </div>

      {/* lightning bolt */}
      <div style={{position: 'absolute', left: RX + PW - 110, top: PY + 16, opacity: clamp(bolt), transform: `scale(${0.6 + 0.4 * clamp(bolt)})`}}>
        <svg width={70} height={90} viewBox="0 0 70 90" style={{filter: `drop-shadow(0 0 14px ${C.amber})`}}>
          <polygon points="42,2 8,50 32,50 24,88 62,36 38,36" fill={C.amber} />
        </svg>
      </div>

      <Caption text="Multiple JOINs & Subqueries ──► 3x Disk Reads (45ms) (Slow)" from={t(177)} to={t(192.5)} tone="danger" />
      <Caption text="Conditional FILTER Aggregation ──► 1x Single Scan (0.003s Lightning Fast)" from={t(193.4)} to={t(209)} tone="ok" />
    </Stage>
  );
};
