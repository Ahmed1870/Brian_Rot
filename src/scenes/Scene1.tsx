import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {CUSTOMERS, customerCell} from '../data';
import {
  CAM0, Caption, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, geo, prog, sec,
} from '../kit';

// SC01: XLOOKUP Syntax Deconstruction & Bidirectional Freedom.
// Anchors (s): 1.5 lit blocks | 2.5 lookup_value | 3.5 lookup_array | 4.5 return_array
//              5.5 if_not_found | 6.5 match_mode | 7.5 search_mode | 8.0 bidirectional arrows
const S = START.s1;
const t = (g: number) => sec(g - S);

const custColW = (c: number) => [0, 120, 200, 110, 160][c] ?? XL.colW;

const cc = (r: number, c: number) => {
  const g = geo(1, 0, 1);
  let x = g.rowW;
  for (let i = 1; i < c; i++) x += custColW(i);
  return {x: x + custColW(c) / 2, y: g.rowsTop + (r - 1) * XL.rowH + XL.rowH / 2};
};

const ARGS = [
  {label: 'lookup_value',  value: 'A2',           color: C.amber,  at: 2.5},
  {label: 'lookup_array',  value: 'C2:C100',      color: C.blue,   at: 3.5},
  {label: 'return_array',  value: 'A2:A100',     color: C.green,  at: 4.5},
  {label: 'if_not_found',  value: '"Not Found"', color: C.purple, at: 5.5},
  {label: 'match_mode',    value: '0',           color: C.text,   at: 6.5},
  {label: 'search_mode',   value: '-1',          color: C.cyan,   at: 7.5},
];

// Formula panel appears as a prominent code console at the bottom of the screen.
const FormulaPanel: React.FC = () => {
  const f = useCurrentFrame();
  const panelP = prog(f, t(1.5), 14);
  if (panelP < 0.01) return null;
  return (
    <div style={{
      position: 'absolute', left: 40, right: 40, bottom: 16, height: 130,
      background: 'rgba(11,18,34,0.95)',
      border: `2px solid ${C.border}`,
      borderRadius: 14,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
      opacity: panelP,
      transform: `translateY(${(1 - panelP) * 30}px)`,
      boxShadow: `0 -10px 40px rgba(2,6,23,0.6)`,
      zIndex: 70,
      paddingTop: 10, paddingBottom: 8,
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', justifyContent: 'center'}}>
        <span style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.text}}>=XLOOKUP(</span>
        {ARGS.map((a, i) => {
          const p = prog(f, t(a.at), 12);
          return (
            <React.Fragment key={i}>
              {i > 0 ? <span style={{fontFamily: MONO, fontSize: 28, color: C.muted}}>,</span> : null}
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: 0.25 + 0.75 * p, transform: `scale(${0.88 + 0.12 * p})`}}>
                <div style={{
                  minWidth: 130, padding: '8px 16px', borderRadius: 10,
                  background: `${a.color}${p > 0.1 ? '22' : '00'}`,
                  border: `2.5px solid ${a.color}`,
                  boxShadow: p > 0.1 ? `0 0 ${20 * p}px ${a.color}88, inset 0 0 ${8 * p}px ${a.color}33` : 'none',
                  fontFamily: MONO, fontSize: 22, fontWeight: 700, color: p > 0.1 ? C.text : C.muted, textAlign: 'center',
                }}>{a.value}</div>
                <div style={{fontFamily: MONO, fontSize: 14, color: a.color, opacity: 0.6 + 0.4 * p, fontWeight: 700}}>{a.label}</div>
              </div>
            </React.Fragment>
          );
        })}
        <span style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.text}}>)</span>
      </div>
    </div>
  );
};

/** Bidirectional scan arrows proving array independence. */
const BidirArrows: React.FC<{p: number}> = ({p}) => {
  if (p <= 0) return null;
  const colA = cc(2, 1);
  const colC = cc(2, 3);
  const y = cc(2, 1).y;
  const leftEnd = colC.x - (colC.x - colA.x) * p;
  const rightEnd = colA.x + (colC.x - colA.x) * p;
  return (
    <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 25}}>
      <line x1={colC.x} y1={y} x2={leftEnd} y2={y} stroke={C.blue} strokeWidth={4} strokeDasharray="8 5" opacity={0.9} />
      <polygon points={`${leftEnd - 14},${y - 9} ${leftEnd},${y} ${leftEnd - 14},${y + 9}`} fill={C.blue} opacity={0.95} />
      <line x1={colA.x} y1={y - 18} x2={rightEnd} y2={y - 18} stroke={C.green} strokeWidth={4} strokeDasharray="8 5" opacity={0.9} />
      <polygon points={`${rightEnd + 14},${y - 27} ${rightEnd},${y - 18} ${rightEnd + 14},${y - 9}`} fill={C.green} opacity={0.95} />
      <text x={(colA.x + colC.x) / 2} y={y - 38} textAnchor="middle" fill={C.green} fontFamily="Consolas, monospace" fontSize={18} fontWeight={700} opacity={p}>↔ Bidirectional Freedom — Search Left or Right</text>
    </svg>
  );
};

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  // Slightly pull camera up to leave room for the formula panel at the bottom.
  const cam = camLerp(CAM0, {fx: 420, fy: 250, z: 1.12}, prog(f, t(2), 40));

  const bidirP = prog(f, t(8.0), 24);
  const a2Neon = prog(f, t(2.5), 12) * (1 - prog(f, t(40), 12));
  const colANeon = prog(f, t(4.5), 12) * 0.45 * (1 - prog(f, t(40), 12));
  const colCNeon = prog(f, t(3.5), 12) * 0.45 * (1 - prog(f, t(40), 12));

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="tbl_Customers.xlsx" nameBox="A2" formula='=XLOOKUP(A2, C2:C100, A2:A100, "Not Found", 0, -1)' fbEdit={false}
          cell={(r, c) => customerCell(r, c) as any} colW={custColW}
          sel={{r1: 2, c1: 1, r2: 2, c2: 1}} active={{r: 2, c: 1}} thumb={0} thumbSize={0.55}
        >
          <Neon x={cc(2, 1).x - custColW(1) / 2} y={cc(2, 1).y - XL.rowH / 2} w={custColW(1)} h={XL.rowH} color={C.amber} p={a2Neon} label="lookup_value" labelBelow />
          <Neon x={cc(1, 1).x - custColW(1) / 2} y={geo(1, 0, 1).colTop} w={custColW(1)} h={geo(1, 0, 1).rowsBottom - geo(1, 0, 1).colTop} color={C.green} p={colANeon} label="return_array (left OK!)" labelBelow />
          <Neon x={cc(1, 3).x - custColW(3) / 2} y={geo(1, 0, 1).colTop} w={custColW(3)} h={geo(1, 0, 1).rowsBottom - geo(1, 0, 1).colTop} color={C.blue} p={colCNeon} label="lookup_array (col 3)" labelBelow />
          <BidirArrows p={bidirP} />
        </ExcelApp>
      </ExcelWindow>
      <FormulaPanel />
      <TopBadge text="الدالة الحديثة الشاملة | XLOOKUP Architecture & Dynamic Features" from={t(2.0)} to={t(18.0)} />
      <Caption text="XLOOKUP Syntax ──► 6 Parameters · 3 Mandatory + 3 Optional · Bidirectional Freedom" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
