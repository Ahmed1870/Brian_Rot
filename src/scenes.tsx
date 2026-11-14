import React from 'react';
import {A} from './anchors';
import {ar, mono, ui} from './fonts';
import {Chip, Cursor, Intelli, Logo, P, PPB, PPW, PPWin, PP_COLS, PPCol, PPMeasure, Ring, Stage, Tag, TopBadge, clamp, fade, fmt, kf, pls, ppGeo, ppRow, useT} from './kit';
import {C, FILE, M, Z} from './theme';

const W8 = '#F8FAFC';
const X2 = '#1B6FD1';
const pt = (t: number, k: [number, {x: number; y: number}][]) => ({
  x: kf(t, k.map((q) => [q[0], q[1].x] as [number, number])),
  y: kf(t, k.map((q) => [q[0], q[1].y] as [number, number])),
});
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.floor(s.length * clamp((t - a) / (b - a))));
const BR = ['Cairo', 'Alex', 'Giza', 'Mansoura', 'Aswan'];
const BR_SALES = [929500000, 632500000, 552500000, 379500000, 292000000];
const BR_QTY = [108000, 74000, 64500, 44000, 34500];
const BR_ORD = [14000, 9500, 8200, 5600, 4500];
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
const TOTAL = sum(BR_SALES), PRIOR = 2395000000;
const baseRow = (i: number) => {
  const r = ppRow(i);
  return [r.id, r.date, r.br, r.prod, r.qty, fmt(r.sales), fmt(r.cost)];
};
const mkRows = (n: number, extra: (i: number) => string[]) => Array.from({length: n}, (_, i) => [...baseRow(i), ...extra(i)]);
const cxOf = (cols: PPCol[], c: number) => cols.slice(0, c).reduce((a, b) => a + b.w, 0) + cols[c].w / 2;
const G0 = ppGeo(PPW.h, 0), G1 = ppGeo(PPW.h, 92);
const headP = (cols: PPCol[], c: number) => P(cxOf(cols, c), G0.top + 12, PPW);
const fbar = () => P(330, M.title + M.tabs + M.ribbon + 14, PPW);
const calcP = (i: number) => P(Math.floor(i / 2) * 200 + 100, G1.calcTop + 4 + (i % 2) * 44 + 22, PPW);
const btn = (k: string) => P(PPB[k].x + PPB[k].w / 2, PPB[k].y + PPB[k].h / 2, PPW);
const tabP = (i: number) => P(8 + i * 96 + 46, G0.tabsY + 13, PPW);
const Hud: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 4, top: -24}}><Logo s={136} /></div>
    {children}
  </div>
);
const Note: React.FC<{text: string; c: string; a: number; y?: number; x?: number}> = ({text, c, a, y = 760, x = 700}) => <Chip x={x} y={y} center text={text} c={c} a={a} size={26} />;
const Card: React.FC<{y: number; h: number; c: string; a: number; title?: string; children?: React.ReactNode}> = ({y, h, c, a, title, children}) => (
  <div style={{position: 'absolute', left: 1400, top: y, width: 480, height: h, opacity: a, transform: `translateY(${(1 - a) * 24}px)`, borderRadius: 22, background: 'rgba(15,23,42,.95)', border: `3px solid ${c}`, boxShadow: `0 0 24px ${c}55`, fontFamily: ar, color: W8, padding: '14px 22px', boxSizing: 'border-box', direction: 'ltr', overflow: 'hidden'}}>
    {title && <div style={{fontSize: 24, fontWeight: 700, color: c, marginBottom: 8}}>{title}</div>}
    {children}
  </div>
);
const Bar: React.FC<{p: number; c: string; label: string; right?: string}> = ({p, c, label, right}) => (
  <div style={{marginTop: 12}}>
    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 20, color: '#CBD5E1'}}><span>{label}</span><span style={{fontFamily: mono, fontWeight: 700, color: c}}>{right}</span></div>
    <div style={{height: 22, borderRadius: 11, background: '#334155', marginTop: 4, overflow: 'hidden'}}><div style={{width: `${clamp(p) * 100}%`, height: 22, background: c, boxShadow: `0 0 12px ${c}`}} /></div>
  </div>
);
const Gauge: React.FC<{p: number; c: string}> = ({p, c}) => {
  const ang = (180 + 180 * clamp(p)) * (Math.PI / 180);
  return (
    <svg width={436} height={190} viewBox="0 0 280 150" style={{display: 'block', margin: '0 auto'}}>
      <path d="M 30 125 A 110 110 0 0 1 250 125" fill="none" stroke="#334155" strokeWidth={22} strokeLinecap="round" />
      <path d="M 30 125 A 110 110 0 0 1 250 125" fill="none" stroke={c} strokeWidth={22} strokeLinecap="round" strokeDasharray={`${clamp(p) * 346} 400`} />
      <line x1={140} y1={125} x2={140 + 88 * Math.cos(ang)} y2={125 + 88 * Math.sin(ang)} stroke="#F8FAFC" strokeWidth={6} strokeLinecap="round" />
      <circle cx={140} cy={125} r={11} fill="#F8FAFC" />
    </svg>
  );
};
const FIELDS: [string, boolean][] = [['OrderID', false], ['OrderDate', false], ['Branch', false], ['Product', false], ['Quantity', true], ['SalesAmount', true], ['TotalCost', true]];
const FP = {x: 1400, y: 100, w: 480, h: 888};
const VAL_X = FP.x + 350, VAL_Y = FP.y + 700;
const chk = (on: boolean) => <span style={{display: 'inline-block', width: 18, height: 18, border: '1.5px solid #555', background: '#fff', color: X2, fontSize: 15, lineHeight: '16px', textAlign: 'center'}}>{on ? '✓' : ''}</span>;
const FieldsPane: React.FC<{a: number; checked: string[]; measures: string[]; values: {l: string; c: string; fx?: boolean}[]}> = ({a, checked, measures, values}) => (
  <div style={{position: 'absolute', left: FP.x, top: FP.y, width: FP.w, height: FP.h, opacity: a, background: '#F3F3F3', borderRadius: 10, border: '2px solid #D1D1D1', fontFamily: ui, color: '#222', boxShadow: '0 30px 80px rgba(0,0,0,.55)', direction: 'ltr', overflow: 'hidden'}}>
    <div style={{height: 46, background: '#fff', lineHeight: '46px', padding: '0 18px', fontSize: 22, fontWeight: 700}}>PivotTable Fields <span style={{float: 'right', fontSize: 18, color: '#777'}}>▾ ✕</span></div>
    <div style={{padding: '8px 18px 0', fontSize: 17, color: '#555'}}>Choose fields to add to report:</div>
    <div style={{margin: '8px 18px', height: 34, border: '1px solid #BBB', background: '#fff', lineHeight: '32px', paddingLeft: 10, fontSize: 17, color: '#999'}}>Search</div>
    <div style={{padding: '0 18px', fontSize: 19, fontWeight: 700, lineHeight: '30px'}}>▾ Fact_Sales</div>
    {FIELDS.map(([n, num], i) => (
      <div key={n} style={{position: 'absolute', left: 18, top: 176 + i * 30, height: 30, lineHeight: '30px', fontSize: 19, display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap'}}>
        {chk(checked.includes(n))}<span style={{width: 22, color: '#555', fontWeight: 700}}>{num ? 'Σ' : ''}</span>{n}
      </div>
    ))}
    {measures.map((n, i) => (
      <div key={n} style={{position: 'absolute', left: 18, top: 176 + (FIELDS.length + i) * 30, height: 30, lineHeight: '30px', fontSize: 19, display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap'}}>
        {chk(values.some((v) => v.l === n))}<span style={{width: 22, color: '#7C3AED', fontWeight: 700, fontStyle: 'italic'}}>fx</span>{n}
      </div>
    ))}
    {[['FILTERS', 18, 480], ['COLUMNS', 248, 480], ['ROWS', 18, 620], ['Σ VALUES', 248, 620]].map(([n, x, y]) => <div key={n as string} style={{position: 'absolute', left: x as number, top: (y as number) - 2, fontSize: 16, color: '#666', fontWeight: 700}}>{n}</div>)}
    {[[18, 500, 100], [248, 500, 100], [18, 640, 150], [248, 640, 150]].map(([x, y, h], i) => <div key={i} style={{position: 'absolute', left: x, top: y, width: 214, height: h, border: '1px solid #BBB', background: '#fff'}} />)}
    <div style={{position: 'absolute', left: 26, top: 652, width: 198, height: 30, background: '#E7F1FB', border: '1px solid #9CC', lineHeight: '28px', paddingLeft: 8, fontSize: 17}}>Branch</div>
    {values.map((v, i) => (
      <div key={v.l} style={{position: 'absolute', left: 256, top: 650 + i * 34, width: 198, height: 30, background: `${v.c}22`, border: `2px solid ${v.c}`, boxShadow: `0 0 12px ${v.c}`, lineHeight: '26px', paddingLeft: 8, fontSize: 17, whiteSpace: 'nowrap', overflow: 'hidden'}}>
        <span style={{color: v.c, fontWeight: 700, marginRight: 6, fontStyle: v.fx ? 'italic' : 'normal'}}>{v.fx ? 'fx' : 'Σ'}</span>{v.l}
      </div>
    ))}
  </div>
);

/* ───────── SCENE 1 — DAX engine intro ───────── */
export const Scene1: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[1];
  const cols: PPCol[] = [...PP_COLS, {n: 'Add Column', w: 90, add: true}];
  const rows = mkRows(15, () => ['']);
  const sel: [number, number] | null = t >= 16.5 ? [0, 5] : null;
  const typing = t >= 18.2 && t < 21.6;
  const formula = typing ? typed('=SU', t, 18.2, 19.0) : '';
  const glow = t >= a.dax && t < 23 ? C.blue : undefined;
  const cur = pt(t, [[0, {x: 1000, y: 560}], [16.2, headP(cols, 5)], [16.6, headP(cols, 5)], [17.6, fbar()], [18.0, fbar()], [23, {x: 1000, y: 600}], [47, {x: 1000, y: 600}]]);
  const rowsAgg = Math.floor(clamp((t - a.millions) / 5) * 50000);
  const over = typing && t >= 19.0 ? <Intelli x={200} y={M.title + M.tabs + M.ribbon + M.formula} items={['SUM', 'SUMMARIZE', 'SUMX', 'SUBSTITUTE']} hl={0} /> : null;
  return (
    <Stage>
      <PPWin {...PPW} name={t >= 16.5 ? 'SalesAmount' : ''} formula={formula} fxGlow={glow} cols={cols} rows={rows} sel={sel} calcH={0} measures={[]} record="1 of 50,000" table={0} over={over} />
      <Ring x={PPW.x + 10 * Z} y={PPW.y + (M.title + M.tabs + M.ribbon + 2) * Z} w={560} h={30 * Z} c={C.blue} t={t} a={fade(t, a.dax, 23)} r={8} />
      <Card y={110} h={160} c={C.blue} a={fade(t, a.unit, 47.2)} title="UNIT 12 · DAX & Evaluation Context">
        <div style={{fontSize: 26, fontWeight: 600}}>Lesson 57 of 76</div>
        <Bar p={57 / 76} c={C.blue} label="Course progress" right="75.0%" />
      </Card>
      <Card y={290} h={290} c={C.red} a={fade(t, a.rand, 47.2)} title="Legacy cell formulas">
        <div style={{fontFamily: mono, fontSize: 22, color: '#FCA5A5', lineHeight: '34px'}}>=C2*D2 &nbsp;=C3*D3 &nbsp;=C4*D4 …<br />copied × 50,000 rows</div>
        <Bar p={kf(t, [[a.rand, 0], [a.rand + 3, 0.92]])} c={C.red} label="Workbook weight (illustrative)" />
        <div style={{marginTop: 14, fontSize: 21, color: '#CBD5E1'}}>Repeated, scattered, slow to maintain</div>
      </Card>
      <Card y={600} h={380} c={C.blue} a={fade(t, a.rand + 1.5, 47.2)} title="DAX engine">
        <div style={{fontFamily: mono, fontSize: 22, color: '#7DD3FC', lineHeight: '34px'}}>[Total Sales] = SUM(…)<br />one definition · many reports</div>
        <div style={{marginTop: 18, fontSize: 21, color: '#CBD5E1'}}>Rows aggregated in memory</div>
        <div style={{fontFamily: mono, fontSize: 52, fontWeight: 700, color: C.blue, textShadow: `0 0 18px ${C.blue}`}}>{fmt(t >= a.power ? rowsAgg : 0)}</div>
        <div style={{fontSize: 20, color: C.dim}}>rows · in-memory computation</div>
      </Card>
      <Cursor x={cur.x} y={cur.y} t={t} left={[16.5, 17.9]} />
      <Hud>
        <TopBadge text="الدرس 57 من 76 | الوحدة 12 من 14 → DAX Fundamentals" a={fade(t, 2, 18)} />
        <Tag text="DAX Language Engine → In-Memory Computation vs. Permanent Column Storage" c={C.blue} a={fade(t, 27, 44.5)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 2 — calculated columns ───────── */
export const Scene2: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[2];
  const CC = '=Fact_Sales[SalesAmount] - Fact_Sales[TotalCost]';
  const dim = t >= 76.4;
  const hasCol = t >= 54.0;
  const name = t >= 63.2 ? 'Margin' : t >= 62.3 ? typed('Margin', t, 62.3, 63.0) : 'CalculatedColumn1';
  const cols: PPCol[] = dim
    ? [{n: 'BranchID', w: 70}, {n: 'BranchName', w: 120}, {n: 'City', w: 100}, {n: 'Zone', w: 130, calc: true}, {n: 'Add Column', w: 90, add: true}]
    : hasCol ? [...PP_COLS, {n: name, w: 90, calc: true}, {n: 'Add Column', w: 90, add: true}] : [...PP_COLS, {n: 'Add Column', w: 90, add: true}];
  const scan = t >= 59.6 ? kf(t, [[59.6, 0], [64.6, 10]]) : -1;
  const done = t >= 59.6 ? Math.floor(scan) : 0;
  const hl: Record<string, string> = {};
  const rows = dim
    ? BR.map((b, i) => [String(i + 1), b, ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Aswan'][i], ['Greater Cairo', 'Coast', 'Greater Cairo', 'Delta', 'Upper Egypt'][i], ''])
    : mkRows(15, (i) => (hasCol ? [i < done || t >= 64.8 ? fmt(ppRow(i).margin) : '', ''] : ['']));
  if (!dim && hasCol) for (let i = 0; i < 15; i++) if (i < done || t >= 64.8) hl[`${i},7`] = '#FEF3C7';
  const formula = dim ? '=SWITCH([BranchName], "Cairo", "Greater Cairo", "Giza", "Greater Cairo", "Alex", "Coast", "Mansoura", "Delta", "Upper Egypt")' : t >= 54.6 && t < 59.0 ? typed(CC, t, 54.6, 58.9) : hasCol && t >= 59.0 ? CC : '';
  const nm = dim ? 'Zone' : hasCol ? name : '';
  const ram = kf(t, [[65.2, 0.25], [70.4, 0.9]]);
  const rowsEval = Math.floor(clamp(scan / 10) * 50000);
  const addH = headP([...PP_COLS, {n: '', w: 90}], 7);
  const cur = pt(t, [[47.7, {x: 1000, y: 560}], [53.4, addH], [53.9, addH], [54.5, fbar()], [54.7, fbar()], [59.1, {x: 1000, y: 600}], [61.8, addH], [62.0, addH], [63.3, {x: 1000, y: 600}], [76.1, tabP(1)], [76.4, tabP(1)], [78, {x: 1000, y: 600}]]);
  return (
    <Stage>
      <PPWin {...PPW} name={nm} formula={formula} fxGlow={hasCol && t < 64.8 ? C.amber : undefined} cols={cols} rows={rows} cellHl={hl} scan={scan >= 0 && scan < 10 ? scan : undefined} scanC={C.amber} sel={hasCol && !dim ? [0, 7] : null} calcH={0} measures={[]} record="1 of 50,000" table={dim ? 1 : 0} />
      <Card y={110} h={230} c={C.amber} a={fade(t, a.row, 87)} title="Row Context">
        <div style={{fontSize: 22, color: '#CBD5E1'}}>Evaluated row by row on refresh</div>
        <div style={{fontFamily: mono, fontSize: 48, fontWeight: 700, color: C.amber, marginTop: 8}}>{fmt(rowsEval)}</div>
        <div style={{fontSize: 20, color: C.dim}}>rows evaluated · of 50,000 (illustrative)</div>
      </Card>
      <Card y={360} h={420} c={dim ? C.green : C.red} a={fade(t, a.ram, 87)} title="RAM · stored column">
        <Gauge p={dim ? 0.12 : ram} c={dim ? C.green : ram > 0.6 ? C.red : C.amber} />
        <Bar p={dim ? 0.1 : kf(t, [[65.2, 0.4], [70.4, 0.85]])} c={dim ? C.green : C.amber} label="Model size (illustrative)" right={dim ? 'tiny' : 'growing'} />
        <div style={{marginTop: 12, fontSize: 21, color: '#CBD5E1'}}>{dim ? 'Dimension table: few rows → negligible cost' : 'Stored permanently in memory'}</div>
      </Card>
      <Note text="Model bloat · slower engine" c={C.red} a={fade(t, a.bloat, 74.0)} y={800} x={1640} />
      <Note text="Use for dimension fields only" c={C.green} a={fade(t, a.only, 87)} y={800} x={1640} />
      <Cursor x={cur.x} y={cur.y} t={t} left={[53.9, 54.7, 62.0, 76.4]} />
      <Hud>
        <Tag text="Calculated Column Mechanics → Evaluated Row-by-Row During Data Refresh (Row Context)" c={C.amber} a={fade(t, 48, 66)} />
        <Tag text="RAM Memory Bloat → Permanent Column Storage Increases Model Size" c={C.amber} a={fade(t, 68, 86.6)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 3 — explicit measures ───────── */
export const Scene3: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[3];
  const cols: PPCol[] = [...PP_COLS, {n: 'Margin', w: 90, calc: true}, {n: 'Add Column', w: 90, add: true}];
  const rows = mkRows(15, (i) => [fmt(ppRow(i).margin), '']);
  const calcH = kf(t, [[94.0, 0], [94.8, 92]]);
  const M1 = 'Total Sales:=SUM(Fact_Sales[SalesAmount])';
  const typing = t >= 96.5 && t < 102.0;
  const formula = typing ? typed(M1, t, 96.5, 101.6) : t >= 102.0 ? M1 : '';
  const measures: PPMeasure[] = t >= 102.0 ? [{n: 'Total Sales', v: fmt(TOTAL), a: clamp((t - 102.0) / 0.4)}] : [];
  const bi = Math.floor(Math.max(0, t - 106.6) / 1.3);
  const bsel = t >= 106.6 && t < 113.1 ? bi % 5 : -1;
  const val = bsel >= 0 ? BR_SALES[bsel] : TOTAL;
  const cur = pt(t, [[87.2, {x: 1000, y: 520}], [92.9, btn('carea')], [94.0, btn('carea')], [95.0, calcP(0)], [95.9, calcP(0)], [102.2, {x: 1000, y: 600}], [125, {x: 1000, y: 600}]]);
  return (
    <Stage>
      <PPWin {...PPW} hl={t >= 93 && t < 94.8 ? 'carea' : undefined} name={typing || t >= 102 ? 'Total Sales' : ''} formula={formula} fxGlow={t >= 96 ? C.green : undefined} cols={cols} rows={rows} calcH={calcH} measures={measures} record="1 of 50,000" table={0} />
      <Ring x={PPW.x + 164 * Z} y={PPW.y + (M.title + M.tabs + M.ribbon + 2) * Z} w={34 * Z} h={26 * Z} c={C.green} t={t} a={fade(t, 96, 103)} r={8} />
      <Card y={110} h={330} c={C.green} a={fade(t, a.zero, 125.4)} title="Storage footprint">
        <Bar p={0.7} c={C.amber} label="Calculated column (stored)" right="in RAM" />
        <Bar p={t >= a.zero + 0.5 ? 0.004 : 0} c={C.green} label="Explicit measure" right="0 bytes of column data" />
        <div style={{marginTop: 16, fontSize: 21, color: '#CBD5E1'}}>Only the formula is saved — results are computed when the report asks</div>
      </Card>
      <Card y={460} h={430} c={C.blue} a={fade(t, a.dyn, 125.4)} title="Filter Context · on demand">
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6}}>
          {BR.map((b, i) => <span key={b} style={{padding: '6px 14px', borderRadius: 14, border: `2px solid ${bsel === i ? C.blue : '#475569'}`, background: bsel === i ? `${C.blue}33` : 'transparent', fontFamily: mono, fontSize: 20, fontWeight: 700}}>{b}</span>)}
        </div>
        <div style={{marginTop: 18, fontSize: 21, color: '#CBD5E1'}}>[Total Sales] evaluated for this filter:</div>
        <div style={{fontFamily: mono, fontSize: 40, fontWeight: 700, color: C.green, textShadow: `0 0 16px ${C.green}`, marginTop: 6}}>{fmt(val)}</div>
        <div style={{fontSize: 20, color: C.dim, marginTop: 8}}>{bsel >= 0 ? `Branch = ${BR[bsel]}` : 'No filter = all branches'}</div>
      </Card>
      <Note text="Light file · fast queries" c={C.green} a={fade(t, a.light, 125.4)} y={800} x={1640} />
      <Cursor x={cur.x} y={cur.y} t={t} left={[94.0, 95.9]} />
      <Hud>
        <Tag text="Explicit Measure Architecture → Total Sales := SUM(Fact_Sales[SalesAmount])" c={C.green} a={fade(t, 88, 106)} />
        <Tag text="On-Demand Computation → Zero RAM Storage Footprint + Dynamic Filter Context" c={C.green} a={fade(t, 108, 125)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 4 — implicit vs explicit ───────── */
export const Scene4: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[4];
  const cols: PPCol[] = [...PP_COLS, {n: 'Margin', w: 90, calc: true}, {n: 'Add Column', w: 90, add: true}];
  const rows = mkRows(15, (i) => [fmt(ppRow(i).margin), '']);
  const BAD = 'Sales Growth:=[Sum of SalesAmount] - [Prior Sales]';
  const GOOD = 'Sales Growth:=[Total Sales] - [Prior Sales]';
  const badOn = t >= 138.2 && t < 142.6;
  const goodTyping = t >= 146.0 && t < 149.4;
  const formula = badOn ? typed(BAD, t, 138.2, 141.4) : goodTyping ? typed(GOOD, t, 146.0, 149.2) : t >= 149.4 ? GOOD : '';
  const grown = t >= 149.4;
  const measures: PPMeasure[] = [{n: 'Total Sales', v: fmt(TOTAL)}, {n: 'Prior Sales', v: fmt(PRIOR), c: '#38BDF8'}];
  if (grown) measures.push({n: 'Sales Growth', v: fmt(TOTAL - PRIOR), c: C.purple, a: clamp((t - 149.4) / 0.4)});
  const drag = clamp((t - 132.4) / 2.6);
  const f5 = {x: FP.x + 120, y: FP.y + 176 + 5 * 30 + 15};
  const ghost = {x: f5.x + (VAL_X - f5.x) * drag, y: f5.y + (VAL_Y - f5.y) * drag};
  const implicitIn = t >= 135.0 && t < 142.9;
  const values = [
    ...(implicitIn ? [{l: 'Sum of SalesAmount', c: C.red}] : []),
    ...(grown ? [{l: 'Total Sales', c: C.purple, fx: true}, {l: 'Prior Sales', c: C.purple, fx: true}, {l: 'Sales Growth', c: C.purple, fx: true}] : []),
  ];
  const meas = t >= a.nest ? ['Total Sales', 'Prior Sales', ...(grown ? ['Sales Growth'] : [])] : [];
  const checked = ['Branch', ...(implicitIn ? ['SalesAmount'] : [])];
  const cur = pt(t, [[125.9, {x: 1000, y: 520}], [132.2, f5], [132.4, f5], [135.0, {x: VAL_X, y: VAL_Y}], [137.6, {x: VAL_X, y: VAL_Y}], [138.0, calcP(2)], [145.5, calcP(2)], [149.6, {x: 1000, y: 620}], [162, {x: 1000, y: 620}]]);
  const p0 = calcP(0), p1 = calcP(1), p2 = calcP(2);
  return (
    <Stage>
      <PPWin {...PPW} name={badOn || goodTyping || grown ? 'Sales Growth' : ''} formula={formula} formulaErr={badOn && t >= 140.4} fxGlow={badOn ? C.red : goodTyping || grown ? C.purple : undefined} cols={cols} rows={rows} calcH={92} measures={measures} record="1 of 50,000" table={0} />
      {grown && (
        <svg style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: fade(t, 149.6, 162, 0.4), zIndex: 30}} width={1920} height={1080}>
          <line x1={p0.x + 70} y1={p0.y} x2={p2.x - 70} y2={p2.y} stroke={C.purple} strokeWidth={6} strokeLinecap="round" />
          <line x1={p1.x + 70} y1={p1.y} x2={p2.x - 70} y2={p2.y} stroke={C.purple} strokeWidth={6} strokeLinecap="round" />
        </svg>
      )}
      <FieldsPane a={fade(t, a.implicit - 0.2, 162.4)} checked={checked} measures={meas} values={values} />
      {t >= 132.4 && t < 135.0 && <div style={{position: 'absolute', left: ghost.x - 90, top: ghost.y - 15, padding: '4px 12px', background: '#fff', border: `2px solid ${C.red}`, boxShadow: `0 0 14px ${C.red}`, fontSize: 18, zIndex: 60, fontFamily: ui}}>Σ SalesAmount</div>}
      <Note text="Implicit measure — cannot be reused in other DAX formulas" c={C.red} a={fade(t, a.reuse, 142.6)} y={820} />
      <Note text="Explicit measures nest: [Total Sales] − [Prior Sales]" c={C.purple} a={fade(t, 149.6, 162)} y={820} />
      <Cursor x={cur.x} y={cur.y} t={t} left={[132.4, 138.0, 146.0]} />
      <Hud>
        <Tag text="Implicit vs. Explicit → Avoid Implicit Drag-and-Drop Fields in Enterprise Data Models" c={C.red} a={fade(t, 128, 144)} />
        <Tag text="Measure Reusability → Explicit Measures Can Be Nested inside Complex DAX Formulas" c={C.purple} a={fade(t, 146, 162.4)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 5 — enterprise run ───────── */
export const Scene5: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[5];
  const cols: PPCol[] = [...PP_COLS, {n: 'Margin', w: 90, calc: true}, {n: 'Add Column', w: 90, add: true}];
  const rows = mkRows(15, (i) => [fmt(ppRow(i).margin), '']);
  const S1 = 'Total Sales:=SUM(Fact_Sales[SalesAmount])';
  const S2 = 'Total Quantity:=SUM(Fact_Sales[Quantity])';
  const S3 = 'Total Orders:=DISTINCTCOUNT(Fact_Sales[OrderID])';
  let formula = '', name = '';
  if (t >= 174.4 && t < 176.6) { formula = typed(S1, t, 174.4, 176.4); name = 'Total Sales'; }
  else if (t >= 176.7 && t < 178.5) { formula = typed(S2, t, 176.7, 178.3); name = 'Total Quantity'; }
  else if (t >= 178.6 && t < 181.1) { formula = typed(S3, t, 178.6, 180.9); name = 'Total Orders'; }
  else if (t >= 181.1) { formula = S3; name = 'Total Orders'; }
  const measures: PPMeasure[] = [];
  if (t >= 176.6) measures.push({n: 'Total Sales', v: fmt(TOTAL), a: clamp((t - 176.6) / 0.4)});
  if (t >= 178.5) measures.push({n: 'Total Quantity', v: fmt(sum(BR_QTY)), a: clamp((t - 178.5) / 0.4)});
  if (t >= 181.1) measures.push({n: 'Total Orders', v: fmt(sum(BR_ORD)), a: clamp((t - 181.1) / 0.4)});
  const c1 = t >= 177.0, c2 = t >= 178.9, c3 = t >= 181.4;
  const flash = fade(t, a.fifty, a.fifty + 1.6, 0.3) + fade(t, 181.5, 183, 0.3);
  const sealP = kf(t, [[a.ms, 0], [a.ms + 0.9, 1]]);
  const sealA = clamp(sealP) * clamp((203.4 - t) / 0.5);
  const load = fade(t, 163.2, 168.0, 0.4);
  const cur = pt(t, [[162.8, {x: 1000, y: 560}], [173.9, calcP(0)], [174.2, calcP(0)], [176.6, calcP(1)], [176.7, calcP(1)], [178.5, calcP(2)], [178.6, calcP(2)], [181.3, {x: 1000, y: 620}], [203, {x: 1000, y: 620}]]);
  return (
    <Stage>
      <PPWin {...PPW} name={name} formula={formula} fxGlow={t >= 174 && t < 181.2 ? C.green : undefined} cols={cols} rows={rows} calcH={92} measures={measures} record="1 of 50,000" table={0} />
      <Ring x={PPW.x + 70 * Z} y={PPW.y + 2 * Z} w={400 * Z} h={28 * Z} c={C.green} t={t} a={fade(t, a.file, 176)} r={8} />
      <Card y={110} h={480} c={C.blue} a={fade(t, 168.2, 203.4)} title="PivotTable · by Branch">
        <div style={{display: 'flex', fontFamily: mono, fontSize: 17, fontWeight: 700, color: '#CBD5E1', borderBottom: '2px solid #475569', paddingBottom: 6, marginTop: 4}}>
          <span style={{width: 118}}>Branch</span><span style={{width: 112, textAlign: 'right', opacity: c1 ? 1 : 0.2}}>Sales</span><span style={{width: 100, textAlign: 'right', opacity: c2 ? 1 : 0.2}}>Qty</span><span style={{width: 100, textAlign: 'right', opacity: c3 ? 1 : 0.2}}>Orders</span>
        </div>
        {BR.map((b, i) => (
          <div key={b} style={{display: 'flex', fontFamily: mono, fontSize: 19, height: 44, lineHeight: '44px', color: W8, boxShadow: flash > 0.05 ? `inset 0 0 ${14 * flash}px ${C.blue}66` : 'none'}}>
            <span style={{width: 118}}>{b}</span>
            <span style={{width: 112, textAlign: 'right', color: C.green, opacity: c1 ? 1 : 0}}>{(BR_SALES[i] / 1e6).toFixed(1)}M</span>
            <span style={{width: 100, textAlign: 'right', color: C.green, opacity: c2 ? 1 : 0}}>{fmt(BR_QTY[i])}</span>
            <span style={{width: 100, textAlign: 'right', color: C.green, opacity: c3 ? 1 : 0}}>{fmt(BR_ORD[i])}</span>
          </div>
        ))}
        <div style={{display: 'flex', fontFamily: mono, fontSize: 19, fontWeight: 700, height: 44, lineHeight: '44px', borderTop: '2px solid #475569', color: C.blue}}>
          <span style={{width: 118}}>Total</span><span style={{width: 112, textAlign: 'right', opacity: c1 ? 1 : 0}}>{(TOTAL / 1e6).toFixed(1)}M</span><span style={{width: 100, textAlign: 'right', opacity: c2 ? 1 : 0}}>{fmt(sum(BR_QTY))}</span><span style={{width: 100, textAlign: 'right', opacity: c3 ? 1 : 0}}>{fmt(sum(BR_ORD))}</span>
        </div>
      </Card>
      <Note text="3 measures · 50,000 rows" c={C.blue} a={fade(t, a.fifty, 184.4)} y={598} x={1640} />
      <Note text="Light memory · flexible analytics" c={C.green} a={fade(t, a.perf, 202.6)} y={598} x={1640} />
      <Cursor x={cur.x} y={cur.y} t={t} left={[174.2, 176.7, 178.6]} />
      {load > 0.01 && (
        <div style={{position: 'absolute', left: 560, top: 400, width: 800, height: 220, opacity: load, borderRadius: 20, background: 'rgba(15,23,42,.96)', border: `3px solid ${C.blue}`, boxShadow: `0 0 30px ${C.blue}66`, zIndex: 60, fontFamily: ar, color: W8, textAlign: 'center', paddingTop: 36, boxSizing: 'border-box'}}>
          <div style={{fontSize: 38, fontWeight: 700, direction: 'ltr'}}>Loading {FILE}</div>
          <div style={{fontSize: 28, color: C.dim, marginTop: 6}}>50,000 rows → Data Model</div>
          <div style={{margin: '24px 60px 0', height: 14, background: '#334155', borderRadius: 7}}><div style={{width: `${kf(t, [[163.6, 0], [167.6, 100]])}%`, height: 14, background: C.blue, borderRadius: 7}} /></div>
        </div>
      )}
      <Hud>
        <Tag text="Enterprise DAX Pipeline → Deploy Explicit Measures Across 50,000 Sales Rows" c={C.blue} a={fade(t, 164, 183)} />
        <Tag text="Sub-Millisecond Aggregation → High-Speed In-Memory DAX Processing Across 50,000 Rows" c={C.green} a={fade(t, 184, 203)} />
        {sealA > 0.01 && (
          <div style={{position: 'absolute', left: 1440, top: 655, width: 360, height: 360, opacity: sealA, transform: `scale(${0.5 + 0.5 * clamp(sealP)})`, zIndex: 80}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, #065F46 0%, #0F172A 72%)', border: `6px solid ${C.green}`, boxShadow: `0 0 ${36 + 22 * pls(t, 1.6)}px ${C.green}`}} />
            <div style={{position: 'absolute', inset: 20, borderRadius: '50%', border: `2px dashed ${C.green}`, transform: `rotate(${(t - a.ms) * 30}deg)`}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', fontSize: 96, color: C.green, lineHeight: '96px'}}>✓</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', fontFamily: ar, fontWeight: 700, fontSize: 30}}>Enterprise DAX</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 205, textAlign: 'center', fontFamily: ar, fontWeight: 600, fontSize: 25, color: '#6EE7B7'}}>Explicit Measures</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 262, textAlign: 'center', fontFamily: mono, fontSize: 19, color: C.dim}}>{FILE}</div>
          </div>
        )}
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 6 — lesson 57 outro ───────── */
export const Scene6: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[6];
  const pop = (s: number) => {
    const p = clamp((t - s) / 0.6);
    return {opacity: p, transform: `translateY(${(1 - p) * 26}px)`};
  };
  const prog = kf(t, [[a.skills + 0.4, 0], [a.skills + 4, 75]]);
  const skills = ['DAX — in-memory computation vs permanent storage', 'Calculated columns — row context, RAM cost', 'Explicit measures — on demand, filter context', 'Implicit vs explicit — nesting and reuse'];
  const out = clamp((t - 238.2) / 1.7);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 80, top: 110, width: 1760, height: 860, borderRadius: 32, background: 'rgba(30,41,59,.78)', border: '2px solid rgba(148,163,184,.35)', boxShadow: '0 30px 90px rgba(0,0,0,.5)', fontFamily: ar, color: W8, ...pop(a.great - 0.2)}}>
        <div style={{position: 'absolute', left: 60, top: 50, display: 'flex', alignItems: 'center', gap: 28}}>
          <div style={{margin: '-56px -44px'}}><Logo s={230} /></div>
          <div>
            <div dir="rtl" style={{fontSize: 52, fontWeight: 700, whiteSpace: 'nowrap'}}>منظومة أكاديمي | Manzooma Excel Masterclass</div>
            <div style={{fontSize: 28, color: C.dim, marginTop: 4}}>Excel From Zero to Professional — Unit 12: DAX & Evaluation Context</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 240, width: 840, ...pop(a.skills)}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, padding: '12px 26px', borderRadius: 18, background: 'rgba(16,185,129,.16)', border: `3px solid ${C.green}`, boxShadow: `0 0 ${14 + 12 * pls(t, 1.8)}px ${C.green}66`, fontSize: 30, fontWeight: 600, direction: 'ltr'}}>
            <span style={{fontSize: 40, color: C.green}}>✓</span>Lesson 57 of 76 · DAX & Explicit Measures Mastered
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 360, width: 800, ...pop(a.skills + 0.4)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, color: C.dim, direction: 'ltr'}}><span>Course progress · lesson 57 of 76</span><span style={{color: W8, fontWeight: 700}}>{prog.toFixed(1)}%</span></div>
          <div style={{marginTop: 12, height: 26, borderRadius: 13, background: '#334155', overflow: 'hidden'}}><div style={{width: `${prog}%`, height: 26, borderRadius: 13, background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, boxShadow: `0 0 18px ${C.blue}`}} /></div>
          <div style={{display: 'flex', gap: 8, marginTop: 22, direction: 'ltr'}}>
            {Array.from({length: 14}, (_, i) => <div key={i} style={{flex: 1, height: 16, borderRadius: 5, background: i < 11 && t >= a.skills + 4.4 + 0.15 * i ? C.green : '#334155', border: i === 11 ? `2px solid ${C.blue}` : 'none', boxShadow: i === 11 ? `0 0 ${6 + 8 * pls(t, 1.6)}px ${C.blue}` : 'none'}} />)}
          </div>
          <div style={{fontSize: 22, color: C.dim, marginTop: 8, direction: 'ltr'}}>Unit 12 of 14 started · 11 units completed</div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 560, width: 840, direction: 'ltr'}}>
          {skills.map((s, i) => (
            <div key={s} style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: 26, margin: '0 0 18px', ...pop(a.skills + 1.2 + i * 0.8)}}>
              <span style={{width: 36, height: 36, borderRadius: 18, background: C.green, color: '#0F172A', textAlign: 'center', lineHeight: '36px', fontWeight: 700, fontSize: 24, flex: 'none'}}>✓</span>{s}
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 940, top: 250, width: 760, height: 290, borderRadius: 24, background: 'rgba(15,23,42,.7)', border: `2px solid ${C.blue}`, padding: '28px 40px', boxSizing: 'border-box', direction: 'ltr', ...pop(a.down)}}>
          <div style={{fontSize: 30, color: C.dim}} dir="rtl">الملفات والتدريبات</div>
          <div style={{fontFamily: mono, fontSize: 30, fontWeight: 700, color: C.blue, marginTop: 16}}>{FILE}</div>
          <div style={{fontFamily: mono, fontSize: 36, fontWeight: 700, color: W8, marginTop: 22, padding: '14px 18px', border: `2px dashed ${C.blue}`, borderRadius: 14, boxShadow: `0 0 ${10 + 14 * pls(t, 1.8)}px ${C.blue}55`}}>solutions.gomaaintelligence.me</div>
        </div>
        <div style={{position: 'absolute', left: 940, top: 580, width: 760, height: 270, borderRadius: 24, background: 'rgba(15,23,42,.7)', border: `2px solid ${C.purple}`, padding: '24px 40px', boxSizing: 'border-box', boxShadow: t >= a.next ? `0 0 ${12 + 12 * pls(t, 2.2)}px ${C.purple}66` : 'none', ...pop(a.next - 0.6)}}>
          <div dir="rtl" style={{fontSize: 28, color: C.dim}}>الدرس القادم — الوحدة 12 من 14</div>
          <div dir="rtl" style={{fontSize: 40, fontWeight: 700, marginTop: 8, lineHeight: '56px'}}>الدرس 58: سياق الصف وسياق الفلترة</div>
          <div style={{fontSize: 28, color: '#C4B5FD', marginTop: 8, direction: 'ltr', fontWeight: 600}}>Row Context · Filter Context · Context Transition →</div>
        </div>
      </div>
      <Hud />
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: out}} />
    </Stage>
  );
};
