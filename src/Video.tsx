import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile} from 'remotion';
import {AR, AppWin, Card, Chrome, Click, CursorProvider, Dax, Dialog, GCol, Grid, Hit, Ic, MONO, PP, Scene, Tag, WW, XL, eo, fadeIn, fmt, okPt, pick, pr, ribPt, sheetPt, tabPt, typed, useT} from './kit';
import {AN, C, LESSON, LESSONS, LOGO, PRODUCTS, SB, STORES, UNIT, UNITS, VOICE} from './theme';

const OX = 40, OY = 108, PX = 1300, PW = 580;

/* ---------- illustrative data ---------- */
const rowGen = (r: number) => {
  const p = PRODUCTS[(r * 5) % 6];
  const q = 1 + ((r * 7) % 3);
  const amt = p.price * q;
  return {id: 1001 + r, date: `${String(3 + Math.floor(r / 3)).padStart(2, '0')}/01/2026`, store: 1 + ((r * 3) % 4), prod: p.k, qty: q, amt, cost: Math.round(amt * (1 - p.m))};
};
const FH = ['SaleID', 'OrderDate', 'StoreKey', 'ProductKey', 'Qty', 'Amount', 'Cost'];
const fcell = (c: number, i: number) => {
  const d = rowGen(i);
  return String([d.id, d.date, d.store, d.prod, d.qty, fmt(d.amt), fmt(d.cost)][c]);
};
const FCOLS: GCol[] = [{n: 'SaleID', w: 120, a: 'r'}, {n: 'OrderDate', w: 160}, {n: 'StoreKey', w: 130, a: 'r'}, {n: 'ProductKey', w: 150, a: 'r'}, {n: 'Qty', w: 90, a: 'r'}, {n: 'Amount', w: 140, a: 'r'}, {n: 'Cost', w: 130, a: 'r'}];
type M = {n: string; f: string; v: string};
const MEAS: M[] = [
  {n: 'Total Sales', f: 'SUM(Fact_Sales[Amount])', v: '12,000,000'},
  {n: 'Total Profit', f: 'SUM(Fact_Sales[Amount]) - SUM(Fact_Sales[Cost])', v: '2,991,000'},
  {n: 'Profit Margin', f: 'DIVIDE([Total Profit], [Total Sales])', v: '24.9%'},
  {n: 'Cairo Sales', f: 'CALCULATE([Total Sales], Dim_Store[Region] = "Cairo")', v: '4,820,000'},
  {n: 'High Margin Sales', f: 'CALCULATE([Total Sales], FILTER(Dim_Product, [Profit Margin] > 0.25))', v: '6,300,000'},
];
const full = (i: number) => `${MEAS[i].n}:=${MEAS[i].f}`;
const cellRect = (i: number) => ({x: 10 + (i % 3) * 404, y: 272 + Math.floor(i / 3) * 54, w: 394, h: 46});
const ppCellPt = (i: number) => {
  const r = cellRect(i);
  return {x: OX + r.x + r.w / 2, y: OY + 236 + r.y + r.h / 2};
};
const DG = {fact: {x: 430, y: 36, w: 330, h: 200}, store: {x: 40, y: 56, w: 270, h: 150}, prod: {x: 870, y: 56, w: 270, h: 150}, date: {x: 430, y: 310, w: 330, h: 130}};
const dgPt = (k: keyof typeof DG) => ({x: OX + DG[k].x + DG[k].w / 2, y: OY + 236 + DG[k].y + DG[k].h / 2});

/* ---------- small pieces ---------- */
const Chip: React.FC<{l: string; col: string; o?: number; strike?: boolean; fill?: boolean; size?: number}> = ({l, col, o = 1, strike, fill, size = 24}) => (
  <span style={{display: 'inline-block', border: `2px solid ${col}`, background: fill ? col + '33' : 'transparent', color: C.text, borderRadius: 12, padding: '4px 14px', fontSize: size, opacity: o, textDecoration: strike ? 'line-through' : 'none', direction: 'ltr', fontFamily: AR, whiteSpace: 'nowrap'}}>{l}</span>
);
const Txt: React.FC<{x: number; y: number; s?: number; c?: string; w?: number; b?: boolean; o?: number; m?: boolean; children: React.ReactNode}> = ({x, y, s = 24, c = C.text, w, b, o = 1, m, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, fontSize: s, color: c, fontWeight: b ? 700 : 400, opacity: o, fontFamily: m ? MONO : AR, direction: 'ltr', whiteSpace: w ? 'normal' : 'nowrap'}}>{children}</div>
);

const Gem: React.FC<{t: number; k: number}> = ({t, k}) => {
  const p = 1 + 0.035 * Math.sin(t * 2.4);
  const rays = [...Array(12)].map((_, i) => {
    const a = (i * Math.PI) / 6 + t * 0.12;
    const r2 = 185 + 10 * Math.sin(t * 2 + i);
    return <line key={i} x1={280 + Math.cos(a) * 125 * p} y1={140 + Math.sin(a) * 100 * p} x2={280 + Math.cos(a) * r2} y2={140 + Math.sin(a) * r2 * 0.75} stroke={C.blue} strokeWidth={3} opacity={0.45 * k} />;
  });
  return (
    <svg width={560} height={270} viewBox="0 0 560 270">
      <defs>
        <radialGradient id="gl"><stop offset="0%" stopColor={C.blue} stopOpacity={0.55} /><stop offset="100%" stopColor={C.blue} stopOpacity={0} /></radialGradient>
      </defs>
      <circle cx={280} cy={140} r={150 * p * k} fill="url(#gl)" />
      {rays}
      <g transform={`translate(0,${(1 - k) * 30})`} opacity={k}>
        <polygon points="215,85 345,85 320,135 240,135" fill="#BAE6FD" />
        <polygon points="215,85 240,135 165,135" fill="#7DD3FC" />
        <polygon points="345,85 395,135 320,135" fill="#38BDF8" />
        <polygon points="165,135 240,135 280,235" fill="#0EA5E9" />
        <polygon points="240,135 320,135 280,235" fill="#0284C7" />
        <polygon points="320,135 395,135 280,235" fill="#0369A1" />
      </g>
    </svg>
  );
};

