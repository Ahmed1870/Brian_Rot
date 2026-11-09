import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {FILTER_OR, SALES_RAW, salesCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

const S = START.s3;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 100, 90, 110, 100, 30, 100, 90, 110, 100][c] ?? XL.colW;

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 480, fy: 280, z: 0.95}, prog(f, t(2), 30));

  // Phase 1: OR formula (85-100s)
  const orTyped = typed('(B:B="Cairo") + (B:B="Alex")', f, t(86), 1.2);
  const orDone = f >= t(94);
  const orP = orDone ? prog(f, t(94.5), 14) : 0;
  const orFilled = Math.floor(orP * FILTER_OR.length);

  // Phase 2: #CALC! error + if_empty shield (100-130s)
  const phase2 = f >= t(100);
  const calcTyped = phase2 ? typed('=FILTER(A1:D11, B:B="Aswan")', f, t(101), 1.0) : '';
  const calcDone = f >= t(107);
  const calcErrorP = calcDone ? prog(f, t(107.5), 10) : 0;
  const shieldTyped = f >= t(112) ? typed('"No Records Found"', f, t(113), 0.8) : '';
  const shieldP = f >= t(117) ? prog(f, t(117.5), 12) : 0;

  const fbEdit = (f >= t(86) && f < t(94.5)) || (phase2 && f >= t(101) && f < t(107.5)) || (f >= t(113) && f < t(117.5));
  const formula = phase2 ? (f >= t(113) ? `=FILTER(A1:D11, B:B="Aswan", ${shieldTyped})` : calcTyped) : orTyped;

  const fbY = geo(1, 0, 1).fbTop + 14;
  const f2 = cellCenter(2, 6, {colW});
  const pts = dwell([
    {f: t(86), x: 200, y: fbY},
    {f: t(94), x: f2.x, y: f2.y},
    {f: t(101), x: 200, y: fbY},
    {f: t(107), x: f2.x, y: f2.y},
    {f: t(113), x: 200, y: fbY},
    {f: t(117), x: f2.x, y: f2.y},
    {f: t(119), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [94, 107, 117];
  const curHide = f > t(120);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="OR_Calc.xlsx" nameBox="F2" formula={formula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c <= 4 && r <= 11) return salesCell(r, c) as any;
            if (c >= 6 && c <= 9) {
              if (r === 1) {
                const h = ['OrderID', 'Branch', 'Product', 'Amount'];
                return {t: h[c - 6], b: true, bg: '#D1FAE5', al: c === 9 ? 'r' : 'l', color: '#107C41'};
              }
              // OR result
              if (!phase2) {
                const idx = r - 2;
                if (idx < orFilled && idx < FILTER_OR.length) {
                  const row = FILTER_OR[idx];
                  return c === 6 ? {t: row.id, color: '#107C41'} : c === 7 ? {t: row.branch, color: '#107C41'} : c === 8 ? {t: row.product, color: '#107C41'} : {t: row.amount.toLocaleString('en-US'), al: 'r', color: '#107C41'};
                }
                return undefined;
              }
              // #CALC! error (phase 2, before shield)
              if (r === 2 && calcErrorP > 0 && shieldP < 0.5) {
                if (c === 6) return {t: '#CALC!', color: '#EF4444', bg: '#FEE2E2'};
                return undefined;
              }
              // Shield text (after if_empty added)
              if (r === 2 && shieldP > 0.3) {
                if (c === 6) return {t: 'No Records Found', color: '#107C41', bg: '#D1FAE5'};
                return undefined;
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={phase2 ? {r1: 2, c1: 6, r2: 2, c2: 6} : {r1: 2, c1: 6, r2: 2, c2: 6}}
          active={{r: 2, c: 6}}
          thumb={0} thumbSize={0.55}
        >
          {!phase2 && orP > 0.05 ? (
            <Neon x={cellCenter(2, 6, {colW}).x - colW(6) / 2} y={cellCenter(2, 6, {colW}).y - XL.rowH / 2} w={colW(6) + colW(7) + colW(8) + colW(9)} h={XL.rowH * FILTER_OR.length} color={C.purple} p={orP * (1 - prog(f, t(100), 8))} label="=FILTER with OR (+) — Cairo + Alex" labelBelow />
          ) : null}
          {phase2 && calcErrorP > 0 && shieldP < 0.5 ? (
            <Neon x={cellCenter(2, 6, {colW}).x - colW(6) / 2} y={cellCenter(2, 6, {colW}).y - XL.rowH / 2} w={colW(6) + colW(7)} h={XL.rowH} color={C.red} p={calcErrorP} label="#CALC! Error" labelBelow />
          ) : null}
          {phase2 && shieldP > 0.3 ? (
            <Neon x={cellCenter(2, 6, {colW}).x - colW(6) / 2} y={cellCenter(2, 6, {colW}).y - XL.rowH / 2} w={colW(6) + colW(7)} h={XL.rowH} color={C.green} p={shieldP} label="if_empty shield ✓" labelBelow />
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={c === 117 ? C.green : C.red} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(86), 12) * (1 - prog(f, t(130), 12)))}}>
        <div style={{display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 18px'}}>
          {!phase2 ? (
            <>
              <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.purple}}>(Branch="Cairo")</span>
              <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.purple}}>+</span>
              <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.purple}}>(Branch="Alex")</span>
              <span style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>= OR Logic → either match</span>
            </>
          ) : shieldP > 0.3 ? (
            <>
              <svg width={24} height={24} viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} /><polyline points="7,12 11,16 17,9" fill="none" stroke={C.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.green}}>if_empty shield active → #CALC! prevented ✓</span>
            </>
          ) : (
            <>
              <svg width={24} height={24} viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} fill={`${C.red}22`} stroke={C.red} strokeWidth={2.5} /><line x1={8} y1={8} x2={16} y2={16} stroke={C.red} strokeWidth={2.5} strokeLinecap="round" /><line x1={16} y1={8} x2={8} y2={16} stroke={C.red} strokeWidth={2.5} strokeLinecap="round" /></svg>
              <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.red}}>#CALC! Error → no matching records found</span>
            </>
          )}
        </div>
      </div>

      <TopBadge text="OR Logic (+) ──► (range1 = cond1) + (range2 = cond2) (Either Can Be TRUE)" from={t(86.0)} to={t(100.0)} />
      {phase2 && shieldP < 0.3 ? <Caption text="#CALC! Error Shield ──► [if_empty] Fallback Argument Prevents Calculation Errors" from={t(100.0)} to={t(129.0)} tone="danger" /> : null}
    </Stage>
  );
};
