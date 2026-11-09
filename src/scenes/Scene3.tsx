import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {CHOOSEROWS_1_NEG1, CHOOSEROWS_NEG1, CHOOSEROWS_POS, SALES_TABLE, salesCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

const S = START.s3;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 100, 100, 100, 100, 30, 100, 100, 100, 100][c] ?? XL.colW;

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 460, fy: 260, z: 0.95}, prog(f, t(2), 30));

  // Phase 1: positive indexing CHOOSEROWS(..., 1, 2, 3)
  const posTyped = typed('=CHOOSEROWS(A1:D7, 1, 2, 3)', f, t(86), 1.2);
  const posDone = f >= t(94);
  const posP = posDone ? prog(f, t(94.5), 14) : 0;
  const posFill = Math.floor(posP * CHOOSEROWS_POS.length);

  // Phase 2: negative indexing CHOOSEROWS(..., -1)
  const phase2 = f >= t(100);
  const negTyped = phase2 ? typed('=CHOOSEROWS(A1:D7, -1)', f, t(100.5), 1.0) : '';
  const negDone = f >= t(107);
  const negP = negDone ? prog(f, t(107.5), 12) : 0;

  // Phase 3: first + last CHOOSEROWS(..., 1, -1)
  const phase3 = f >= t(113);
  const bothTyped = phase3 ? typed('=CHOOSEROWS(A1:D7, 1, -1)', f, t(113.5), 1.0) : '';
  const bothDone = f >= t(120);
  const bothP = bothDone ? prog(f, t(120.5), 12) : 0;

  const fbEdit = (f >= t(86) && f < t(94.5)) || (phase2 && f >= t(100.5) && f < t(107.5)) || (phase3 && f >= t(113.5) && f < t(120.5));
  const formula = phase3 ? bothTyped : phase2 ? negTyped : posTyped;

  const fbY = geo(1, 0, 1).fbTop + 14;
  const g2 = cellCenter(2, 7, {colW});
  const pts = dwell([
    {f: t(86), x: 200, y: fbY},
    {f: t(94), x: g2.x, y: g2.y},
    {f: t(100.5), x: 200, y: fbY},
    {f: t(107), x: g2.x, y: g2.y},
    {f: t(113.5), x: 200, y: fbY},
    {f: t(120), x: g2.x, y: g2.y},
    {f: t(122), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [94, 107, 120];
  const curHide = f > t(123);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  const currentResult = phase3 ? CHOOSEROWS_1_NEG1 : phase2 ? CHOOSEROWS_NEG1 : CHOOSEROWS_POS;
  const currentP = phase3 ? bothP : phase2 ? negP : posP;
  const currentFill = phase3 ? Math.floor(bothP * CHOOSEROWS_1_NEG1.length) : phase2 ? Math.floor(negP * CHOOSEROWS_NEG1.length) : posFill;
  const borderColor = phase3 ? C.amber : phase2 ? C.amber : C.purple;

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="ChooseRows.xlsx" nameBox="G2" formula={formula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c <= 4 && r <= 7) return salesCell(r, c) as any;
            if (c >= 7 && c <= 10) {
              if (r === 1) {
                const h = ['OrderID', 'Name', 'Product', 'Amount'];
                return {t: h[c - 7], b: true, bg: phase2 || phase3 ? '#FEF3C7' : '#D1FAE5', al: c === 10 ? 'r' : 'l', color: phase2 || phase3 ? '#92400E' : '#107C41'};
              }
              const idx = r - 2;
              if (idx < currentFill && idx < currentResult.length) {
                const row = currentResult[idx];
                const color = phase2 || phase3 ? '#92400E' : '#107C41';
                return c === 7 ? {t: row.id, color} : c === 8 ? {t: row.name, color} : c === 9 ? {t: row.product, color} : {t: row.amount.toLocaleString('en-US'), al: 'r', color};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 7, r2: 2, c2: 7}} active={{r: 2, c: 7}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4)} h={XL.rowH * 7} color={C.amber} p={0.15} />
          {currentP > 0.05 ? (
            <Neon x={cellCenter(2, 7, {colW}).x - colW(7) / 2} y={cellCenter(2, 7, {colW}).y - XL.rowH / 2} w={colW(7) + colW(8) + colW(9) + colW(10)} h={XL.rowH * currentResult.length} color={borderColor} p={currentP * (1 - prog(f, t(130), 12))} label={phase3 ? '=CHOOSEROWS(..., 1, -1) → first + last' : phase2 ? '=CHOOSEROWS(..., -1) → last row only' : '=CHOOSEROWS(..., 1, 2, 3) → first 3 rows'} labelBelow />
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={phase2 || phase3 ? C.amber : C.purple} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(86), 12) * (1 - prog(f, t(130), 12)))}}>
        <div style={{display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 18px'}}>
          {!phase2 && !phase3 ? <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.purple}}>CHOOSEROWS(..., 1, 2, 3) → positive indexing</span> : null}
          {phase2 && !phase3 ? <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.amber}}>CHOOSEROWS(..., -1) → negative index = last row</span> : null}
          {phase3 ? <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.amber}}>CHOOSEROWS(..., 1, -1) → first + last together</span> : null}
        </div>
      </div>

      <TopBadge text="Row Slicing ──► =CHOOSEROWS(array, row_num1, row_num2)" from={t(86.0)} to={t(100.0)} />
      {phase2 || phase3 ? <Caption text="Negative Indexing ──► =CHOOSEROWS(tbl_Sales, -1) Extracts Last Row Dynamically" from={t(100.0)} to={t(129.0)} tone="ok" /> : null}
    </Stage>
  );
};
