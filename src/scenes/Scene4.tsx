import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {SALES, UNIQUE_CUSTOMERS, salesCell} from '../data';
import {
  Caption, Cursor, ExcelApp, Neon, Ripple, Stage, TopBadge, XL, clamp, dwell, geo, prog, sec, track, typed, cellCenter,
} from '../kit';

// SC04: Legacy "Remove Duplicates" (click ribbon icon) vs Dynamic UNIQUE#.
// Left: click Data → Remove Duplicates icon → static list. New row added → fails to update (red).
// Right: =UNIQUE(B2:B10) → new row added → list expands instantly (green).
const S = START.s4;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 110, 130, 130, 110, 160][c] ?? XL.colW;

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

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const fadeIn = prog(f, t(1.0), 12);

  // LEFT: click "Remove Duplicates" icon in Ribbon (Data tab)
  // The icon is in the HomeRibbon's "Cells > Remove Duplicates" — we simulate a click at 133s
  const leftClickP = prog(f, t(133), 8);
  const leftCleaned = f >= t(134);
  const leftNewRow = f >= t(140);
  const leftFail = leftNewRow ? prog(f, t(141), 12) : 0;

  // RIGHT: type =UNIQUE(B2:B10) at 135s, Enter at 142s, new row at 145s → list expands
  const rightTyped = typed('=UNIQUE(B2:B10)', f, t(135), 1.2);
  const rightDone = f >= t(142);
  const rightSpill = rightDone ? prog(f, t(142.5), 14) : 0;
  const rightNewRow = f >= t(145);
  const rightExpand = rightNewRow ? prog(f, t(145.5), 12) : 0;

  // Cursor (left): goes to ribbon "Remove Duplicates" icon location, clicks
  // The icon is in the Home ribbon, "Cells" group, "Remove Duplicates" — approximate position
  const lIconX = 600; // approximate x of Remove Duplicates icon in ribbon
  const lIconY = geo(1, 0, 1).rowsTop - 50; // in ribbon area
  const lPts = dwell([
    {f: t(132), x: lIconX, y: lIconY},
    {f: t(133), x: lIconX, y: lIconY}, // click
    {f: t(135), x: 900, y: 330},
  ]);
  const lCur = track(f, lPts);
  const lClicks = [133];

  // Cursor (right): formula bar → Enter on F2
  const rF2 = cellCenter(2, 6, {colW});
  const rFbY = geo(1, 0, 1).fbTop + 14;
  const rPts = dwell([
    {f: t(135), x: 200, y: rFbY},
    {f: t(142), x: rF2.x, y: rF2.y},
    {f: t(145), x: 900, y: 330},
  ]);
  const rCur = track(f, rPts);
  const rClicks = [135, 142];

  const scale = 0.62;
  const px = 40;
  const py = 175;
  const pw = XL.W * scale;

  // Static unique list (5 customers) — for left panel after Remove Duplicates
  const staticUniqueList = UNIQUE_CUSTOMERS;

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: C.bg, opacity: 1 - fadeIn, pointerEvents: 'none'}} />

      {/* LEFT panel: Legacy Remove Duplicates */}
      <div style={{position: 'absolute', left: px, top: py, opacity: fadeIn}}>
        <Panel x={0} y={0} scale={scale} title='Legacy: "Remove Duplicates"' titleColor={leftFail > 0.3 ? C.red : C.amber}>
          <ExcelApp
            file="tbl_Sales.xlsx" nameBox="A1" formula=""
            cell={(r, c) => {
              // After Remove Duplicates click: show static unique list (frozen, won't update)
              if (leftCleaned && c === 2) {
                if (r === 1) return {t: 'Customer (Static)', b: true, bg: '#FEE2E2', al: 'l', color: '#991B1B'};
                const idx = r - 2;
                if (idx < staticUniqueList.length) {
                  return {t: staticUniqueList[idx], color: '#991B1B'};
                }
                // New row added but list doesn't update → red highlight on missing
                if (leftNewRow && r === staticUniqueList.length + 2) {
                  return {t: '?? missing', bg: '#FEE2E2', color: '#991B1B'};
                }
                return undefined;
              }
              return salesCell(r, c) as any;
            }} colW={colW}
            sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}} thumb={0} thumbSize={0.55}
          >
            {/* Click ripple on ribbon icon */}
            {lClicks.map((c) => { const cp = track(t(c), lPts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.amber} />; })}
            <Cursor x={lCur.x} y={lCur.y} down={lClicks.some((c) => f >= t(c) && f < t(c) + 4)} hide={f > t(136)} />
            {/* Red X on the list when new row fails to appear */}
            {leftFail > 0.1 ? (
              <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 28}}>
                <circle cx={cellCenter(staticUniqueList.length + 2, 2, {colW}).x} cy={cellCenter(staticUniqueList.length + 2, 2, {colW}).y} r={16 * leftFail} fill="none" stroke={C.red} strokeWidth={3} opacity={leftFail} />
                <line x1={cellCenter(staticUniqueList.length + 2, 2, {colW}).x - 10} y1={cellCenter(staticUniqueList.length + 2, 2, {colW}).y - 10} x2={cellCenter(staticUniqueList.length + 2, 2, {colW}).x + 10} y2={cellCenter(staticUniqueList.length + 2, 2, {colW}).y + 10} stroke={C.red} strokeWidth={3} opacity={leftFail} />
                <line x1={cellCenter(staticUniqueList.length + 2, 2, {colW}).x + 10} y1={cellCenter(staticUniqueList.length + 2, 2, {colW}).y - 10} x2={cellCenter(staticUniqueList.length + 2, 2, {colW}).x - 10} y2={cellCenter(staticUniqueList.length + 2, 2, {colW}).y + 10} stroke={C.red} strokeWidth={3} opacity={leftFail} />
              </svg>
            ) : null}
          </ExcelApp>
        </Panel>
        <div style={{marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, opacity: leftFail > 0.3 ? leftFail : (leftCleaned ? 0.7 : 0)}}>
          <span style={{fontFamily: MONO, fontSize: 16, color: leftFail > 0.3 ? C.red : C.amber}}>
            {leftFail > 0.3 ? '✗ New row added — list does NOT update (static!)' : 'Clicked "Remove Duplicates" — list is now frozen'}
          </span>
        </div>
      </div>

      {/* RIGHT panel: Dynamic UNIQUE# */}
      <div style={{position: 'absolute', left: px + pw + 30, top: py, opacity: fadeIn}}>
        <Panel x={0} y={0} scale={scale} title="M365: =UNIQUE(B2:B10)#" titleColor={C.green}>
          <ExcelApp
            file="tbl_Sales.xlsx" nameBox="F2" formula={rightTyped} fbEdit={f >= t(135) && f < t(142.5)}
            cell={(r, c) => {
              if (c === 6) {
                if (r === 1) return {t: 'Dynamic Unique', b: true, bg: '#D1FAE5', al: 'l', color: '#107C41'};
                if (rightSpill > 0.05) {
                  const list = rightNewRow ? [...UNIQUE_CUSTOMERS, 'Fatma'] : UNIQUE_CUSTOMERS;
                  const idx = r - 2;
                  if (idx < list.length) {
                    const isNew = rightNewRow && idx === list.length - 1;
                    return {t: list[idx], color: '#107C41', bg: isNew ? '#10B98122' : undefined};
                  }
                }
                return undefined;
              }
              return salesCell(r, c) as any;
            }} colW={colW}
            sel={{r1: 2, c1: 6, r2: 2, c2: 6}} active={{r: 2, c: 6}} thumb={0} thumbSize={0.55}
          >
            {/* Spill border */}
            {rightSpill > 0.05 ? (
              <Neon x={cellCenter(2, 6, {colW}).x - colW(6) / 2} y={cellCenter(2, 6, {colW}).y - XL.rowH / 2} w={colW(6)} h={XL.rowH * (rightNewRow ? 6 : 5)} color={C.green} p={rightSpill} label={rightNewRow ? 'Expanded: +1 row' : 'Spill Range'} labelBelow />
            ) : null}
            {rClicks.map((c) => { const cp = track(t(c), rPts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.green} />; })}
            <Cursor x={rCur.x} y={rCur.y} down={rClicks.some((c) => f >= t(c) && f < t(c) + 4)} hide={f > t(146)} />
          </ExcelApp>
        </Panel>
        <div style={{marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, opacity: rightExpand > 0.3 ? rightExpand : (rightDone ? 0.7 : 0)}}>
          <span style={{fontFamily: MONO, fontSize: 16, color: rightExpand > 0.3 ? C.green : (rightDone ? C.muted : C.muted)}}>
            {rightExpand > 0.3 ? '✓ New row added — list EXPANDED automatically in <1ms' : (rightDone ? 'Formula typed — waiting for new data...' : 'Typing =UNIQUE(B2:B10)...')}
          </span>
        </div>
      </div>

      <TopBadge text='Static Trap ──► Legacy "Remove Duplicates" Destroys Data Lineage & Fails on Refresh' from={t(131.0)} to={t(145.0)} />
      {rightExpand < 0.3 ? <Caption text='Live Dynamic Arrays ──► UNIQUE# Automatically Responds to New Data Rows Instantly' from={t(145.0)} to={t(169.0)} tone="ok" /> : null}
    </Stage>
  );
};