/* ---------- Power Pivot window ---------- */
const PPGrid: React.FC<{tb: number}> = ({tb}) => {
  if (tb === 0) return <Grid letters={false} cols={FCOLS} rows={7} cell={(c, r) => fcell(c, r)} />;
  if (tb === 1) return <Grid letters={false} cols={[{n: 'StoreKey', w: 150, a: 'r'}, {n: 'StoreName', w: 220}, {n: 'Region', w: 200}, {n: 'Country', w: 180}]} rows={4} cell={(c, r) => [String(STORES[r].k), STORES[r].n, STORES[r].r, 'Egypt'][c]} />;
  if (tb === 2) return <Grid letters={false} cols={[{n: 'ProductKey', w: 170, a: 'r'}, {n: 'Product', w: 230}, {n: 'Category', w: 230}, {n: 'ListPrice', w: 150, a: 'r'}]} rows={6} cell={(c, r) => [String(PRODUCTS[r].k), PRODUCTS[r].n, PRODUCTS[r].cat, String(PRODUCTS[r].price)][c]} />;
  return <Grid letters={false} cols={[{n: 'DateKey', w: 150, a: 'r'}, {n: 'Date', w: 200}, {n: 'Month', w: 180}, {n: 'Year', w: 120, a: 'r'}]} rows={6} cell={(c, r) => [String(20260101 + r), `0${r + 1}/01/2026`, 'January', '2026'][c]} />;
};
const DBox: React.FC<{b: {x: number; y: number; w: number; h: number}; name: string; rows: string; fields: string[]; col: string; hot: number}> = ({b, name, rows, fields, col, hot}) => (
  <Hit x={b.x} y={b.y} w={b.w} h={b.h} r={10} base="#142036" style={{border: `3px solid ${hot > 0 ? col : C.line}`, boxShadow: hot > 0 ? `0 0 ${20 + hot * 18}px ${col}88` : 'none', overflow: 'hidden'}}>
    <div style={{background: hot > 0 ? col + '55' : '#1F2D47', height: 40, lineHeight: '40px', textAlign: 'center', fontWeight: 700, fontSize: 20, direction: 'ltr'}}>{name}</div>
    <div style={{padding: '6px 14px', fontSize: 17, color: C.dim, direction: 'ltr', lineHeight: '24px'}}>{fields.map((f) => <div key={f}>{f}</div>)}</div>
    <div style={{position: 'absolute', bottom: 8, width: '100%', textAlign: 'center', fontSize: 20, fontWeight: 700, color: hot > 0 ? col : C.text, fontFamily: MONO}}>{rows}</div>
  </Hit>
);
const PPWin: React.FC<{op?: number; sc?: number; view?: 'data' | 'diagram'; tb?: number; n: number; act: number; typing?: {i: number; text: string} | null; fx: {name: string; text: string; typing?: boolean; ok?: boolean}; hotF?: number; hotP?: number; overlay?: React.ReactNode}> = (p) => {
  const view = p.view || 'data';
  const tb = p.tb || 0;
  const names = ['Fact_Sales', 'Dim_Store', 'Dim_Product', 'Dim_Date'];
  const cnt = ['50,000', '4', '6', '365'];
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    const ty = !!p.typing && p.typing.i === i;
    if (i >= p.n && !ty) continue;
    const r = cellRect(i);
    cells.push(
      <Hit key={i} x={r.x} y={r.y} w={r.w} h={r.h} r={4} base={C.panel2} style={{border: `2px solid ${p.act === i ? C.green : C.line}`, overflow: 'hidden'}}>
        {ty ? (
          <div style={{padding: '0 10px', lineHeight: '42px', whiteSpace: 'nowrap'}}><Dax s={p.typing!.text} size={18} /></div>
        ) : (
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 12px', lineHeight: '42px', fontSize: 19, direction: 'ltr'}}>
            <span style={{color: C.dim}}>{MEAS[i].n}</span><span style={{fontFamily: MONO, fontWeight: 600}}>{MEAS[i].v}</span>
          </div>
        )}
      </Hit>
    );
  }
  const lines = (
    <svg style={{position: 'absolute', left: 0, top: 0}} width={WW} height={502}>
      <path d="M310 131 L430 136 M870 131 L760 136 M595 236 L595 310" stroke="#64748B" strokeWidth={3} fill="none" />
      {[[420, 126, '*'], [772, 126, '*'], [603, 252, '*'], [316, 122, '1'], [850, 122, '1'], [603, 296, '1']].map((q, i) => <text key={i} x={q[0] as number} y={q[1] as number} fill={C.dim} fontSize={22} fontFamily={MONO}>{q[2]}</text>)}
    </svg>
  );
  return (
    <AppWin app={PP} ox={OX} oy={OY} tab="Home" fx={p.fx} sheets={view === 'data' ? names : []} sheet={tb} status={view === 'data' ? 'Ready' : 'Diagram View'} statusR={view === 'data' ? `Record: 1 of ${cnt[tb]}` : '4 tables'} op={p.op} sc={p.sc} overlay={p.overlay}>
      {view === 'data' ? (
        <div>
          <PPGrid tb={tb} />
          <div style={{position: 'absolute', left: 0, top: 262, width: WW, height: 240, background: '#0B1424', borderTop: `2px solid ${C.line}`}}>
            <div style={{position: 'absolute', right: 16, bottom: 8, fontSize: 15, color: C.dim, direction: 'ltr'}}>Calculation Area</div>
          </div>
          {cells}
        </div>
      ) : (
        <div>
          {lines}
          <DBox b={DG.store} name="Dim_Store" rows="4 rows" fields={['StoreKey', 'StoreName', 'Region']} col={C.amber} hot={0} />
          <DBox b={DG.fact} name="Fact_Sales" rows="50,000 rows" fields={['SaleID', 'OrderDate', 'StoreKey', 'ProductKey', 'Amount']} col={C.red} hot={p.hotF || 0} />
          <DBox b={DG.prod} name="Dim_Product" rows="6 rows" fields={['ProductKey', 'Product', 'Category']} col={C.amber} hot={p.hotP || 0} />
          <DBox b={DG.date} name="Dim_Date" rows="365 rows" fields={['DateKey', 'Date', 'Year']} col={C.amber} hot={0} />
        </div>
      )}
    </AppWin>
  );
};

