import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {CROSSTAB, CROSSTAB_MONTHS, FLAT_TABLE, crosstabCell, flatCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track,
} from '../kit';

// SC02: Power Query — right-click Product ID → Unpivot Other Columns → columns collapse into Attribute/Value.
// Single Excel window with Power Query editor overlay simulation.
const S = START.s2;
const t = (g: number) => sec(g - S);

const pqColW = (c: number) => [0, 160, 100, 100, 100, 100][c] ?? XL.colW;

/** Right-click context menu overlay. */
const ContextMenu: React.FC<{x: number; y: number; p: number}> = ({x, y, p}) => {
  if (p <= 0.01) return null;
  const items = [
    {label: 'Rename', dim: true},
    {label: 'Duplicate Column', dim: true},
    {label: 'Remove', dim: true},
    {label: '—', sep: true},
    {label: 'Unpivot Columns', arrow: true},
    {label: 'Unpivot Other Columns', hot: true, bold: true},
    {label: '—', sep: true},
    {label: 'Change Type', arrow: true, dim: true},
  ];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 240, background: '#fff', border: '1px solid #CFCFCF', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', opacity: p, zIndex: 45, padding: '4px 0', transform: `scale(${0.9 + 0.1 * p})`}}>
      {items.map((it, i) => it.sep ? (
        <div key={i} style={{height: 1, background: '#E5E5E5', margin: '4px 0'}} />
      ) : (
        <div key={i} style={{
          height: 28, display: 'flex', alignItems: 'center', padding: '0 14px',
          fontFamily: 'Segoe UI, Open Sans, sans-serif', fontSize: 13, color: it.dim ? '#888' : '#1B1B1B',
          background: it.hot ? `${C.purple}22` : 'transparent',
          fontWeight: it.bold ? 700 : 400,
          borderLeft: it.hot ? `3px solid ${C.purple}` : '3px solid transparent',
        }}>
          <span style={{flex: 1}}>{it.label}</span>
          {it.arrow ? <svg width={8} height={10} viewBox="0 0 8 10"><path d="M2 1l4 4-4 4" fill="none" stroke="#444" strokeWidth={1.3} /></svg> : null}
        </div>
      ))}
    </div>
  );
};

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 280, z: 1.05}, prog(f, t(2), 30));

  // Phase 1 (40-55s): crosstab in Excel, highlight Product ID (purple), right-click → context menu
  // Phase 2 (55-70s): click "Unpivot Other Columns" → columns collapse, flat table appears
  // Phase 3 (70-85s): flat table stable
  const menuP = prog(f, t(50), 10) * (1 - prog(f, t(55), 8));
  const collapseP = prog(f, t(55), 18);
  const showFlat = collapseP > 0.5;
  const flatFill = Math.floor((collapseP - 0.5) * 2 * FLAT_TABLE.length);

  // Cursor: right-click on Product ID header
  const prodIdHeader = cellCenter(1, 1, {colW: pqColW});
  const pts = dwell([
    {f: t(41), x: 900, y: 330},
    {f: t(48), x: prodIdHeader.x, y: prodIdHeader.y},
    {f: t(55), x: prodIdHeader.x + 120, y: prodIdHeader.y + 130},  // click "Unpivot Other Columns"
    {f: t(57), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [48, 55];
  const curHide = f > t(58);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Unpivoting.xlsx" nameBox="A1" formula="" tab="Data"
          cell={(r, c) => {
            if (!showFlat) return crosstabCell(r, c) as any;
            return flatCell(r, c, flatFill) as any;
          }} colW={pqColW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Highlight Product ID column (purple) */}
          <Neon x={cellCenter(1, 1, {colW: pqColW}).x - pqColW(1) / 2} y={geo(1, 0, 1).rowsTop} w={pqColW(1)} h={XL.rowH * 5} color={C.purple} p={prog(f, t(48), 10) * (1 - prog(f, t(85), 12))} label="Key column (fixed)" labelBelow />
          {/* Red border on crosstab (fading) */}
          {!showFlat ? (
            <Neon x={cellCenter(1, 2, {colW: pqColW}).x - pqColW(2) / 2} y={geo(1, 0, 1).rowsTop} w={pqColW(2) + pqColW(3) + pqColW(4) + pqColW(5)} h={XL.rowH * 5} color={C.red} p={0.2} label="Columns to unpivot" labelBelow />
          ) : null}
          {/* Green border on flat table (appearing) */}
          {showFlat ? (
            <Neon x={cellCenter(1, 2, {colW: pqColW}).x - pqColW(2) / 2} y={geo(1, 0, 1).rowsTop} w={pqColW(2) + pqColW(3)} h={XL.rowH * (FLAT_TABLE.length + 1)} color={C.green} p={collapseP * 0.4} label="Attribute + Value" labelBelow />
          ) : null}
          {/* Context menu */}
          <ContextMenu x={prodIdHeader.x + 20} y={prodIdHeader.y + 20} p={menuP} />
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={c === 55 ? C.green : C.purple} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      <TopBadge text="Power Query Unpivoting ──► Right-Click Key Column → Select Unpivot Other Columns" from={t(42.0)} to={t(60.0)} />
      {showFlat ? <Caption text="Dynamic ETL Pipeline ──► Automatically Normalizes New Monthly Columns in Future Refresh" from={t(60.0)} to={t(84.0)} tone="ok" /> : null}
    </Stage>
  );
};
