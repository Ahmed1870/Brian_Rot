import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {DATA_MODEL_TABLES} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, clamp, dwell, geo, prog, sec, track,
} from '../kit';

// SC03: Merge Queries + Data Model — single Excel window with Data Model diagram overlay.
// Phase 1 (85-100s): Merge Queries dialog linking Sales ↔ Products via SKU.
// Phase 2 (100-130s): Data Model Diagram View — 1-to-Many relationships (purple arrows).
const S = START.s3;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 120, 200, 100][c] ?? XL.colW;

/** Data Model Diagram View overlay (Power Pivot) — receives frame as prop. */
const DataModelDiagramFixed: React.FC<{f: number; p: number; relP: number; compressP: number}> = ({f, p, relP, compressP}) => {
  if (p <= 0.01) return null;
  return (
    <div style={{
      position: 'absolute', left: 300, top: 130, width: 980, height: 620,
      background: '#1E293B', border: `2px solid ${C.purple}`, boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 30px ${C.purple}44`,
      borderRadius: 7, opacity: p, zIndex: 40, overflow: 'hidden', transform: `scale(${0.95 + 0.05 * p})`,
    }}>
      <div style={{height: 32, background: C.purple, display: 'flex', alignItems: 'center', paddingLeft: 12}}>
        <span style={{fontFamily: 'Segoe UI, sans-serif', fontSize: 12.5, color: '#fff', fontWeight: 600}}>Data Model — Diagram View (Power Pivot)</span>
      </div>
      <div style={{position: 'relative', width: '100%', height: 'calc(100% - 32px)'}}>
        {DATA_MODEL_TABLES.map((tbl, i) => (
          <div key={i} style={{
            position: 'absolute', left: tbl.x, top: tbl.y, width: 200,
            background: '#0F172A', border: `2px solid ${tbl.color}`, borderRadius: 8, padding: '12px 14px',
            boxShadow: `0 4px 16px rgba(0,0,0,0.4), 0 0 20px ${tbl.color}44`,
          }}>
            <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: tbl.color, marginBottom: 6}}>{tbl.name}</div>
            <div style={{fontFamily: MONO, fontSize: 12, color: C.muted, marginBottom: 4}}>Key: {tbl.key}</div>
            <div style={{fontFamily: MONO, fontSize: 12, color: C.text}}>{tbl.rows.toLocaleString()} rows</div>
            <div style={{position: 'absolute', right: -8, top: '50%', width: 16, height: 16, borderRadius: 8, background: tbl.color, boxShadow: `0 0 10px ${tbl.color}`}} />
          </div>
        ))}
        <svg width={980} height={588} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
          <defs>
            <marker id="rel-arrow-f" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
              <path d="M0,0 L12,6 L0,12 L4,6 Z" fill={C.purple} />
            </marker>
          </defs>
          <line x1={400} y1={240} x2={700} y2={300} stroke={C.purple} strokeWidth={3} strokeDasharray="8 4" opacity={relP * 0.9} markerEnd={relP > 0.5 ? 'url(#rel-arrow-f)' : undefined} />
          <text x={520} y={260} fill={C.purple} fontFamily="Consolas, monospace" fontSize={13} fontWeight={700} opacity={relP}>1:N</text>
          <line x1={400} y1={440} x2={700} y2={340} stroke={C.purple} strokeWidth={3} strokeDasharray="8 4" opacity={relP * 0.9} markerEnd={relP > 0.5 ? 'url(#rel-arrow-f)' : undefined} />
          <text x={520} y={420} fill={C.purple} fontFamily="Consolas, monospace" fontSize={13} fontWeight={700} opacity={relP}>1:N</text>
        </svg>
        {compressP > 0.01 ? (
          <div style={{
            position: 'absolute', right: 20, bottom: 20, background: `${C.green}22`, border: `2px solid ${C.green}`,
            borderRadius: 8, padding: '10px 16px', opacity: compressP, transform: `scale(${0.9 + 0.1 * compressP})`,
          }}>
            <div style={{fontFamily: MONO, fontSize: 14, fontWeight: 700, color: C.green, marginBottom: 4}}>File Size Reduction</div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 6}}>
              <span style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.green}}>-90%</span>
              <span style={{fontFamily: MONO, fontSize: 14, color: C.text}}>vs VLOOKUP duplicates</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 280, z: 1.0}, prog(f, t(2), 30));

  // Phase 1: Merge Queries dialog (85-100s)
  const mergeP = prog(f, t(86), 14) * (1 - prog(f, t(100), 8));
  // Phase 2: Data Model diagram (100-130s)
  const dmP = prog(f, t(100), 12) * (1 - prog(f, t(130), 12));
  const relP = prog(f, t(105), 16) * (1 - prog(f, t(130), 12));
  const compressP = prog(f, t(115), 14) * (1 - prog(f, t(130), 12));

  // Cursor
  const dataTabX = 580;
  const ribbonY = geo(1, 0, 1).rowsTop - 50;
  const pts = dwell([
    {f: t(86), x: dataTabX, y: ribbonY},
    {f: t(100), x: dataTabX, y: ribbonY},
    {f: t(102), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [86, 100];
  const curHide = f > t(103);

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="DataModel.xlsx" nameBox="A1" formula="" tab="Data"
          cell={() => undefined}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Merge Queries dialog (phase 1) */}
          {mergeP > 0.01 ? (
            <div style={{
              position: 'absolute', left: 400, top: 200, width: 600, height: 320,
              background: '#fff', border: `2px solid ${C.blue}`, boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 30px ${C.blue}44`,
              borderRadius: 8, opacity: mergeP, zIndex: 40, padding: '20px 24px', transform: `scale(${0.95 + 0.05 * mergeP})`,
            }}>
              <div style={{fontFamily: 'Segoe UI, sans-serif', fontSize: 14, fontWeight: 700, color: '#1B1B1B', marginBottom: 16}}>Merge Queries</div>
              <div style={{display: 'flex', gap: 20, alignItems: 'center', marginBottom: 16}}>
                <div style={{flex: 1, background: '#F3F3F3', border: '1px solid #CFCFCF', borderRadius: 4, padding: '12px'}}>
                  <div style={{fontFamily: 'Segoe UI, sans-serif', fontSize: 12, fontWeight: 700, color: '#1B1B1B', marginBottom: 6}}>Sales Table</div>
                  <div style={{fontFamily: 'Consolas, monospace', fontSize: 13, color: C.blue, fontWeight: 700}}>SKU: PRD-001</div>
                </div>
                <svg width={30} height={20} viewBox="0 0 30 20"><path d="M2 10h22M22 4l6 6-6 6" fill="none" stroke={C.purple} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div style={{flex: 1, background: '#F3F3F3', border: '1px solid #CFCFCF', borderRadius: 4, padding: '12px'}}>
                  <div style={{fontFamily: 'Segoe UI, sans-serif', fontSize: 12, fontWeight: 700, color: '#1B1B1B', marginBottom: 6}}>Products Table</div>
                  <div style={{fontFamily: 'Consolas, monospace', fontSize: 13, color: C.green, fontWeight: 700}}>SKU: PRD-001</div>
                </div>
              </div>
              <div style={{fontFamily: 'Segoe UI, sans-serif', fontSize: 13, color: '#5E5E5E'}}>Join via SKU key column (replaces XLOOKUP)</div>
            </div>
          ) : null}
          {/* Data Model diagram (phase 2) */}
          <DataModelDiagramFixed f={f} p={dmP} relP={relP} compressP={compressP} />
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.purple} />; })}
          <Cursor x={cur.x} y={cur.y} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      <TopBadge text="Power Query Merge & Data Model ──► Relational Architecture" from={t(86.0)} to={t(110.0)} />
      {compressP > 0.01 ? <Caption text="Data Model Architecture ──► Creates 1-to-Many Relationships Across Tables without VLOOKUP Duplication" from={t(110.0)} to={t(129.0)} /> : null}
      {compressP < 0.01 && mergeP > 0.01 ? <Caption text="Power Query Merge ──► Joins Related Tables via Key Columns (In-Engine Lookup Replacement)" from={t(86.0)} to={t(100.0)} /> : null}
    </Stage>
  );
};