/* IntelliSense popup + parameter tooltip (window-relative coordinates) */
const Pop: React.FC<{text: string; start: number; fn: string; list: string[]; tip: string; endLen: number}> = ({text, start, fn, list, tip, endLen}) => {
  const n = text.length;
  const px = Math.min(296 + n * 11.4, 760);
  const word = text.slice(start);
  const items = list.filter((x) => x.startsWith(word.toUpperCase()));
  const box: React.CSSProperties = {position: 'absolute', top: 238, background: '#1E293B', border: `1px solid ${C.blue}`, borderRadius: 6, zIndex: 15, direction: 'ltr', fontFamily: MONO, fontSize: 18};
  if (word.length >= 1 && !word.includes('(') && items.length) {
    return (
      <div style={{...box, left: px, width: 310}}>
        {items.map((x, i) => <div key={x} style={{padding: '5px 12px', background: i === 0 ? '#0369A1' : 'transparent'}}><span style={{color: C.blue}}>ƒ </span>{x}</div>)}
      </div>
    );
  }
  if (text.includes(fn + '(') && n < endLen) return <div style={{...box, left: Math.min(296 + (start + fn.length) * 11.4, 700), padding: '6px 12px', color: C.text}}>{tip}</div>;
  return null;
};

/* ================= SC01 ================= */
const S1: React.FC = () => {
  const t = useT();
  const [e1, e2] = AN[0];
  const clicks: Click[] = [{t: 3.0, ...tabPt(XL, 'Power Pivot', OX, OY)}, {t: 5.2, ...ribPt(XL, 'Power Pivot', 'Manage', OX, OY)}, {t: 9.4, ...ppCellPt(0)}];
  const xlOp = 1 - pr(t, 5.4, 5.8);
  const ppOp = pr(t, 5.4, 5.9);
  const act = t >= 9.45 ? 0 : -1;
  const gemO = fadeIn(t, e1, 0.8);
  const conA = fadeIn(t, e2 + 0.5, 0.6);
  const conB = fadeIn(t, e2 + 4, 0.6);
  const sw = pr(t, e2 + 9, e2 + 10.2);
  return (
    <CursorProvider clicks={clicks}>
      {xlOp > 0.01 ? (
        <AppWin app={XL} ox={OX} oy={OY} tab={t >= 3.05 ? 'Power Pivot' : 'Home'} tabAt={t >= 3.05 ? 3.05 : undefined} fx={{name: 'A1', text: 'SaleID'}} sheets={['Fact_Sales']} sheet={0} op={xlOp}>
          <Grid cols={FCOLS} rows={15} cell={(c, r) => (r === 0 ? FH[c] : fcell(c, r - 1))} sel={{c1: 0, r1: 0, c2: 0, r2: 0}} headRow />
        </AppWin>
      ) : null}
      {ppOp > 0.01 ? <PPWin op={ppOp} sc={0.96 + 0.04 * eo(pr(t, 5.4, 5.9))} n={3} act={act} fx={act === 0 ? {name: 'Total Sales', text: full(0)} : {name: '', text: ''}} /> : null}
      <Card x={PX} y={OY} w={PW} h={330} col={C.blue} glow o={gemO}>
        <Gem t={t} k={gemO} />
        <Txt x={0} y={262} s={42} b m c={C.blue} w={PW}><div style={{textAlign: 'center'}}>CALCULATE</div></Txt>
      </Card>
      <Card x={PX} y={OY + 345} w={PW} h={200} col={C.red} o={conA} glow>
        <Txt x={24} y={14} s={24} b c={C.red}>Report Slicer · rigid filter</Txt>
        <div style={{position: 'absolute', right: 20, top: 10}}><Ic n="lock" s={34} c={C.red} /></div>
        <div style={{position: 'absolute', left: 24, top: 60, display: 'flex', gap: 8}}>
          {['Cairo', 'Giza', 'Alexandria', 'Mansoura'].map((r) => <Chip key={r} l={r} size={20} col={r === 'Giza' && sw < 0.5 ? C.red : r === 'Cairo' && sw >= 0.5 ? C.blue : C.line} fill={(r === 'Giza' && sw < 0.5) || (r === 'Cairo' && sw >= 0.5)} />)}
        </div>
        <Txt x={24} y={112} s={34} b m c={sw < 0.5 ? C.text : C.blue}>{sw < 0.5 ? 'Total Sales = 3,150,000' : 'Total Sales = 4,820,000'}</Txt>
        <Txt x={24} y={156} s={22} c={sw < 0.5 ? C.red : C.blue}>{sw < 0.5 ? 'Cannot change by itself' : 'Overridden by CALCULATE'}</Txt>
      </Card>
      <Card x={PX} y={OY + 560} w={PW} h={220} col={C.blue} o={conB} glow>
        <Txt x={24} y={14} s={24} b c={C.blue}>CALCULATE · dynamic engine</Txt>
        <div style={{position: 'absolute', left: 24, top: 58}}><div><Dax s={'CALCULATE([Total Sales],'} size={22} /></div><div><Dax s={'  Dim_Store[Region] = "Cairo")'} size={22} /></div></div>
        <Txt x={24} y={140} s={34} b m c={C.green}>= 4,820,000</Txt>
        <div style={{position: 'absolute', left: 24, top: 190, width: 532 * sw, height: 6, background: C.blue, borderRadius: 3}} />
      </Card>
      <Tag a={e1 + 6} b={SB[1] - 3} col={C.blue} k="The Crown Jewel of DAX" v="Modifying & Overriding Filter Context Dynamically" />
    </CursorProvider>
  );
};

