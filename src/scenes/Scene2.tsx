import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {SALES, SORTED_BY_AMOUNT_DESC, SORTED_UNIQUE_CUSTOMERS, salesCell} from '../data';
import {
  Caption, Cursor, ExcelApp, Neon, Ripple, Stage, TopBadge, XL, clamp, dwell, geo, prog, sec, track, typed, cellCenter,
} from '../kit';

// SC02: SORT + SORT(UNIQUE) — split screen with typed formulas in each panel.
const S = START.s2;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 110, 130, 130, 110][c] ?? XL.colW;
const colW2 = (c: number) => [0, 200][c] ?? XL.colW;

const FORMULA_LEFT = '=SORT(A2:D10, 4, -1)';
const FORMULA_RIGHT = '=SORT(UNIQUE(B2:B10))';

/** Mini Excel panel. */
const Panel: React.FC<{x: number; y: number; scale: number; title: string; titleColor: string; children?: React.ReactNode}> = ({x, y, scale, title, titleColor, children}) => (
  <div style={{position: 'absolute', left: x, top: y}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
      <div style={{width: 12, height: 12, borderRadius: 6, background: titleColor, boxShadow: `0 0 10px ${titleColor}`}} />
      <span style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: titleColor}}>{title}</span>
    </div>
    <div style={{position: 'relative', width: XL.W * scale, height: XL.H * scale, borderRadius: 8, overflow: 'hidden', border: `2px solid ${titleColor}55`, boxShadow: `0 16px 50px rgba(2,6,23,0.6)`}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: XL.W, height: XL.H, transformOrigin: '0 0', transform: `scale(${scale})`}}>
        {children}
      </div>
    </div>
  </div>
);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const fadeIn = prog(f, t(1.0), 12);

  // LEFT: type =SORT(A2:D10, 4, -1), reorder happens at 47s
  const leftTyped = typed(FORMULA_LEFT, f, t(42), 1.2);
  const leftDone = f >= t(49);
  const leftReorder = leftDone ? prog(f, t(49.5), 16) : 0;
  const leftShowSorted = leftReorder > 0.1;

  // RIGHT: type =SORT(UNIQUE(B2:B10)), spill at 65s
  const rightTyped = typed(FORMULA_RIGHT, f, t(60), 1.2);
  const rightDone = f >= t(67);
  const rightSpill = rightDone ? prog(f, t(67.5), 16) : 0;
  const rightShowResults = rightSpill > 0.05;

  // Cursor (left panel)
  const lF2 = cellCenter(2, 5, {colW});
  const lFbY = geo(1, 0, 1).fbTop + 14;
  const lPts = dwell([
    {f: t(42), x: 200, y: lFbY},
    {f: t(49), x: lF2.x, y: lF2.y},
  ]);
  const lCur = track(f, lPts);
  const lClicks = [42, 49];

  // Cursor (right panel)
  const rF2 = cellCenter(2, 3, {colW: colW2});
  const rFbY = geo(1, 0, 1).fbTop + 14;
  const rPts = dwell([
    {f: t(60), x: 200, y: rFbY},
    {f: t(67), x: rF2.x, y: rF2.y},
  ]);
  const rCur = track(f, rPts);
  const rClicks = [60, 67];

  const scale = 0.62;
  const px = 40;
  const py = 175;
  const pw = XL.W * scale;

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: C.bg, opacity: 1 - fadeIn, pointerEvents: 'none'}} />

      {/* LEFT panel: SORT alone */}
      <div style={{position: 'absolute', left: px, top: py, opacity: fadeIn}}>
        <Panel x={0} y={0} scale={scale} title="SORT — Descending by Amount" titleColor={C.blue}>
          <ExcelApp
            file="tbl_Sales.xlsx" nameBox="E2" formula={leftTyped} fbEdit={f >= t(42) && f < t(49.5)}
            cell={(r, c) => {
              if (leftShowSorted) {
                // Sorted table in columns A-D
                if (r === 1) return salesCell(1, c) as any;
                const row = SORTED_BY_AMOUNT_DESC[r - 2];
                if (!row || c < 1 || c > 4) return undefined;
                const cells: any = {
                  1: {t: row.id}, 2: {t: row.customer}, 3: {t: row.product}, 4: {t: 'EGP ' + row.amount.toLocaleString('en-US'), al: 'r'},
                };
                return cells[c];
              }
              return salesCell(r, c) as any;
            }} colW={colW}
            sel={{r1: 2, c1: 5, r2: 2, c2: 5}} active={{r: 2, c: 5}} thumb={0} thumbSize={0.55}
          >
            {/* Reorder animation highlight */}
            {leftShowSorted ? (
              <Neon x={cellCenter(2, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4)} h={XL.rowH * 9} color={C.blue} p={leftReorder * 0.3} label="Sorted desc by Amount" labelBelow />
            ) : null}
            {lClicks.map((c) => { const cp = track(t(c), lPts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
            <Cursor x={lCur.x} y={lCur.y} down={lClicks.some((c) => f >= t(c) && f < t(c) + 4)} hide={leftDone} />
          </ExcelApp>
        </Panel>
      </div>

      {/* RIGHT panel: SORT(UNIQUE(...)) */}
      <div style={{position: 'absolute', left: px + pw + 30, top: py, opacity: fadeIn}}>
        <Panel x={0} y={0} scale={scale} title="SORT(UNIQUE(...)) — Master Combo" titleColor={C.green}>
          <ExcelApp
            file="tbl_Sales.xlsx" nameBox="C2" formula={rightTyped} fbEdit={f >= t(60) && f < t(67.5)}
            cell={(r, c) => {
              // Column A-B: original customer column (B2:B10) shown for reference
              if (c <= 2) {
                if (c === 1) return undefined;
                if (r === 1) return {t: 'Customer', b: true, bg: '#E2EFDA', al: 'l'};
                const row = SALES[r - 2];
                if (!row) return undefined;
                return {t: row.customer};
              }
              // Column C: spilled sorted unique list
              if (c === 3) {
                if (r === 1) return {t: 'Sorted Unique', b: true, bg: '#D1FAE5', al: 'l', color: '#107C41'};
                if (r >= 2 && r <= 6 && rightShowResults) {
                  const idx = r - 2;
                  if (idx < SORTED_UNIQUE_CUSTOMERS.length) {
                    return {t: SORTED_UNIQUE_CUSTOMERS[idx], color: '#107C41'};
                  }
                }
                return undefined;
              }
              return undefined;
            }} colW={colW2}
            sel={{r1: 2, c1: 3, r2: 2, c2: 3}} active={{r: 2, c: 3}} thumb={0} thumbSize={0.55}
          >
            {/* Spill border on C2:C6 */}
            {rightShowResults ? (
              <Neon x={cellCenter(2, 3, {colW: colW2}).x - colW2(3) / 2} y={cellCenter(2, 3, {colW: colW2}).y - XL.rowH / 2} w={colW2(3)} h={XL.rowH * 5} color={C.green} p={rightSpill} label="Spilled: A→Z" labelBelow />
            ) : null}
            {rClicks.map((c) => { const cp = track(t(c), rPts); return <Ripple key={'r' + c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
            <Cursor x={rCur.x} y={rCur.y} down={rClicks.some((c) => f >= t(c) && f < t(c) + 4)} hide={rightDone} />
          </ExcelApp>
        </Panel>
      </div>

      {/* Comparison badge */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 945, display: 'flex', justifyContent: 'center', opacity: rightShowResults ? rightSpill : 0}}>
        <div style={{background: C.card, border: `2.5px solid ${C.green}`, borderRadius: 12, padding: '12px 32px', boxShadow: `0 0 0 6px ${C.green}22`, display: 'flex', alignItems: 'center', gap: 20}}>
          <span style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.green}}>Master Combo</span>
          <span style={{fontFamily: MONO, fontSize: 22, color: C.text}}>· 100% unique + alphabetically sorted in 1 formula</span>
        </div>
      </div>

      <TopBadge text="Dynamic Sorting ──► =SORT(array, [sort_index], [sort_order]) (1=Asc / -1=Desc)" from={t(42.0)} to={t(60.0)} />
      {!rightShowResults ? <Caption text='Master Combo ──► =SORT(UNIQUE(range)) Generates Auto-Sorted Unique Master Lists' from={t(60.0)} to={t(84.0)} /> : null}
    </Stage>
  );
};
