import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {AUDIT_TOTAL, SALES_AUDIT, auditCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track,
} from '../kit';

// SC01: Trace Precedents & Dependents — neon arrows draw themselves between cells.
// Single Excel window (no split). E20 = SUM(D2:D9).
// Phase 1 (0-6s): show grid, highlight E20.
// Phase 2 (6-18s): click Trace Precedents → blue arrows draw from D2:D9 → E20.
// Phase 3 (18-40s): click Trace Dependents → green arrows draw from E20 → summary report cell.
const S = START.s1;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 200, 80, 120, 140, 200][c] ?? XL.colW;

/** Animated neon arrow that draws itself from (x1,y1) to (x2,y2). */
const NeonArrow: React.FC<{x1: number; y1: number; x2: number; y2: number; color: string; p: number; label?: string}> = ({x1, y1, x2, y2, color, p, label}) => {
  if (p <= 0.01) return null;
  const cx = x1 + (x2 - x1) * clamp(p);
  const cy = y1 + (y2 - y1) * clamp(p);
  // Arrowhead direction
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len, uy = dy / len;
  const headSize = 10;
  return (
    <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 28}}>
      <defs>
        <marker id={`ah-${color.replace('#', '')}`} markerWidth={headSize} markerHeight={headSize} refX={headSize / 2} refY={headSize / 2} orient="auto">
          <path d={`M0,0 L${headSize},${headSize / 2} L0,${headSize} Z`} fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={cx} y2={cy} stroke={color} strokeWidth={3} strokeDasharray="6 3" opacity={0.9} markerEnd={clamp(p) >= 0.95 ? `url(#ah-${color.replace('#', '')})` : undefined} />
      {label && clamp(p) > 0.5 ? (
        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} textAnchor="middle" fill={color} fontFamily="Consolas, monospace" fontSize={13} fontWeight={700} opacity={clamp((p - 0.5) * 2)}>{label}</text>
      ) : null}
    </svg>
  );
};

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 280, z: 1.1}, prog(f, t(2), 30));

  // Phase control
  const precedentsP = prog(f, t(6), 18); // blue arrows
  const dependentsP = prog(f, t(18), 18); // green arrows

  // E20 position (total cell, row 20)
  const e20 = cellCenter(20, 5, {colW});
  // Precedents: D2:D9 (source totals)
  const precedents = Array.from({length: 8}, (_, i) => cellCenter(2 + i, 4, {colW}));
  // Dependents: a summary cell at H5 (executive report)
  const dependent = cellCenter(5, 8, {colW});

  // Cursor: E20 → Trace Precedents icon (Formulas ribbon) → Trace Dependents icon
  const fbY = geo(1, 0, 1).fbTop + 14;
  const tracePrecX = 880; // approximate Trace Precedents icon in Formulas ribbon
  const traceDepX = 930;
  const ribbonY = geo(1, 0, 1).rowsTop - 50;
  const pts = dwell([
    {f: t(0), x: 900, y: 330},
    {f: t(4), x: e20.x, y: e20.y},          // select E20
    {f: t(6), x: tracePrecX, y: ribbonY},     // click Trace Precedents
    {f: t(18), x: traceDepX, y: ribbonY},     // click Trace Dependents
    {f: t(20), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [4, 6, 18];
  const curHide = f > t(21);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  const g0 = geo(1, 0, 1);

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Sales_Audit.xlsx" nameBox="E20" formula={`=SUM(D2:D9) = EGP ${AUDIT_TOTAL.toLocaleString('en-US')}`} tab="Formulas"
          cell={(r, c) => {
            // Column E (c=5) row 20 = total
            if (c === 5 && r === 20) {
              return {t: 'EGP ' + AUDIT_TOTAL.toLocaleString('en-US'), al: 'r', b: true, bg: '#D1FAE5', color: '#107C41'};
            }
            // Column H (c=8) row 5 = dependent summary
            if (c === 8 && r === 5) {
              if (dependentsP > 0.3) {
                return {t: 'EGP ' + AUDIT_TOTAL.toLocaleString('en-US'), al: 'r', color: '#107C41', bg: '#D1FAE5'};
              }
              return undefined;
            }
            if (c === 8 && r === 1) {
              return {t: 'Exec Report', b: true, bg: '#E2EFDA', al: 'l'};
            }
            return auditCell(r, c) as any;
          }} colW={colW}
          sel={{r1: 20, c1: 5, r2: 20, c2: 5}} active={{r: 20, c: 5}}
          thumb={0} thumbSize={0.55}
        >
          {/* Highlight E20 (the audited cell) */}
          <Neon x={e20.x - colW(5) / 2} y={e20.y - XL.rowH / 2} w={colW(5)} h={XL.rowH} color={C.amber} p={prog(f, t(4), 12) * (1 - prog(f, t(40), 12))} label="Audited cell E20" labelBelow />
          {/* Highlight source column D (precedents) */}
          <Neon x={cellCenter(1, 4, {colW}).x - colW(4) / 2} y={g0.rowsTop} w={colW(4)} h={XL.rowH * 9} color={C.blue} p={precedentsP * 0.3} label="Precedents (D2:D9)" labelBelow />
          {/* Highlight dependent cell H5 */}
          {dependentsP > 0.01 ? (
            <Neon x={cellCenter(5, 8, {colW}).x - colW(8) / 2} y={cellCenter(5, 8, {colW}).y - XL.rowH / 2} w={colW(8)} h={XL.rowH} color={C.green} p={dependentsP * 0.6} label="Dependent" labelBelow />
          ) : null}
          {/* Blue arrows: D2:D9 → E20 (precedents) */}
          {precedents.map((src, i) => (
            <NeonArrow key={'prec' + i} x1={src.x} y1={src.y} x2={e20.x} y2={e20.y} color={C.blue} p={Math.max(0, precedentsP - i * 0.08)} label={i === 0 ? 'Trace Precedents' : undefined} />
          ))}
          {/* Green arrow: E20 → H5 (dependent) */}
          {dependentsP > 0.01 ? (
            <NeonArrow x1={e20.x} y1={e20.y} x2={dependent.x} y2={dependent.y} color={C.green} p={dependentsP} label="Trace Dependents" />
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={c === 6 ? C.blue : c === 18 ? C.green : C.amber} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Lesson counter */}
      <div style={{position: 'absolute', right: 56, top: 80, opacity: prog(f, t(1), 12)}}>
        <div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 25 من 76 · الوحدة 5 من 14</div>
      </div>

      <TopBadge text="الدرس 25 من 76 | الوحدة 5 من 14 ──► Formula Diagnostics Engine" from={t(2.0)} to={t(18.0)} />
      <Caption text="Trace Precedents & Dependents ──► Visualizing Data Dependencies via Vector Arrows" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