/* ================= SC02 ================= */
const S2: React.FC = () => {
  const t = useT();
  const S = SB[1];
  const [e1, e2] = AN[1];
  const F = full(3);
  const tStart = S + 1.8;
  const enter = S + 8.3;
  const clicks: Click[] = [{t: S + 1.0, ...ppCellPt(3)}, {t: enter, ...okPt(OX, OY)}];
  const done = t >= enter + 0.1;
  const tp = typed(F, t, tStart, 14);
  const n = tp.length;
  const editing = t >= S + 1.05 && !done;
  const bo = fadeIn(t, S + 0.8, 0.5) * (1 - pr(t, e2 - 0.2, e2 + 0.3));
  const lit1 = n >= 35;
  const lit2 = n >= 65;
  const p1 = t >= e1 + 1 && t < e1 + 3.8;
  const p2 = t >= e1 + 3.8 && t < e2 - 0.2;
  const oo = fadeIn(t, e2 + 0.2, 0.6);
  const r = (x: number) => e2 + x;
  const beam = pr(t, r(8), r(9.4));
  const gone = t >= r(9.6);
  const rowBox = (y: number, label: string, ph: string, val: string, lit: boolean, hot: boolean, col: string) => (
    <div key={label}>
      <Txt x={24} y={y} s={24} b c={col}>{label}</Txt>
      <div style={{position: 'absolute', left: 24, top: y + 38, width: PW - 48, height: 84, borderRadius: 12, border: `2px ${lit ? 'solid' : 'dashed'} ${lit ? col : C.line}`, background: lit ? col + '22' : 'transparent', boxShadow: hot ? `0 0 28px ${col}` : 'none', lineHeight: '80px', paddingLeft: 18, transform: `scale(${hot ? 1.02 : 1})`}}>
        {lit ? <Dax s={val} size={23} /> : <span style={{color: C.dim, fontFamily: MONO, fontSize: 22}}>{ph}</span>}
      </div>
    </div>
  );
  return (
    <CursorProvider clicks={clicks}>
      <PPWin n={done ? 4 : 3} act={t >= S + 1.0 ? 3 : -1} typing={editing ? {i: 3, text: tp} : null}
        fx={editing ? {name: 'Cairo Sales', text: tp, typing: true, ok: true} : done ? {name: 'Cairo Sales', text: F} : {name: '', text: ''}}
        overlay={editing ? <Pop text={tp} start={13} fn="CALCULATE" list={['CALCULATE', 'CALCULATETABLE', 'CALENDAR', 'CALENDARAUTO']} tip="CALCULATE(<Expression>, <Filter1>, <Filter2>…)" endLen={66} /> : null} />
      <Card x={PX} y={OY} w={PW} h={560} col={C.blue} glow o={bo}>
        <Txt x={24} y={16} s={32} b m c={C.blue}>CALCULATE( … )</Txt>
        {rowBox(76, 'Expression', '<Expression>', '[Total Sales]', lit1, p1, C.blue)}
        {rowBox(226, 'Filter1', '<Filter1>', 'Dim_Store[Region] = "Cairo"', lit2, p2, C.green)}
        {rowBox(376, 'Filter2, …  (optional)', '<Filter2>', '', false, false, C.line)}
      </Card>
      <Card x={PX} y={OY + 580} w={PW} h={200} col={C.green} o={done ? bo : 0}>
        <Txt x={24} y={20} s={24} c={C.dim}>Result</Txt>
        <Txt x={24} y={62} s={30} b c={C.text}>Cairo Sales</Txt>
        <Txt x={24} y={112} s={50} b m c={C.green}>4,820,000</Txt>
      </Card>
      <Card x={PX} y={OY} w={PW} h={800} col={C.green} glow o={oo}>
        <Txt x={24} y={18} s={24} c={C.dim}>Filter Context (from the PivotTable)</Txt>
        <div style={{position: 'absolute', left: 24, top: 62, display: 'flex', gap: 12}}>
          <Chip l="Region = Giza" col={C.red} fill strike={gone} o={gone ? 0.35 : 1} size={26} />
          <Chip l="Year = 2026" col={C.blue} fill size={26} />
        </div>
        <div style={{position: 'absolute', left: 24, top: 78, width: 245 * beam, height: 8, background: C.green, borderRadius: 4, boxShadow: `0 0 16px ${C.green}`, opacity: gone ? 0 : 1}} />
        <Txt x={24} y={170} s={24} c={C.dim} o={fadeIn(t, r(3.4), 0.4)}>CALCULATE adds a filter</Txt>
        <div style={{position: 'absolute', left: 24, top: 214 + (1 - fadeIn(t, r(4), 0.6)) * 40, opacity: fadeIn(t, r(4), 0.6)}}><Chip l={'Region = "Cairo"'} col={C.green} fill size={30} /></div>
        <Txt x={24} y={350} s={24} c={C.dim} o={fadeIn(t, r(10.2), 0.4)}>Evaluated Filter Context</Txt>
        <div style={{position: 'absolute', left: 24, top: 394, display: 'flex', gap: 12, opacity: fadeIn(t, r(10.4), 0.5)}}>
          <Chip l="Region = Cairo" col={C.green} fill size={26} />
          <Chip l="Year = 2026" col={C.blue} fill size={26} />
        </div>
        <div style={{opacity: fadeIn(t, r(12), 0.5)}}>
          <Txt x={24} y={494} s={28} c={C.text}>Cairo Sales =</Txt>
          <Txt x={24} y={540} s={64} b m c={C.green}>4,820,000</Txt>
        </div>
        <Txt x={24} y={660} s={23} c={C.amber} w={PW - 48} o={fadeIn(t, r(14), 0.5)}>Only filters on the same column are replaced. Other columns (Year) merge.</Txt>
      </Card>
      <Tag a={S + 2.0} b={e1 + 6} col={C.blue} k="CALCULATE Architecture" v="CALCULATE(Expression, Filter1, Filter2, ...)" />
      <Tag a={r(8)} b={SB[2] - 1.2} col={C.green} k="Filter Overwrite Behavior" v="Overrides Existing Column Filters with New Context" />
    </CursorProvider>
  );
};

