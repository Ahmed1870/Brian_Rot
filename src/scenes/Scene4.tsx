import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {
  CAM0, Caption, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, geo, prog, sec,
} from '../kit';

// SC04: Decision Matrix — VSTACK vs Power Query vs Data Model.
// Single Excel window with 3 comparison cards overlaid (no split screen).
const S = START.s4;
const t = (g: number) => sec(g - S);

const TOOLS = [
  {
    name: 'VSTACK / HSTACK',
    color: C.blue,
    use: 'In-Sheet',
    desc: 'Instant array stacking within same workbook',
    best: 'Quick merges, live dynamic arrays',
    x: 100, y: 200, w: 480, at: 131.0,
  },
  {
    name: 'Power Query',
    color: C.amber,
    use: 'ETL Engine',
    desc: 'External file & folder ingestion + cleaning',
    best: 'Multi-file consolidation, refreshable',
    x: 640, y: 200, w: 480, at: 135.0,
  },
  {
    name: 'Data Model',
    color: C.green,
    use: 'BI Architecture',
    desc: 'Multi-table relational modeling (Power Pivot)',
    best: 'Massive datasets, PivotTable/Power BI',
    x: 1180, y: 200, w: 480, at: 139.0,
  },
];

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 760, fy: 300, z: 0.85}, prog(f, t(2), 30));

  // Each tool card appears sequentially
  const toolPs = TOOLS.map((tool) => prog(f, t(tool.at), 14) * (1 - prog(f, t(170), 12)));

  // Decision matrix pulse (all 3 active)
  const synergyP = prog(f, t(145), 14) * (1 - prog(f, t(170), 12));

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="DecisionMatrix.xlsx" nameBox="A1" formula="" tab="Data"
          cell={() => undefined}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* 3 tool cards overlaid on the grid */}
          {TOOLS.map((tool, i) => {
            const p = toolPs[i];
            if (p <= 0.01) return null;
            return (
              <div key={i} style={{
                position: 'absolute', left: tool.x, top: tool.y, width: tool.w,
                background: 'rgba(30,41,59,0.95)', border: `2.5px solid ${tool.color}`,
                borderRadius: 14, padding: '20px 24px',
                boxShadow: `0 8px 30px rgba(2,6,23,0.6), 0 0 ${30 * p}px ${tool.color}44`,
                opacity: p, zIndex: 35, transform: `translateY(${(1 - p) * 30}px) scale(${0.95 + 0.05 * p})`,
              }}>
                {/* Header */}
                <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
                  <div style={{width: 16, height: 16, borderRadius: 8, background: tool.color, boxShadow: `0 0 12px ${tool.color}`}} />
                  <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: tool.color}}>{tool.name}</span>
                </div>
                {/* Use case badge */}
                <div style={{display: 'inline-block', background: `${tool.color}22`, border: `1.5px solid ${tool.color}`, borderRadius: 6, padding: '4px 12px', fontFamily: MONO, fontSize: 14, fontWeight: 700, color: tool.color, marginBottom: 10}}>
                  {tool.use}
                </div>
                {/* Description */}
                <div style={{fontFamily: MONO, fontSize: 16, color: C.text, marginBottom: 8, lineHeight: 1.4}}>{tool.desc}</div>
                {/* Best for */}
                <div style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginTop: 8}}>
                  <span style={{color: tool.color, fontWeight: 700}}>Best for:</span> {tool.best}
                </div>
              </div>
            );
          })}

          {/* Synergy pulse — connecting lines when all 3 are active */}
          {synergyP > 0.01 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 30}}>
              <line x1={580} y1={320} x2={640} y2={320} stroke={C.blue} strokeWidth={3} strokeDasharray="6 3" opacity={synergyP * 0.7} />
              <line x1={1120} y1={320} x2={1180} y2={320} stroke={C.amber} strokeWidth={3} strokeDasharray="6 3" opacity={synergyP * 0.7} />
              <text x={610} y={310} textAnchor="middle" fill={C.text} fontFamily="Consolas, monospace" fontSize={14} fontWeight={700} opacity={synergyP}>→</text>
              <text x={1150} y={310} textAnchor="middle" fill={C.text} fontFamily="Consolas, monospace" fontSize={14} fontWeight={700} opacity={synergyP}>→</text>
            </svg>
          ) : null}
        </ExcelApp>
      </ExcelWindow>

      <TopBadge text="Integration Decision Matrix ──► VSTACK (In-Sheet) vs Power Query (ETL) vs Data Model (BI)" from={t(131.0)} to={t(150.0)} />
      {synergyP > 0.01 ? <Caption text="Enterprise Synergy ──► Choose the Right Consolidation Engine Based on Data Volume & Refresh Needs" from={t(150.0)} to={t(169.0)} tone="ok" /> : null}
    </Stage>
  );
};