/* ================= SC03 ================= */
const S3: React.FC = () => {
  const t = useT();
  const S = SB[2];
  const [e1, e2] = AN[2];
  const F = full(4);
  const tStart = S + 2.8;
  const enter = e2 + 2.6;
  const names = ['Fact_Sales', 'Dim_Store', 'Dim_Product', 'Dim_Date'];
  const clicks: Click[] = [{t: S + 0.9, ...sheetPt(names, 'Dim_Product', OX, OY)}, {t: S + 2.2, ...ppCellPt(4)}, {t: enter, ...okPt(OX, OY)}];
  const done = t >= enter + 0.1;
  const tp = typed(F, t, tStart, 16);
  const editing = t >= S + 2.25 && !done;
  const scan0 = e1 + 0.8;
  const ri = Math.floor((t - scan0) / 1.6);
  const pass = (i: number) => PRODUCTS[i].m > 0.25;
  const co = fadeIn(t, S + 1.2, 0.5);
  const laser = pr(t, e2 + 0.4, e2 + 2.6);
  const val = done ? fmt(6300000 * eo(pr(t, enter + 0.1, enter + 0.9))) : '';
  return (
    <CursorProvider clicks={clicks}>
      <PPWin tb={t >= S + 0.95 ? 2 : 0} n={done ? 5 : 4} act={t >= S + 2.2 ? 4 : -1} typing={editing ? {i: 4, text: tp} : null}
        fx={editing ? {name: 'High Margin Sales', text: tp, typing: true, ok: true} : done ? {name: 'High Margin Sales', text: F} : {name: '', text: ''}}
        overlay={editing ? <Pop text={tp} start={45} fn="FILTER" list={['FILTER', 'FILTERS']} tip="FILTER(<Table>, <FilterExpression>)" endLen={F.length} /> : null} />
      <Card x={PX} y={OY} w={PW} h={800} col={C.purple} glow o={co}>
        <div style={{position: 'absolute', left: 24, top: 18}}><Dax s={'FILTER(Dim_Product, [Profit Margin] > 0.25)'} size={20} /></div>
        <Txt x={24} y={56} s={22} c={C.purple}>Table iterator · row by row</Txt>
        <Txt x={24} y={98} s={21} c={C.dim}>Product</Txt><Txt x={250} y={98} s={21} c={C.dim}>[Profit Margin]</Txt><Txt x={440} y={98} s={21} c={C.dim}>Keep?</Txt>
        {PRODUCTS.map((p, i) => {
          const cur = ri === i && t >= scan0;
          const seen = ri > i;
          return (
            <div key={p.k} style={{position: 'absolute', left: 16, top: 134 + i * 54, width: PW - 32, height: 48, borderRadius: 10, border: `2px solid ${cur ? C.purple : 'transparent'}`, background: cur ? 'rgba(168,85,247,.25)' : seen && pass(i) ? 'rgba(168,85,247,.12)' : 'transparent', boxShadow: cur ? `0 0 22px ${C.purple}` : 'none', opacity: seen && !pass(i) ? 0.4 : 1, direction: 'ltr', fontSize: 24, lineHeight: '44px'}}>
              <span style={{position: 'absolute', left: 10}}>{p.n}</span>
              <span style={{position: 'absolute', left: 240, fontFamily: MONO}}>{cur || seen ? `${Math.round(p.m * 100)}%` : '…'}</span>
              <span style={{position: 'absolute', left: 430, color: pass(i) ? C.green : C.red, fontWeight: 700}}>{seen ? (pass(i) ? '✓' : '✗') : ''}</span>
            </div>
          );
        })}
        <Txt x={24} y={474} s={22} c={C.dim} o={fadeIn(t, e1 + 8, 0.4)}>Filtered table · 3 rows</Txt>
        <div style={{position: 'absolute', left: 24, top: 512, display: 'flex', gap: 10, opacity: fadeIn(t, e1 + 8.4, 0.5)}}>
          {PRODUCTS.filter((p) => p.m > 0.25).map((p) => <Chip key={p.k} l={p.n} col={C.purple} fill size={22} />)}
        </div>
        <div style={{position: 'absolute', left: 280 - 4, top: 560 + 70 * laser, width: 8, height: 60, borderRadius: 4, background: `linear-gradient(${C.purple},transparent)`, boxShadow: `0 0 20px ${C.purple}`, opacity: laser > 0 && laser < 1 ? 1 : 0}} />
        <div style={{position: 'absolute', left: 24, top: 640, width: PW - 48, height: 136, borderRadius: 14, border: `2px solid ${laser >= 1 ? C.green : C.purple}`, background: 'rgba(15,23,42,.7)'}}>
          <Txt x={16} y={10} s={21} c={C.dim}>CALCULATE([Total Sales], filtered table)</Txt>
          <Txt x={16} y={52} s={52} b m c={C.green}>{done ? val : '…'}</Txt>
        </div>
      </Card>
      <Tag a={S + 3} b={e1 + 7} col={C.blue} k="Advanced FILTER Integration" v="CALCULATE([Measure], FILTER(Table, Expression))" />
      <Tag a={e2 + 1} b={SB[3] - 1.2} col={C.purple} k="Table Iterator Function" v="Returns Filtered Table Arguments for Complex Metrics" />
    </CursorProvider>
  );
};

/* ================= SC04 ================= */
const S4: React.FC = () => {
  const t = useT();
  const S = SB[3];
  const [e1, e2, e3] = AN[3];
  const clicks: Click[] = [{t: S + 1.0, ...ribPt(PP, 'Home', 'Diagram View', OX, OY)}, {t: e1 + 0.8, ...dgPt('fact')}, {t: e2 + 4.2, ...dgPt('prod')}];
  const diag = t >= S + 1.1;
  const hotF = t >= e1 + 0.8 && t < e2 + 4 ? 1 : 0;
  const hotP = t >= e2 + 4.2 ? 1 : 0;
  const scan = pr(t, e1 + 1, e1 + 8);
  const card = (y: number, h: number, col: string, o: number, title: string, code: string[], big: string, note: string, bar: number) => (
    <Card x={PX} y={OY + y} w={PW} h={h} col={col} o={o} glow>
      <Txt x={20} y={10} s={23} b c={col}>{title}</Txt>
      <div style={{position: 'absolute', left: 20, top: 46}}>{code.map((l, i) => <div key={i}><Dax s={l} size={20} /></div>)}</div>
      <Txt x={20} y={h - 66} s={26} b m c={C.text}>{big}</Txt>
      <div style={{position: 'absolute', left: 20, top: h - 28, width: PW - 40, height: 10, borderRadius: 5, background: '#0F172A'}}>
        <div style={{width: `${bar * 100}%`, height: 10, borderRadius: 5, background: col}} />
      </div>
      <Txt x={PW - 20 - 230} y={h - 66} s={20} c={col}><div style={{width: 230, textAlign: 'right'}}>{note}</div></Txt>
    </Card>
  );
  const g = fadeIn(t, e3 + 0.5, 0.6);
  const needle = -70 + 130 * eo(pr(t, e3 + 1, e3 + 4));
  return (
    <CursorProvider clicks={clicks}>
      <PPWin view={diag ? 'diagram' : 'data'} n={3} act={-1} hotF={hotF} hotP={hotP} fx={{name: '', text: ''}} />
      {card(0, 196, C.red, fadeIn(t, S + 1.8, 0.5), 'Heavy: FILTER over the fact table', ['FILTER(Fact_Sales,', '  Fact_Sales[Amount] > 500)'], `${fmt(50000 * scan)} rows scanned`, 'Slow', scan)}
      {card(208, 196, C.amber, fadeIn(t, e2 + 0.5, 0.5), 'Direct column filter', ['CALCULATE([Total Sales],', '  Fact_Sales[Amount] > 500)'], '1 column scanned', 'Fast', 0.08 * fadeIn(t, e2 + 1, 0.8))}
      {card(416, 196, C.amber, fadeIn(t, e2 + 4, 0.5), 'Small dimension table', ['FILTER(Dim_Product,', '  [Profit Margin] > 0.25)'], '6 rows scanned', 'Fast', 0.02 * fadeIn(t, e2 + 4.5, 0.8))}
      <Card x={PX} y={OY + 624} w={PW} h={176} col={C.amber} o={g} glow>
        <Txt x={20} y={10} s={23} b c={C.amber}>VertiPaq engine · scan speed</Txt>
        <svg width={PW} height={130} viewBox="0 0 580 130" style={{position: 'absolute', left: 0, top: 44}}>
          <path d="M110 110 A180 180 0 0 1 470 110" stroke="#0F172A" strokeWidth={22} fill="none" strokeLinecap="round" />
          <path d="M110 110 A180 180 0 0 1 290 -70" stroke={C.red} strokeWidth={22} fill="none" opacity={0.7} />
          <path d="M290 -70 A180 180 0 0 1 470 110" stroke={C.amber} strokeWidth={22} fill="none" />
          <g transform={`rotate(${needle} 290 110)`}><line x1={290} y1={110} x2={290} y2={-40} stroke={C.text} strokeWidth={6} strokeLinecap="round" /></g>
          <circle cx={290} cy={110} r={11} fill={C.text} />
        </svg>
      </Card>
      <Tag a={S + 1.6} b={e2 - 0.5} col={C.blue} k="Performance Best Practice" v="Filter Small Dimension Tables Instead of Heavy Fact Tables" />
      <Tag a={e3 + 1} b={SB[4] - 1} col={C.amber} k="Engine Efficiency" v="Direct Column Filters Maintain Lightning-Fast In-Memory Scanning" />
    </CursorProvider>
  );
};

/* ================= SC05 ================= */
const S5: React.FC = () => {
  const t = useT();
  const S = SB[4];
  const [e1, e2] = AN[4];
  const r = (x: number) => S + x;
  const T = {col: r(1.2), ins: r(3.6), pv: r(5.8), dm: r(8.0), ok: r(11.0), f1: r(13.0), f2: r(15.0), f3: r(17.0), f4: r(19.0), dat: r(28.0), ref: r(30.2)};
  const fld = (i: number) => ({x: OX + 834, y: OY + 236 + 78 + 44 * i + 22});
  const clicks: Click[] = [
    {t: T.col, x: OX + 776, y: OY + 250}, {t: T.ins, ...tabPt(XL, 'Insert', OX, OY)}, {t: T.pv, ...ribPt(XL, 'Insert', 'PivotTable', OX, OY)},
    {t: T.dm, x: OX + 175, y: OY + 280}, {t: T.ok, x: OX + 330 + 560 - 250 + 50, y: OY + 300 + 250 - 62 + 20},
    {t: T.f1, ...fld(0)}, {t: T.f2, ...fld(1)}, {t: T.f3, ...fld(2)}, {t: T.f4, ...fld(3)},
    {t: T.dat, ...tabPt(XL, 'Data', OX, OY)}, {t: T.ref, ...ribPt(XL, 'Data', 'Refresh All', OX, OY)},
  ];
  const tab = pick<string>([[T.ins + 0.05, 'Insert'], [T.dat + 0.05, 'Data']], t, 'Home');
  const tabAt = t >= T.ins + 0.05 ? (t >= T.dat + 0.05 ? T.dat + 0.05 : T.ins + 0.05) : undefined;
  const sheet2 = t >= T.ok + 0.3;
  const menu = t >= T.pv + 0.1 && t < T.dm + 0.15;
  const dlg = t >= T.dm + 0.3 && t < T.ok + 0.1;
  const ch = [t >= T.f1 + 0.1, t >= T.f2 + 0.1, t >= T.f3 + 0.1, t >= T.f4 + 0.1];
  const refreshing = t >= T.ref && t < T.ref + 1.2;
  const colSel = t >= T.col && !sheet2;
  const dlgO = fadeIn(t, T.dm + 0.3, 0.3);
  const vals = [['Total Sales', 'sales'], ['Cairo Sales', 'cairo'], ['High Margin Sales', 'hm']];
  const pcell = (c: number, rr: number) => {
    if (rr === 2) return c === 0 ? (ch[0] ? 'Row Labels' : '') : ch[c] ? vals[c - 1][0] : '';
    if (rr >= 3 && rr <= 6) {
      const s = STORES[rr - 3];
      if (c === 0) return ch[0] ? s.r : '';
      return ch[c] ? fmt(c === 1 ? s.sales : c === 2 ? 4820000 : s.hm) : '';
    }
    if (rr === 7) return !ch[0] ? '' : c === 0 ? 'Grand Total' : ch[c] ? fmt(c === 1 ? 12000000 : c === 2 ? 4820000 : 6300000) : '';
    return '';
  };
  const psty = (c: number, rr: number): React.CSSProperties | undefined => {
    if (rr === 2 && ch[0] && (c === 0 || ch[c])) return {background: '#1F4D3A', fontWeight: 700, color: C.text, textAlign: c === 0 ? 'left' : 'right'};
    if (rr === 7 && ch[0]) return {fontWeight: 700, borderTop: `2px solid ${C.green}`, textAlign: c === 0 ? 'left' : 'right'};
    if (rr >= 3 && rr <= 6 && c > 0) return {textAlign: 'right', background: refreshing ? 'rgba(56,189,248,.2)' : undefined};
    return undefined;
  };
  const sheets = sheet2 ? ['Fact_Sales', 'Sheet2'] : ['Fact_Sales'];
  const labels = ['Region (Dim_Store)', 'Total Sales', 'Cairo Sales', 'High Margin Sales'];
  const menuItems = ['From Table/Range', 'From External Data Source', 'From Data Model'];
  const overlay = (
    <div>
      {menu ? (
        <div style={{position: 'absolute', left: 8, top: 170, width: 330, background: '#1E293B', border: `1px solid ${C.blue}`, borderRadius: 6, zIndex: 15, direction: 'ltr', fontSize: 19}}>
          {menuItems.map((m, i) => <Hit key={m} x={8} y={170 + i * 44} w={330} h={44} r={4}><div style={{padding: '0 14px', lineHeight: '42px'}}>{m}</div></Hit>)}
        </div>
      ) : null}
      {dlg ? (
        <div>
          <Dialog x={330} y={300} w={560} h={250} title="PivotTable from Data Model" o={dlgO}>
            <div style={{padding: '14px 20px', fontSize: 19, lineHeight: '34px'}}>Choose where you want the PivotTable report to be placed<br />◉ New Worksheet<br />○ Existing Worksheet</div>
          </Dialog>
          <Hit x={330 + 560 - 250} y={300 + 250 - 62} w={100} h={40} base={C.green + '55'} style={{zIndex: 25}}><div style={{textAlign: 'center', lineHeight: '38px', fontSize: 19, fontWeight: 700, direction: 'ltr'}}>OK</div></Hit>
          <Hit x={330 + 560 - 130} y={300 + 250 - 62} w={100} h={40} base="#334155" style={{zIndex: 25}}><div style={{textAlign: 'center', lineHeight: '38px', fontSize: 19, direction: 'ltr'}}>Cancel</div></Hit>
        </div>
      ) : null}
    </div>
  );
  const o1 = fadeIn(t, r(0.5), 0.5);
  const cnt = Math.round(50000 * eo(pr(t, r(0.6), r(3.2))));
  const o2 = fadeIn(t, T.f1, 0.5);
  const o3 = fadeIn(t, T.f4 + 0.6, 0.5);
  const ms = (1.8 * eo(pr(t, T.f4 + 0.7, T.f4 + 1.6))).toFixed(1);
  const seal = eo(pr(t, e2 + 0.8, e2 + 1.8));
  return (
    <CursorProvider clicks={clicks}>
      <AppWin app={XL} ox={OX} oy={OY} tab={tab} tabAt={tabAt} fx={sheet2 ? {name: 'A3', text: ch[0] ? 'Row Labels' : ''} : {name: 'F1', text: 'Amount'}} sheets={sheets} sheet={sheet2 ? 1 : 0}
        status={refreshing ? 'Refreshing Data Model…' : 'Ready'} statusR={colSel ? 'Average: 240   Count: 50,001   Sum: 12,000,000' : sheet2 && ch[3] ? 'Calculation: 1.8 ms' : ''} overlay={overlay}>
        {sheet2 ? (
          <div>
            <Grid cols={[{w: 180}, {w: 170, a: 'r'}, {w: 170, a: 'r'}, {w: 210, a: 'r'}]} rows={15} cell={pcell} sty={psty} sel={ch[0] ? {c1: 0, r1: 2, c2: ch[3] ? 3 : ch[2] ? 2 : ch[1] ? 1 : 0, r2: 7, handle: false} : null} />
            <div style={{position: 'absolute', left: 830, top: 0, width: 400, height: 502, background: '#162033', borderLeft: `2px solid ${C.line}`}} />
            <Txt x={850} y={14} s={21} b>PivotTable Fields</Txt>
            {labels.map((l, i) => (
              <Hit key={l} x={840} y={78 + 44 * i} w={380} h={42} r={4}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px', lineHeight: '40px', fontSize: 20, direction: 'ltr'}}>
                  <span style={{width: 22, height: 22, border: `2px solid ${ch[i] ? C.green : C.dim}`, background: ch[i] ? C.green : 'transparent', borderRadius: 4, display: 'inline-block', marginTop: 8, textAlign: 'center', lineHeight: '18px', fontSize: 16}}>{ch[i] ? '✓' : ''}</span>{l}
                </div>
              </Hit>
            ))}
            <Txt x={850} y={290} s={19} c={C.dim}>Rows</Txt>
            <Txt x={850} y={318} s={20} c={C.text}>{ch[0] ? 'Region' : ''}</Txt>
            <Txt x={850} y={370} s={19} c={C.dim}>Values</Txt>
            <Txt x={850} y={398} s={20} c={C.text} w={360}>{[1, 2, 3].filter((i) => ch[i]).map((i) => labels[i]).join(' · ')}</Txt>
            <Txt x={70} y={400} s={19} c={C.amber} w={740} o={ch[2] ? fadeIn(t, T.f3 + 0.4, 0.5) : 0}>Cairo Sales is the same on every row: CALCULATE overwrote the Region filter.</Txt>
          </div>
        ) : (
          <Grid cols={FCOLS} rows={15} cell={(c, rr) => (rr === 0 ? FH[c] : fcell(c, rr - 1))} sel={colSel ? {c1: 5, r1: 0, c2: 5, r2: 14, handle: false} : {c1: 0, r1: 0, c2: 0, r2: 0}} headRow />
        )}
      </AppWin>
      <Card x={PX} y={OY} w={PW} h={160} col={C.blue} o={o1}>
        <div style={{position: 'absolute', left: 20, top: 16}}><Ic n="doc" s={38} c={C.blue} /></div>
        <Txt x={72} y={16} s={25} b m>manzooma_sales_2026.xlsx</Txt>
        <Txt x={20} y={72} s={50} b m c={C.blue}>{fmt(cnt)}</Txt>
        <Txt x={20} y={126} s={21} c={C.dim}>sales rows in the Data Model</Txt>
      </Card>
      <Card x={PX} y={OY + 176} w={PW} h={240} col={C.green} o={o2}>
        <Txt x={20} y={12} s={24} b c={C.green}>Measures deployed</Txt>
        {['Total Sales', 'Cairo Sales', 'High Margin Sales'].map((m, i) => (
          <Txt key={m} x={24} y={62 + i * 54} s={29} o={ch[i + 1] ? 1 : 0.25} c={ch[i + 1] ? C.text : C.dim}>{ch[i + 1] ? '✓  ' : '○  '}{m}</Txt>
        ))}
      </Card>
      <Card x={PX} y={OY + 432} w={PW} h={160} col={C.amber} o={o3}>
        <Txt x={20} y={12} s={22} c={C.dim}>Context modification time</Txt>
        <Txt x={20} y={46} s={64} b m c={C.amber}>{ms} ms</Txt>
        <Txt x={20} y={124} s={17} c={C.dim}>Illustrative timing on the sample model</Txt>
      </Card>
      <Card x={PX} y={OY + 608} w={PW} h={192} col={C.green} o={seal} glow>
        <svg width={PW} height={192} viewBox="0 0 580 192" style={{position: 'absolute', left: 0, top: 0}}>
          <circle cx={110} cy={96} r={70 * seal} fill="rgba(16,185,129,.2)" stroke={C.green} strokeWidth={6} />
          <path d="M78 96 L102 120 L146 70" stroke={C.green} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={seal} />
        </svg>
        <Txt x={210} y={44} s={26} b c={C.green} w={350}>Enterprise CALCULATE Seal</Txt>
        <Txt x={210} y={112} s={22} c={C.dim} w={350}>Context shift validated</Txt>
      </Card>
      <Tag a={r(2.0)} b={e1 - 0.5} col={C.blue} k="Enterprise DAX Pipeline" v="Deploy CALCULATE & FILTER Across 50,000 Sales Rows" />
      <Tag a={e2 + 1.0} b={SB[5] - 1} col={C.green} k="Zero Latency Context Shift" v="High-Speed Context Modification Engine Processing in <2ms" />
    </CursorProvider>
  );
};

/* ================= SC06 ================= */
const S6: React.FC = () => {
  const t = useT();
  const S = SB[5];
  const [e1, e2, e3] = AN[5];
  const black = pr(t, 239.0, 240.0);
  const prog = eo(pr(t, S + 3, S + 6.5));
  const skills = ['CALCULATE بتعدّل Filter Context', 'Filter Overwrite: الشرط الصريح بيستبدل فلتر نفس العمود', 'FILTER كجدول مصفى جوه CALCULATE', 'الفلترة على جداول الأبعاد الصغيرة أو العمود مباشرة'];
  const ck = eo(pr(t, S + 0.2, S + 1.0));
  const nx = fadeIn(t, e3 + 0.5, 0.7);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 140, top: 60, width: 1640, height: 960, borderRadius: 30, background: 'rgba(30,41,59,.78)', border: '2px solid rgba(56,189,248,.35)', fontFamily: AR, color: C.text, opacity: fadeIn(t, S, 0.6)}}>
        <Img src={staticFile(LOGO)} style={{position: 'absolute', left: 40, top: 20, width: 96, height: 96}} />
        <div style={{position: 'absolute', left: 150, top: 34, fontSize: 46, fontWeight: 700, direction: 'rtl'}}>منظومة أكاديمي <span style={{color: C.dim}}>|</span> <span style={{direction: 'ltr', unicodeBidi: 'isolate'}}>Manzooma Excel Masterclass</span></div>
        <svg width={110} height={110} viewBox="0 0 110 110" style={{position: 'absolute', left: 40, top: 140}}>
          <circle cx={55} cy={55} r={46 * ck} fill="rgba(16,185,129,.2)" stroke={C.green} strokeWidth={6} />
          <path d="M32 56 L48 72 L80 38" stroke={C.green} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={ck} />
        </svg>
        <div style={{position: 'absolute', left: 170, top: 128, fontSize: 40, fontWeight: 700, color: C.green, direction: 'ltr'}}>CALCULATE & FILTER Engine Mastered</div>
        <div style={{position: 'absolute', left: 170, top: 186, fontSize: 32, color: C.text, direction: 'rtl'}}>الدرس {LESSON} من {LESSONS} · الوحدة {UNIT} من {UNITS} · الدرس الرابع في الوحدة</div>
        <div style={{position: 'absolute', left: 40, top: 284, width: 1560, height: 26, borderRadius: 13, background: '#0F172A', border: `2px solid ${C.line}`}}>
          <div style={{width: `${78.9 * prog}%`, height: '100%', borderRadius: 13, background: `linear-gradient(90deg,${C.blue},${C.green})`}} />
        </div>
        <div style={{position: 'absolute', left: 40, top: 322, fontSize: 28, color: C.dim, direction: 'rtl'}}>تقدم الكورس: {LESSON} من {LESSONS} درساً</div>
        <div style={{position: 'absolute', right: 40, top: 322, fontSize: 32, fontWeight: 700, color: C.green, fontFamily: MONO}}>{(78.9 * prog).toFixed(1)}%</div>
        {skills.map((s, i) => {
          const o = fadeIn(t, e1 + 0.6 + i * 2.3, 0.5);
          return <div key={i} style={{position: 'absolute', right: 60, top: 392 + i * 62 + (1 - o) * 16, opacity: o, fontSize: 36, direction: 'rtl'}}><span style={{color: C.green, fontWeight: 700}}>✓</span>&nbsp;&nbsp;{s}</div>;
        })}
        <div style={{position: 'absolute', left: 40, top: 650, opacity: fadeIn(t, e2 + 0.5, 0.5), border: `2px solid ${C.blue}`, borderRadius: 16, padding: '10px 26px', fontSize: 36, fontFamily: MONO, direction: 'ltr'}}>solutions.gomaaintelligence.me</div>
        <div style={{position: 'absolute', right: 40, top: 650, opacity: fadeIn(t, e2 + 2, 0.5), border: `2px solid ${C.green}`, borderRadius: 16, padding: '10px 26px', fontSize: 32, fontFamily: MONO, direction: 'ltr'}}>manzooma_sales_2026.xlsx</div>
        <div style={{position: 'absolute', left: 40, top: 760 + (1 - nx) * 30, width: 1560, height: 160, opacity: nx, borderRadius: 20, border: `2px solid ${C.blue}`, background: 'rgba(56,189,248,.1)', boxSizing: 'border-box', padding: '16px 30px'}}>
          <div style={{fontSize: 28, color: C.blue, direction: 'rtl'}}>الدرس القادم</div>
          <div style={{fontSize: 38, fontWeight: 700, direction: 'rtl', marginTop: 6}}>الدرس 61 (الوحدة {UNIT} من {UNITS}): إزالة الفلاتر والتحكم في سياق التقرير</div>
          <div style={{fontSize: 30, fontFamily: MONO, color: C.blue, direction: 'ltr', marginTop: 8}}>ALL &amp; ALLEXCEPT Engine</div>
        </div>
      </div>
      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 20% 8%, #172544 0%, ${C.bg} 62%)`, fontFamily: AR}}>
    <Audio src={staticFile(VOICE)} />
    <Scene from={0} to={SB[5]}><Chrome /></Scene>
    <Scene from={SB[0]} to={SB[1]}><S1 /></Scene>
    <Scene from={SB[1]} to={SB[2]}><S2 /></Scene>
    <Scene from={SB[2]} to={SB[3]}><S3 /></Scene>
    <Scene from={SB[3]} to={SB[4]}><S4 /></Scene>
    <Scene from={SB[4]} to={SB[5]}><S5 /></Scene>
    <Scene from={SB[5]} to={SB[6]}><S6 /></Scene>
  </AbsoluteFill>
);
