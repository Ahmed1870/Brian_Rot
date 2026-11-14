import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile} from 'remotion';
import {AR, AppDef, AppWin, Card, Chrome, Click, CursorProvider, Dialog, GCol, Grid, Hit, Ic, MONO, Scene, Tag, XL, XLC, eo, fadeIn, fmt, pick, pr, ribPt, sheetPt, tabPt, useT} from './kit';
import {Bars, Hist, Lines, PIE12, Pie, Scatter, Stack} from './charts';
import {AN, C, LESSON, LESSONS, LOGO, PRODUCTS, SB, STORES, UNIT, UNITS, VOICE} from './theme';

const OX = 40, OY = 108, PX = 1300, PW = 580;
const CX = 530, CY = 16, CW = 680, CH = 420;

/* ---------- illustrative data (K EGP, totals = 12,000 K) ---------- */
const PROD15: [string, string, number][] = [
  ['Fast Wall Charger 25W', 'Wall Charger', 1650], ['Wireless Earbuds Pro', 'Earbuds Pro', 1480], ['Power Bank 20,000 mAh', 'Power Bank', 1320],
  ['Ergonomic Wireless Mouse', 'Wireless Mouse', 1210], ['Tempered Glass Screen Protector', 'Screen Guard', 1100], ['Silicone Phone Case', 'Phone Case', 980],
  ['USB-C Braided Cable 2m', 'USB-C Cable', 860], ['Bluetooth Speaker Mini', 'BT Speaker', 790], ['Laptop Cooling Stand', 'Cooling Stand', 700],
  ['Mechanical Keyboard RGB', 'Keyboard RGB', 610], ['Webcam Full HD 1080p', 'Webcam HD', 500], ['Smart Watch Strap', 'Watch Strap', 360],
  ['Car Phone Holder', 'Car Holder', 220], ['Memory Card 128GB', 'Memory Card', 130], ['Screen Cleaning Kit', 'Cleaning Kit', 90],
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MSALES = [820, 780, 860, 900, 940, 990, 1010, 1050, 1080, 1120, 1200, 1250];
const REPS: [string, number][] = [['Ahmed', 2900], ['Mona', 2600], ['Karim', 2300], ['Salma', 2400], ['Omar', 1800]];
const MIX: [string, number[]][] = [['Cairo', [1900, 1600, 1320]], ['Giza', [1200, 1000, 950]], ['Alexandria', [1000, 900, 740]], ['Mansoura', [500, 480, 410]]];
const MIXN = ['Power', 'Audio', 'Accessories'];
const MIXC = [C.blue, C.purple, C.amber];
const ADS = [...Array(15)].map((_, i) => {
  const x = 12 + 6 * i;
  return [x, Math.max(40, Math.round(9 * x + (((i * 37) % 11) - 5) * 28))];
});
const AGES = [420, 1180, 1850, 1620, 1040, 560, 230, 100];
const AGEL = ['18-24', '25-31', '32-38', '39-45', '46-52', '53-59', '60-66', '67-73'];
const BR = STORES.map((s) => ({l: s.r, v: s.sales / 1000}));
const PIE_V = MIX.flatMap((m) => m[1]);
const PIE_N = MIX.flatMap((m) => MIXN.map((n) => `${m[0].slice(0, 3)}-${n.slice(0, 3)}`));
const CAT_TOT = [0, 1, 2].map((j) => MIX.reduce((a, m) => a + m[1][j], 0));
const rowGen = (r: number) => {
  const p = PRODUCTS[(r * 5) % 6];
  const q = 1 + ((r * 7) % 3);
  const amt = p.price * q;
  return [1001 + r, `${String(3 + Math.floor(r / 3)).padStart(2, '0')}/01/2026`, 1 + ((r * 3) % 4), p.k, q, fmt(amt), fmt(Math.round(amt * (1 - p.m)))].map(String);
};

type DS = {cols: GCol[]; head: string[]; rows: string[][]};
const DSS: Record<string, DS> = {
  Branches: {cols: [{w: 300}, {w: 160, a: 'r'}], head: ['Branch', 'Sales (K EGP)'], rows: BR.map((b) => [b.l, fmt(b.v)])},
  Products: {cols: [{w: 300}, {w: 160, a: 'r'}], head: ['Product', 'Sales (K EGP)'], rows: PROD15.map((p) => [p[0], fmt(p[2])])},
  Monthly: {cols: [{w: 300}, {w: 160, a: 'r'}], head: ['Month', 'Sales (K EGP)'], rows: MONTHS.map((m, i) => [m, fmt(MSALES[i])])},
  Reps: {cols: [{w: 300}, {w: 160, a: 'r'}], head: ['Sales Rep', 'Sales (K EGP)'], rows: REPS.map((r) => [r[0], fmt(r[1])])},
  Mix: {cols: [{w: 130}, {w: 90, a: 'r'}, {w: 90, a: 'r'}, {w: 140, a: 'r'}], head: ['Region', ...MIXN], rows: MIX.map((m) => [m[0], ...m[1].map(fmt)])},
  Ads: {cols: [{w: 170, a: 'r'}, {w: 150, a: 'r'}], head: ['Ad Spend (K)', 'Sales (K)'], rows: ADS.map((a) => [String(a[0]), fmt(a[1])])},
  Ages: {cols: [{w: 200}, {w: 150, a: 'r'}], head: ['Age Group', 'Customers'], rows: AGEL.map((l, i) => [l, fmt(AGES[i])])},
  Fact: {cols: [{w: 120, a: 'r'}, {w: 150}, {w: 120, a: 'r'}, {w: 140, a: 'r'}, {w: 80, a: 'r'}, {w: 130, a: 'r'}, {w: 120, a: 'r'}], head: ['SaleID', 'OrderDate', 'StoreKey', 'ProductKey', 'Qty', 'Amount', 'Cost'], rows: [...Array(15)].map((_, i) => rowGen(i))},
  Dash: {cols: [...Array(9)].map(() => ({w: 130})), head: [], rows: []},
};
const gp = (ds: string, c: number, r: number) => {
  const cols = DSS[ds].cols;
  const x = cols.slice(0, c).reduce((a, q) => a + q.w, 0) + cols[c].w / 2;
  return {x: OX + 56 + x, y: OY + 236 + 28 + r * 28 + 14};
};
const rng = (ds: string) => ({c1: 0, r1: 0, c2: DSS[ds].cols.length - 1, r2: DSS[ds].rows.length, handle: false});

const XWin: React.FC<{app?: AppDef; tab: string; tabAt?: number; ds: string; sheets: string[]; sheet: number; sel?: {c1: number; r1: number; c2: number; r2: number; handle?: boolean} | null; fx?: {name: string; text: string}; status?: string; statusR?: string; overlay?: React.ReactNode; children?: React.ReactNode}> = (p) => {
  const d = DSS[p.ds];
  return (
    <AppWin app={p.app || XLC} ox={OX} oy={OY} tab={p.tab} tabAt={p.tabAt} fx={p.fx || {name: 'A1', text: d.head[0] || ''}} sheets={p.sheets} sheet={p.sheet} status={p.status} statusR={p.statusR} overlay={p.overlay}>
      <Grid cols={d.cols} rows={16} rowH={28} cell={(c, r) => (r === 0 ? d.head[c] || '' : d.rows[r - 1]?.[c] ?? '')} sel={p.sel === undefined ? {c1: 0, r1: 0, c2: 0, r2: 0} : p.sel} headRow />
      {p.children}
    </AppWin>
  );
};
const CB: React.FC<{x?: number; y?: number; w?: number; h?: number; sel?: boolean; children?: React.ReactNode}> = ({x = CX, y = CY, w = CW, h = CH, sel = false, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, border: `3px solid ${sel ? C.green : C.line}`, borderRadius: 12, boxSizing: 'border-box', overflow: 'hidden'}}>
    {children}
    {sel ? [[-2, -2], [w - 14, -2], [-2, h - 14], [w - 14, h - 14]].map((q, i) => <div key={i} style={{position: 'absolute', left: q[0], top: q[1], width: 9, height: 9, background: '#fff', border: `2px solid ${C.green}`}} />) : null}
  </div>
);
const Badge: React.FC<{x: number; y: number; ok: boolean; s: string; o: number}> = ({x, y, ok, s, o}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: o, background: ok ? 'rgba(16,185,129,.92)' : 'rgba(239,68,68,.94)', border: '2px solid #fff3', borderRadius: 12, padding: '6px 16px', fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: AR, direction: 'ltr', boxShadow: `0 0 24px ${ok ? C.green : C.red}`}}>{ok ? '✓ ' : '✗ '}{s}</div>
);
const rv = (t: number, a: number, d: number) => pr(t, a, a + d);

type Rule = {a: number; col: string; h: string; s: string; bad?: boolean};
const Rules: React.FC<{title: string; col: string; rules: Rule[]}> = ({title, col, rules}) => {
  const t = useT();
  return (
    <Card x={PX} y={OY} w={PW} h={800} col={col} glow>
      <div style={{position: 'absolute', left: 24, top: 16, fontSize: 28, fontWeight: 700, color: col, direction: 'ltr'}}>{title}</div>
      {rules.map((r, i) => {
        const o = fadeIn(t, r.a, 0.5);
        return (
          <div key={i} style={{position: 'absolute', left: 20, top: 78 + i * 178 + (1 - o) * 20, width: PW - 40, height: 164, opacity: o, border: `2px solid ${r.col}`, borderRadius: 14, background: r.col + '18', boxSizing: 'border-box', padding: '14px 18px', direction: 'ltr'}}>
            <div style={{fontSize: 31, fontWeight: 700, color: r.col}}>{r.bad ? '✗ ' : '✓ '}{r.h}</div>
            <div style={{fontSize: 24, color: C.text, marginTop: 8, lineHeight: '32px'}}>{r.s}</div>
          </div>
        );
      })}
    </Card>
  );
};

/* ================= SC01 ================= */
const S1: React.FC = () => {
  const t = useT();
  const [e1, e2] = AN[0];
  const clicks: Click[] = [
    {t: 2.2, ...gp('Branches', 0, 0)}, {t: 3.6, ...gp('Branches', 1, 4)}, {t: 5.4, ...tabPt(XL, 'Insert', OX, OY)}, {t: 8.0, ...ribPt(XL, 'Insert', 'Recommended Charts', OX, OY)},
    {t: 12.4, x: OX + 250 + 730 - 240 + 50, y: OY + 200 + 380 - 62 + 20},
  ];
  const dlg = t >= 8.2 && t < 12.5;
  const rng2 = t >= 3.65;
  const chart = t >= 12.5;
  const overlay = dlg ? (
    <div>
      <Dialog x={250} y={200} w={730} h={380} title="Insert Chart · Recommended Charts" o={fadeIn(t, 8.2, 0.3)}>
        {['Clustered Column', 'Line', 'Pie'].map((n, i) => <div key={n} style={{position: 'absolute', left: 14, top: 56 + i * 52, width: 220, height: 44, lineHeight: '42px', paddingLeft: 12, fontSize: 20, background: i === 0 ? '#0369A1' : '#273449', border: `1px solid ${C.line}`, borderRadius: 6}}>{n}</div>)}
        <div style={{position: 'absolute', left: 260, top: 56, width: 440, height: 250}}><Bars w={440} h={250} d={BR} p={rv(t, 8.6, 1.2)} title="Sales by Branch" /></div>
      </Dialog>
      <Hit x={250 + 730 - 240} y={200 + 380 - 62} w={100} h={40} base={C.green + '55'} style={{zIndex: 25}}><div style={{textAlign: 'center', lineHeight: '38px', fontSize: 19, fontWeight: 700, direction: 'ltr'}}>OK</div></Hit>
      <Hit x={250 + 730 - 120} y={200 + 380 - 62} w={100} h={40} base="#334155" style={{zIndex: 25}}><div style={{textAlign: 'center', lineHeight: '38px', fontSize: 19, direction: 'ltr'}}>Cancel</div></Hit>
    </div>
  ) : null;
  const chaos = fadeIn(t, e1, 0.7);
  const rows: [string, string, string][] = [['Comparison', 'Column / Bar', 'chart'], ['Trend', 'Line Chart', 'line'], ['Part-to-Whole', 'Stacked Bar / Pie', 'pie'], ['Relationship', 'Scatter / Histogram', 'scatter']];
  return (
    <CursorProvider clicks={clicks}>
      <XWin app={XL} tab={t >= 5.45 ? 'Insert' : 'Home'} tabAt={t >= 5.45 ? 5.45 : undefined} ds="Branches" sheets={['Branches']} sheet={0} sel={t >= 2.25 ? (rng2 ? rng('Branches') : {c1: 0, r1: 0, c2: 0, r2: 0}) : {c1: 0, r1: 0, c2: 0, r2: 0}} status={rng2 ? 'Ready' : 'Ready'} statusR={rng2 ? 'Average: 3,000   Count: 10   Sum: 12,000' : ''} overlay={overlay}>
        {chart ? <CB sel><Bars w={CW - 6} h={CH - 6} d={BR} p={rv(t, 12.5, 1.2)} title="Sales by Branch (K EGP)" grid={false} lab /></CB> : null}
      </XWin>
      <Card x={PX} y={OY} w={PW} h={300} col={C.red} glow o={chaos}>
        <div style={{position: 'absolute', left: 20, top: 8, fontSize: 25, fontWeight: 700, color: C.red, direction: 'ltr'}}>Random chart choice</div>
        <div style={{position: 'absolute', left: 6, top: 44}}><Pie w={PW - 16} h={246} v={PIE_V} cols={PIE12} names={PIE_N} lab rm={44} /></div>
      </Card>
      <Card x={PX} y={OY + 316} w={PW} h={484} col={C.blue} glow o={fadeIn(t, e2, 0.6)}>
        <div style={{position: 'absolute', left: 20, top: 12, fontSize: 26, fontWeight: 700, color: C.blue, direction: 'ltr'}}>Analytical Intent Routing</div>
        {rows.map((r, i) => {
          const a = e2 + 1.0 + i * 2.8;
          const o = fadeIn(t, a, 0.5);
          return (
            <div key={r[0]} style={{position: 'absolute', left: 20, top: 66 + i * 102, width: PW - 40, height: 88, opacity: o, direction: 'ltr'}}>
              <div style={{position: 'absolute', left: 0, top: 18, width: 190, height: 52, border: `2px solid ${C.blue}`, borderRadius: 12, textAlign: 'center', lineHeight: '48px', fontSize: 22, fontWeight: 700, background: 'rgba(56,189,248,.15)'}}>{r[0]}</div>
              <svg width={120} height={88} style={{position: 'absolute', left: 196, top: 0}}><line x1={4} y1={44} x2={104} y2={44} stroke={C.blue} strokeWidth={5} strokeDasharray="12 10" strokeDashoffset={-t * 40} /><path d="M96 34 L112 44 L96 54" stroke={C.blue} strokeWidth={5} fill="none" /></svg>
              <div style={{position: 'absolute', left: 322, top: 20, display: 'flex', gap: 8, alignItems: 'center', fontSize: 21, whiteSpace: 'nowrap'}}><Ic n={r[2]} s={28} c={C.green} />{r[1]}</div>
            </div>
          );
        })}
      </Card>
      <Tag a={e1 + 8} b={SB[1] - 3} col={C.blue} k="3-Second Executive Clarity" v="Matching Analytical Intent to Optimal Visual Geometry" />
    </CursorProvider>
  );
};

/* ================= SC02 ================= */
const S2: React.FC = () => {
  const t = useT();
  const a = SB[1];
  const [e1, e2, e3] = AN[1];
  const sheets = ['Branches', 'Products', 'Monthly', 'Reps'];
  const T = {a1: a + 1.4, a2: a + 2.6, ins: a + 4.2, col: e1 + 0.9, prod: e2 + 0.2, pc: e2 + 1.6, pb: e2 + 5.2, mon: e3 + 0.4, ln: e3 + 2.0, rep: e3 + 8.0, rl: e3 + 9.6, rc: e3 + 13.0};
  const clicks: Click[] = [
    {t: T.a1, ...gp('Branches', 0, 0)}, {t: T.a2, ...gp('Branches', 1, 4)}, {t: T.ins, ...tabPt(XLC, 'Insert', OX, OY)}, {t: T.col, ...ribPt(XLC, 'Insert', 'Column Chart', OX, OY)},
    {t: T.prod, ...sheetPt(sheets, 'Products', OX, OY)}, {t: T.pc, ...ribPt(XLC, 'Insert', 'Column Chart', OX, OY)}, {t: T.pb, ...ribPt(XLC, 'Insert', 'Bar Chart', OX, OY)},
    {t: T.mon, ...sheetPt(sheets, 'Monthly', OX, OY)}, {t: T.ln, ...ribPt(XLC, 'Insert', 'Line Chart', OX, OY)},
    {t: T.rep, ...sheetPt(sheets, 'Reps', OX, OY)}, {t: T.rl, ...ribPt(XLC, 'Insert', 'Line Chart', OX, OY)}, {t: T.rc, ...ribPt(XLC, 'Insert', 'Column Chart', OX, OY)},
  ];
  const sh = pick<number>([[T.prod + 0.05, 1], [T.mon + 0.05, 2], [T.rep + 0.05, 3]], t, 0);
  const ds = sheets[sh];
  const sel = sh === 0 ? (t >= T.a2 + 0.05 ? rng('Branches') : t >= T.a1 + 0.05 ? {c1: 0, r1: 0, c2: 0, r2: 0} : {c1: 0, r1: 0, c2: 0, r2: 0}) : rng(ds);
  const W = CW - 6, H = CH - 6;
  let chart: React.ReactNode = null;
  if (sh === 0 && t >= T.col) chart = <Bars w={W} h={H} d={BR} p={rv(t, T.col + 0.1, 1.2)} title="Sales by Branch (K EGP)" col={C.green} lab grid={false} />;
  if (sh === 1 && t >= T.pc) {
    const f = eo(rv(t, T.pb + 0.1, 1.4));
    const long = PROD15.map((p) => ({l: p[0], v: p[2]}));
    chart = (
      <div>
        {t < T.pb + 1.5 ? <div style={{position: 'absolute', left: 0, top: 0, opacity: 1 - f}}><Bars w={W} h={H} d={long} angled p={rv(t, T.pc + 0.1, 1.2)} title="Sales by Product (K EGP)" col={C.red} /></div> : null}
        {t >= T.pb ? <div style={{position: 'absolute', left: 0, top: 0, opacity: f}}><Bars w={W} h={H} d={long} dir="h" p={rv(t, T.pb + 0.3, 1.4)} title="Sales by Product (K EGP)" col={C.green} lab grid={false} /></div> : null}
      </div>
    );
  }
  if (sh === 2 && t >= T.ln) chart = <Lines w={W} h={H} d={MSALES} labels={MONTHS} p={rv(t, T.ln + 0.1, 2.4)} title="Monthly Sales (K EGP)" lab />;
  if (sh === 3 && t >= T.rl && t < T.rc) chart = <Lines w={W} h={H} d={REPS.map((r) => r[1])} labels={REPS.map((r) => r[0])} p={rv(t, T.rl + 0.1, 1.4)} title="Sales by Rep (K EGP)" col={C.red} />;
  if (sh === 3 && t >= T.rc) chart = <Bars w={W} h={H} d={REPS.map((r) => ({l: r[0], v: r[1]}))} p={rv(t, T.rc + 0.1, 1.2)} title="Sales by Rep (K EGP)" col={C.green} lab grid={false} />;
  const bads: React.ReactNode[] = [];
  if (sh === 1 && t >= T.pc + 1.4 && t < T.pb) bads.push(<Badge key="a" x={CX + 20} y={CY + CH + 8} ok={false} s="Tilted labels: hard to read" o={1} />);
  if (sh === 1 && t >= T.pb + 1.6) bads.push(<Badge key="b" x={CX + 20} y={CY + CH + 8} ok s="Flat labels: easy to read" o={fadeIn(t, T.pb + 1.6, 0.4)} />);
  if (sh === 3 && t >= T.rl + 1.6 && t < T.rc) bads.push(<Badge key="c" x={CX + 20} y={CY + CH + 8} ok={false} s="Categories are not a time series" o={fadeIn(t, T.rl + 1.6, 0.4)} />);
  if (sh === 3 && t >= T.rc + 1.3) bads.push(<Badge key="d" x={CX + 20} y={CY + CH + 8} ok s="Bar fits categories" o={fadeIn(t, T.rc + 1.3, 0.4)} />);
  return (
    <CursorProvider clicks={clicks}>
      <XWin tab={t >= T.ins + 0.05 ? 'Insert' : 'Home'} tabAt={t >= T.ins + 0.05 ? T.ins + 0.05 : undefined} ds={ds} sheets={sheets} sheet={sh} sel={sel}
        statusR={sh === 0 && t >= T.a2 + 0.05 ? 'Average: 3,000   Count: 10   Sum: 12,000' : ''}>
        {chart ? <CB sel>{chart}</CB> : null}
        {bads}
      </XWin>
      <Rules title="Comparison & Trend" col={C.green} rules={[
        {a: e1 + 0.5, col: C.green, h: 'Clustered Column', s: 'Few categories with short names, e.g. 4 branches'},
        {a: e2 + 0.5, col: C.green, h: 'Clustered Bar', s: 'Many categories or long names: horizontal text stays flat'},
        {a: e3 + 0.5, col: C.green, h: 'Line Chart', s: 'Continuous time series only, e.g. monthly sales'},
        {a: e3 + 9.6, col: C.red, h: 'Line on categories', s: 'Sales reps are not a sequence: the line fakes continuity', bad: true},
      ]} />
      <Tag a={e1 + 1} b={e3 - 0.5} col={C.blue} k="Comparison Intent" v="Clustered Column (Few Items) vs. Clustered Bar (Many / Long Labels)" />
      <Tag a={e3 + 2} b={SB[2] - 1} col={C.green} k="Trend Over Time" v="Use Line Chart Exclusively for Time Series — Never for Categories" />
    </CursorProvider>
  );
};

/* ================= SC03 ================= */
const S3: React.FC = () => {
  const t = useT();
  const a = SB[2];
  const [e1, e2, e3] = AN[2];
  const sheets = ['Branches', 'Mix', 'Ads', 'Ages'];
  const T = {mix: a + 1.2, st: e1 + 0.8, p12: e2 + 0.6, bar: e2 + 5.5, p3: e2 + 9.4, ads: e3 + 0.4, sc: e3 + 1.8, ages: e3 + 9.2, hi: e3 + 10.6};
  const clicks: Click[] = [
    {t: T.mix, ...sheetPt(sheets, 'Mix', OX, OY)}, {t: T.st, ...ribPt(XLC, 'Insert', 'Bar Chart', OX, OY)}, {t: T.p12, ...ribPt(XLC, 'Insert', 'Pie Chart', OX, OY)}, {t: T.bar, ...ribPt(XLC, 'Insert', 'Bar Chart', OX, OY)},
    {t: T.p3, ...ribPt(XLC, 'Insert', 'Pie Chart', OX, OY)}, {t: T.ads, ...sheetPt(sheets, 'Ads', OX, OY)}, {t: T.sc, ...ribPt(XLC, 'Insert', 'Scatter', OX, OY)},
    {t: T.ages, ...sheetPt(sheets, 'Ages', OX, OY)}, {t: T.hi, ...ribPt(XLC, 'Insert', 'Histogram', OX, OY)},
  ];
  const sh = pick<number>([[T.mix + 0.05, 1], [T.ads + 0.05, 2], [T.ages + 0.05, 3]], t, 0);
  const ds = sheets[sh];
  const W = CW - 6, H = CH - 6;
  const stack = (p: number) => <Stack w={W} h={H} rows={MIX.map((m) => ({l: m[0], v: m[1]}))} cols={MIXC} names={MIXN} p={p} title="Sales by Region & Category (K EGP)" />;
  let chart: React.ReactNode = null;
  let badge: React.ReactNode = null;
  if (sh === 1) {
    if (t >= T.st && t < T.p12) chart = stack(rv(t, T.st + 0.1, 1.4));
    else if (t >= T.p12 && t < T.bar) {
      chart = <Pie w={W} h={H} v={PIE_V} cols={PIE12} names={PIE_N} p={rv(t, T.p12 + 0.1, 1.5)} title="12 slices" />;
      if (t > T.p12 + 1.8) badge = <Badge x={CX + 20} y={CY + CH + 8} ok={false} s="12 slices: unreadable" o={fadeIn(t, T.p12 + 1.8, 0.4)} />;
    } else if (t >= T.bar && t < T.p3) {
      chart = stack(rv(t, T.bar + 0.1, 1.4));
      if (t > T.bar + 1.6) badge = <Badge x={CX + 20} y={CY + CH + 8} ok s="Lengths compare precisely" o={fadeIn(t, T.bar + 1.6, 0.4)} />;
    } else if (t >= T.p3) {
      chart = <Pie w={W} h={H} v={CAT_TOT} cols={MIXC} names={MIXN} p={rv(t, T.p3 + 0.1, 1.4)} title="Sales Share by Category" />;
      if (t > T.p3 + 1.6) badge = <Badge x={CX + 20} y={CY + CH + 8} ok s="3 slices, sorted, from 12:00" o={fadeIn(t, T.p3 + 1.6, 0.4)} />;
    }
  }
  if (sh === 2 && t >= T.sc) chart = <Scatter w={W} h={H} pts={ADS} p={rv(t, T.sc + 0.1, 2.6)} title="Ad Spend vs Sales (K EGP)" xl="Ad spend (K)" yl="Sales (K)" />;
  if (sh === 3 && t >= T.hi) chart = <Hist w={W} h={H} d={AGES} labels={AGEL} p={rv(t, T.hi + 0.1, 1.8)} title="Customers by Age Group" />;
  return (
    <CursorProvider clicks={clicks}>
      <XWin tab="Insert" ds={ds} sheets={sheets} sheet={sh} sel={sh === 0 ? {c1: 0, r1: 0, c2: 0, r2: 0} : rng(ds)}>
        {chart ? <CB sel>{chart}</CB> : null}
        {badge}
      </XWin>
      <Rules title="Composition & Distribution" col={C.purple} rules={[
        {a: e1 + 0.5, col: C.purple, h: 'Stacked Bar', s: 'Part-to-whole with precise length comparison'},
        {a: e2 + 0.8, col: C.purple, h: 'Pie / Doughnut', s: 'Max 3–4 slices, sorted high to low, start at 12:00'},
        {a: e3 + 1.0, col: C.purple, h: 'Scatter Plot (XY)', s: 'Two numeric variables: test the correlation'},
        {a: e3 + 9.8, col: C.purple, h: 'Histogram', s: 'Frequency of values across equal-width bins'},
      ]} />
      <Tag a={e1} b={e3 - 1} col={C.blue} k="Composition (Part-to-Whole)" v="Stacked Bar Preferred — Limit Pie / Doughnut to Max 3–4 Slices" />
      <Tag a={e3 + 2} b={SB[3] - 1} col={C.purple} k="Relationship & Distribution" v="Scatter Plot (2 Variables) & Histogram (Frequency Bins)" />
    </CursorProvider>
  );
};

/* ================= SC04 ================= */
const S4: React.FC = () => {
  const t = useT();
  const a = SB[3];
  const [e1, e2, e3] = AN[3];
  const sheets = ['Branches'];
  const T = {sel: a + 2.0, cd: a + 3.4, ct: a + 5.2, it: e1 + 0.9, ok: e1 + 2.3, ax: e2 + 0.8, mn: e2 + 2.2, ty: e2 + 3.0, ap: e2 + 3.8, cl: e2 + 5.6, a1: e3 + 0.8, g: e3 + 2.3, a2: e3 + 4.6, l: e3 + 6.1, a3: e3 + 8.4, d: e3 + 9.9};
  const menuIdx = ['Axes', 'Chart Title', 'Data Labels', 'Gridlines', 'Legend'];
  const mi = (n: string) => ({x: OX + 8 + 140, y: OY + 170 + menuIdx.indexOf(n) * 40 + 20});
  const clicks: Click[] = [
    {t: T.sel, x: OX + CX + 380, y: OY + 236 + CY + 220}, {t: T.cd, ...tabPt(XLC, 'Chart Design', OX, OY)}, {t: T.ct, ...ribPt(XLC, 'Chart Design', 'Change Chart Type', OX, OY)},
    {t: T.it, x: OX + 300 + 230, y: OY + 230 + 100 + 22}, {t: T.ok, x: OX + 300 + 620 - 230 + 50, y: OY + 230 + 300 - 60 + 20},
    {t: T.ax, x: OX + CX + 70, y: OY + 236 + CY + 220}, {t: T.mn, x: OX + 860 + 250, y: OY + 236 + 150}, {t: T.cl, x: OX + 860 + 370 - 24, y: OY + 236 + 22},
    {t: T.a1, ...ribPt(XLC, 'Chart Design', 'Add Chart Element', OX, OY)}, {t: T.g, ...mi('Gridlines')},
    {t: T.a2, ...ribPt(XLC, 'Chart Design', 'Add Chart Element', OX, OY)}, {t: T.l, ...mi('Legend')},
    {t: T.a3, ...ribPt(XLC, 'Chart Design', 'Add Chart Element', OX, OY)}, {t: T.d, ...mi('Data Labels')},
  ];
  const flat = eo(rv(t, T.ok + 0.15, 0.9));
  const min = 1000 * (1 - eo(rv(t, T.ap, 0.7)));
  const gridOn = t < T.g + 0.1, legOn = t < T.l + 0.1, labOn = t >= T.d + 0.1;
  const ink = 40 + (gridOn ? 0 : 18) + (legOn ? 0 : 14) + (labOn ? 16 : 0);
  const menu = (t >= T.a1 + 0.1 && t < T.g + 0.15) || (t >= T.a2 + 0.1 && t < T.l + 0.15) || (t >= T.a3 + 0.1 && t < T.d + 0.15);
  const ctDlg = t >= T.ct + 0.1 && t < T.ok + 0.15;
  const pane = t >= T.ax + 0.1 && t < T.cl + 0.15;
  const typedZero = t >= T.ty;
  const overlay = (
    <div>
      {menu ? (
        <div style={{position: 'absolute', left: 8, top: 170, width: 290, background: '#1E293B', border: `1px solid ${C.blue}`, borderRadius: 6, zIndex: 15, direction: 'ltr', fontSize: 19}}>
          {menuIdx.map((m, i) => <Hit key={m} x={8} y={170 + i * 40} w={290} h={40} r={4}><div style={{padding: '0 14px', lineHeight: '38px'}}>{m}</div></Hit>)}
        </div>
      ) : null}
      {ctDlg ? (
        <div>
          <Dialog x={300} y={230} w={620} h={300} title="Change Chart Type" o={fadeIn(t, T.ct + 0.1, 0.3)}>
            {['3-D Clustered Column', 'Clustered Column', 'Clustered Bar'].map((n, i) => {
              const on = i === 0 ? t < T.it + 0.05 : i === 1 ? t >= T.it + 0.05 : false;
              return <div key={n} style={{position: 'absolute', left: 20, top: 56 + i * 44, width: 360, height: 40, lineHeight: '38px', paddingLeft: 12, fontSize: 20, background: on ? '#0369A1' : '#273449', border: `1px solid ${C.line}`, borderRadius: 6}}>{n}</div>;
            })}
          </Dialog>
          <Hit x={300} y={230 + 56 + 44} w={360} h={40} r={6} style={{zIndex: 25}} />
          <Hit x={300 + 620 - 230} y={230 + 300 - 60} w={100} h={40} base={C.green + '55'} style={{zIndex: 25}}><div style={{textAlign: 'center', lineHeight: '38px', fontSize: 19, fontWeight: 700, direction: 'ltr'}}>OK</div></Hit>
        </div>
      ) : null}
      {pane ? (
        <div style={{position: 'absolute', left: 860, top: 236, width: 370, height: 502, background: '#162033', borderLeft: `2px solid ${C.blue}`, zIndex: 14, direction: 'ltr', fontSize: 20}}>
          <div style={{position: 'absolute', left: 16, top: 12, fontWeight: 700, fontSize: 22}}>Format Axis</div>
          <div style={{position: 'absolute', right: 14, top: 10, fontSize: 24}}>✕</div>
          <div style={{position: 'absolute', left: 16, top: 70, color: C.dim}}>Axis Options · Bounds</div>
          <div style={{position: 'absolute', left: 16, top: 130, width: 120}}>Minimum</div>
          <div style={{position: 'absolute', left: 150, top: 124, width: 190, height: 40, border: `2px solid ${t >= T.mn ? C.green : C.line}`, borderRadius: 6, lineHeight: '36px', paddingLeft: 12, fontFamily: MONO, background: C.cell}}>{t >= T.ap ? '0.0' : typedZero ? '0' : '1000.0'}</div>
          <div style={{position: 'absolute', left: 16, top: 190, width: 120}}>Maximum</div>
          <div style={{position: 'absolute', left: 150, top: 184, width: 190, height: 40, border: `2px solid ${C.line}`, borderRadius: 6, lineHeight: '36px', paddingLeft: 12, fontFamily: MONO, background: C.cell}}>5000.0</div>
        </div>
      ) : null}
    </div>
  );
  const bg = gridOn || flat < 1 ? '#2A2457' : undefined;
  return (
    <CursorProvider clicks={clicks}>
      <XWin tab={pick<string>([[T.cd + 0.05, 'Chart Design']], t, 'Insert')} tabAt={t >= T.cd + 0.05 ? T.cd + 0.05 : undefined} ds="Branches" sheets={sheets} sheet={0} sel={null} overlay={overlay}>
        <CB sel={t >= T.sel}>
          <Bars w={CW - 6} h={CH - 6} d={BR} min={min} max={5000} depth={Math.round(30 * (1 - flat))} grid={gridOn} legend={legOn ? 'Sales (K EGP)' : undefined} lab={labOn} bg={bg} title="Sales by Branch (K EGP)" />
        </CB>
      </XWin>
      <Card x={PX} y={OY} w={PW} h={250} col={flat >= 1 ? C.green : C.amber} glow>
        <div style={{position: 'absolute', left: 22, top: 14, fontSize: 30, fontWeight: 700, color: flat >= 1 ? C.green : C.amber, direction: 'ltr'}}>{flat >= 1 ? '✓' : '1'} Ban 3D charts</div>
        <div style={{position: 'absolute', left: 22, top: 72, width: PW - 44, fontSize: 25, lineHeight: '34px', direction: 'ltr'}}>Perspective distorts the size of columns and slices. Flat 2D shows true proportions.</div>
      </Card>
      <Card x={PX} y={OY + 266} w={PW} h={250} col={min < 1 ? C.green : C.amber} glow>
        <div style={{position: 'absolute', left: 22, top: 14, fontSize: 30, fontWeight: 700, color: min < 1 ? C.green : C.amber, direction: 'ltr'}}>{min < 1 ? '✓' : '2'} Y-Axis starts at 0</div>
        <div style={{position: 'absolute', left: 22, top: 72, width: PW - 44, fontSize: 25, lineHeight: '34px', direction: 'ltr'}}>
          {min < 1 ? 'True ratio Cairo : Mansoura = 3.5×' : <span style={{color: C.red}}>Truncated axis: Cairo looks 9.8× bigger than Mansoura (real: 3.5×)</span>}
        </div>
      </Card>
      <Card x={PX} y={OY + 532} w={PW} h={268} col={ink >= 88 ? C.green : C.amber} glow>
        <div style={{position: 'absolute', left: 22, top: 14, fontSize: 30, fontWeight: 700, color: ink >= 88 ? C.green : C.amber, direction: 'ltr'}}>{ink >= 88 ? '✓' : '3'} Maximize Data-Ink Ratio</div>
        <div style={{position: 'absolute', left: 22, top: 72, width: PW - 44, fontSize: 24, lineHeight: '32px', direction: 'ltr'}}>{gridOn ? '○' : '✓'} Remove gridlines & background<br />{legOn ? '○' : '✓'} Remove the legend<br />{labOn ? '✓' : '○'} Direct data labels on bars</div>
        <div style={{position: 'absolute', left: 22, top: 196, width: PW - 44, height: 18, borderRadius: 9, background: '#0F172A'}}><div style={{width: `${ink}%`, height: 18, borderRadius: 9, background: C.amber}} /></div>
        <div style={{position: 'absolute', left: 22, top: 226, fontSize: 19, color: C.dim, direction: 'ltr'}}>Data-ink share (illustrative): {ink}%</div>
      </Card>
      <Tag a={a + 1.6} b={e2 - 0.5} col={C.blue} k="Visual Honesty Rules" v="Ban 3D Charts & Enforce Zero Baseline (0) on Vertical Y-Axis" />
      <Tag a={e3 + 0.6} b={SB[4] - 1} col={C.amber} k="Maximize Data-Ink Ratio" v="Remove Gridlines & Legends — Use Direct Data Labels" />
    </CursorProvider>
  );
};

/* ================= SC05 ================= */
const S5: React.FC = () => {
  const t = useT();
  const a = SB[4];
  const [e1, e2] = AN[4];
  const sheets = ['Fact_Sales', 'Dashboard'];
  const T = {col: a + 1.6, dash: a + 4.4, ins: a + 6.4, bar: a + 8.4, ln: e1 + 1.2, sc: e1 + 4.2, s1: e1 + 8, s2: e1 + 10, s3: e1 + 12};
  const cp = (i: number) => ({x: OX + 12 + i * 405 + 198, y: OY + 236 + 16 + 235});
  const clicks: Click[] = [
    {t: T.col, ...gp('Fact', 5, 0)}, {t: T.dash, ...sheetPt(sheets, 'Dashboard', OX, OY)}, {t: T.ins, ...tabPt(XLC, 'Insert', OX, OY)}, {t: T.bar, ...ribPt(XLC, 'Insert', 'Bar Chart', OX, OY)},
    {t: T.ln, ...ribPt(XLC, 'Insert', 'Line Chart', OX, OY)}, {t: T.sc, ...ribPt(XLC, 'Insert', 'Scatter', OX, OY)}, {t: T.s1, ...cp(0)}, {t: T.s2, ...cp(1)}, {t: T.s3, ...cp(2)},
  ];
  const sh = t >= T.dash + 0.05 ? 1 : 0;
  const sel3 = t >= T.s3 ? 2 : t >= T.s2 ? 1 : t >= T.s1 ? 0 : t >= T.sc ? 2 : t >= T.ln ? 1 : 0;
  const w = 390, h = 464;
  const cx = (i: number) => 12 + i * 405;
  const o1 = fadeIn(t, a + 0.5, 0.5);
  const cnt = Math.round(50000 * eo(rv(t, a + 0.6, 2.6)));
  const o3 = fadeIn(t, T.sc + 2.5, 0.5);
  const ms = (1.8 * eo(rv(t, T.sc + 2.6, 0.9))).toFixed(1);
  const seal = eo(rv(t, e2 + 0.8, 1.0));
  const done = [t >= T.bar + 1.4, t >= T.ln + 2.6, t >= T.sc + 2.8];
  const ptsP = ADS.map((p) => [p[0], Math.round(p[1] * 0.24)]);
  return (
    <CursorProvider clicks={clicks}>
      <XWin tab={pick<string>([[T.ins + 0.05, 'Insert']], t, 'Home')} tabAt={t >= T.ins + 0.05 ? T.ins + 0.05 : undefined} ds={sh ? 'Dash' : 'Fact'} sheets={sheets} sheet={sh}
        sel={sh ? null : t >= T.col ? {c1: 5, r1: 0, c2: 5, r2: 15, handle: false} : {c1: 0, r1: 0, c2: 0, r2: 0}} fx={sh ? {name: 'A1', text: ''} : {name: 'F1', text: 'Amount'}}
        statusR={!sh && t >= T.col ? 'Average: 240   Count: 50,001   Sum: 12,000,000' : sh && done[2] ? 'Render: 1.8 ms' : ''}>
        {sh && t >= T.bar ? <CB x={cx(0)} y={16} w={w} h={h} sel={sel3 === 0 && t >= T.s1 - 5}><Bars w={w - 6} h={h - 6} d={PROD15.map((p) => ({l: p[1], v: p[2]}))} dir="h" p={rv(t, T.bar + 0.1, 1.4)} grid={false} lab col={C.green} title="Sales by Product (K EGP)" /></CB> : null}
        {sh && t >= T.ln ? <CB x={cx(1)} y={16} w={w} h={h} sel={sel3 === 1 && t >= T.s2 - 5}><Lines w={w - 6} h={h - 6} d={MSALES} labels={MONTHS.map((m) => m[0])} p={rv(t, T.ln + 0.1, 2.2)} grid={false} lab title="Monthly Sales (K EGP)" /></CB> : null}
        {sh && t >= T.sc ? <CB x={cx(2)} y={16} w={w} h={h} sel={sel3 === 2 && t >= T.s3 - 5}><Scatter w={w - 6} h={h - 6} pts={ptsP} ym={240} p={rv(t, T.sc + 0.1, 2.4)} title="Marketing vs Profit (K EGP)" xl="Marketing spend (K)" yl="Profit (K)" /></CB> : null}
      </XWin>
      <Card x={PX} y={OY} w={PW} h={160} col={C.blue} o={o1}>
        <div style={{position: 'absolute', left: 20, top: 16}}><Ic n="doc" s={38} c={C.blue} /></div>
        <div style={{position: 'absolute', left: 72, top: 16, fontSize: 25, fontWeight: 700, fontFamily: MONO, direction: 'ltr'}}>manzooma_sales_2026.xlsx</div>
        <div style={{position: 'absolute', left: 20, top: 66, fontSize: 50, fontWeight: 700, fontFamily: MONO, color: C.blue}}>{fmt(cnt)}</div>
        <div style={{position: 'absolute', left: 20, top: 126, fontSize: 21, color: C.dim, direction: 'ltr'}}>sales transactions loaded</div>
      </Card>
      <Card x={PX} y={OY + 176} w={PW} h={240} col={C.green} o={fadeIn(t, T.bar + 0.5, 0.5)}>
        <div style={{position: 'absolute', left: 20, top: 12, fontSize: 24, fontWeight: 700, color: C.green, direction: 'ltr'}}>Executive charts</div>
        {['Clustered Bar · 15 products', 'Line Chart · monthly trend', 'Scatter Plot · marketing vs profit'].map((m, i) => <div key={m} style={{position: 'absolute', left: 24, top: 64 + i * 54, fontSize: 25, opacity: done[i] ? 1 : 0.3, direction: 'ltr', whiteSpace: 'nowrap'}}>{done[i] ? '✓  ' : '○  '}{m}</div>)}
      </Card>
      <Card x={PX} y={OY + 432} w={PW} h={160} col={C.amber} o={o3}>
        <div style={{position: 'absolute', left: 20, top: 12, fontSize: 22, color: C.dim, direction: 'ltr'}}>Chart rendering time</div>
        <div style={{position: 'absolute', left: 20, top: 44, fontSize: 64, fontWeight: 700, fontFamily: MONO, color: C.amber}}>{ms} ms</div>
        <div style={{position: 'absolute', left: 20, top: 124, fontSize: 17, color: C.dim, direction: 'ltr'}}>Illustrative timing on the sample model</div>
      </Card>
      <Card x={PX} y={OY + 608} w={PW} h={192} col={C.green} o={seal} glow>
        <svg width={PW} height={192} viewBox="0 0 580 192" style={{position: 'absolute', left: 0, top: 0}}>
          <circle cx={110} cy={96} r={70 * seal} fill="rgba(16,185,129,.2)" stroke={C.green} strokeWidth={6} />
          <path d="M78 96 L102 120 L146 70" stroke={C.green} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={seal} />
        </svg>
        <div style={{position: 'absolute', left: 210, top: 44, width: 350, fontSize: 26, fontWeight: 700, color: C.green, direction: 'ltr'}}>Enterprise Visualization Seal</div>
        <div style={{position: 'absolute', left: 210, top: 118, width: 350, fontSize: 22, color: C.dim, direction: 'ltr'}}>Clear story in one glance</div>
      </Card>
      <Tag a={a + 2.0} b={e1 - 0.5} col={C.blue} k="Enterprise Visual Mapping" v="Transform 50,000 Sales Rows into Bar, Line & Scatter Charts" />
      <Tag a={e2 + 1.0} b={SB[5] - 1} col={C.green} k="Zero Latency Visual Clarity" v="High-Speed Chart Rendering & Declutter Engine in <2ms" />
    </CursorProvider>
  );
};

/* ================= SC06 ================= */
const S6: React.FC = () => {
  const t = useT();
  const S = SB[5];
  const [e1, e2, e3] = AN[5];
  const black = pr(t, 239.0, 240.0);
  const pct = (LESSON / LESSONS) * 100;
  const prog = eo(pr(t, S + 3, S + 6.5));
  const skills = ['اختار المخطط حسب هدف التحليل: مقارنة، اتجاه، تركيب، علاقة', 'Column للفئات القليلة وBar للأسماء الطويلة', 'Line للزمن فقط، وPie بحد أقصى 3–4 شرائح', 'بدون 3D، المحور من الصفر، وData-Ink Ratio عالي'];
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
        <div style={{position: 'absolute', left: 170, top: 128, fontSize: 40, fontWeight: 700, color: C.green, direction: 'ltr'}}>Choosing the Right Chart Mastered</div>
        <div style={{position: 'absolute', left: 170, top: 186, fontSize: 32, color: C.text, direction: 'rtl'}}>الدرس {LESSON} من {LESSONS} · الوحدة {UNIT} من {UNITS} · الدرس الخامس في الوحدة</div>
        <div style={{position: 'absolute', left: 40, top: 284, width: 1560, height: 26, borderRadius: 13, background: '#0F172A', border: `2px solid ${C.line}`}}>
          <div style={{width: `${pct * prog}%`, height: '100%', borderRadius: 13, background: `linear-gradient(90deg,${C.blue},${C.green})`}} />
        </div>
        <div style={{position: 'absolute', left: 40, top: 322, fontSize: 28, color: C.dim, direction: 'rtl'}}>تقدم الكورس: {LESSON} من {LESSONS} درساً</div>
        <div style={{position: 'absolute', right: 40, top: 322, fontSize: 32, fontWeight: 700, color: C.green, fontFamily: MONO}}>{(pct * prog).toFixed(1)}%</div>
        {skills.map((s, i) => {
          const o = fadeIn(t, e1 + 0.6 + i * 2.3, 0.5);
          return <div key={i} style={{position: 'absolute', right: 60, top: 392 + i * 62 + (1 - o) * 16, opacity: o, fontSize: 36, direction: 'rtl'}}><span style={{color: C.green, fontWeight: 700}}>✓</span>&nbsp;&nbsp;{s}</div>;
        })}
        <div style={{position: 'absolute', left: 40, top: 650, opacity: fadeIn(t, e2 + 0.5, 0.5), border: `2px solid ${C.blue}`, borderRadius: 16, padding: '10px 26px', fontSize: 36, fontFamily: MONO, direction: 'ltr'}}>solutions.gomaaintelligence.me</div>
        <div style={{position: 'absolute', right: 40, top: 650, opacity: fadeIn(t, e2 + 2, 0.5), border: `2px solid ${C.green}`, borderRadius: 16, padding: '10px 26px', fontSize: 32, fontFamily: MONO, direction: 'ltr'}}>manzooma_sales_2026.xlsx</div>
        <div style={{position: 'absolute', left: 40, top: 760 + (1 - nx) * 30, width: 1560, height: 160, opacity: nx, borderRadius: 20, border: `2px solid ${C.blue}`, background: 'rgba(56,189,248,.1)', boxSizing: 'border-box', padding: '16px 30px'}}>
          <div style={{fontSize: 28, color: C.blue, direction: 'rtl'}}>الدرس القادم</div>
          <div style={{fontSize: 38, fontWeight: 700, direction: 'rtl', marginTop: 6}}>الدرس 68 (الوحدة {UNIT} من {UNITS}): الرسوم البيانية المتقدمة</div>
          <div style={{fontSize: 30, fontFamily: MONO, color: C.blue, direction: 'ltr', marginTop: 8}}>Advanced Charts &amp; Custom Visualizations</div>
        </div>
      </div>
      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 20% 8%, #172544 0%, ${C.bg} 62%)`, fontFamily: AR}}>
    <Audio src={staticFile(VOICE)} />
    <Scene from={0} to={SB[5]}><Chrome title="Choosing the Right Chart for Data Visualization Engine" /></Scene>
    <Scene from={SB[0]} to={SB[1]}><S1 /></Scene>
    <Scene from={SB[1]} to={SB[2]}><S2 /></Scene>
    <Scene from={SB[2]} to={SB[3]}><S3 /></Scene>
    <Scene from={SB[3]} to={SB[4]}><S4 /></Scene>
    <Scene from={SB[4]} to={SB[5]}><S5 /></Scene>
    <Scene from={SB[5]} to={SB[6]}><S6 /></Scene>
  </AbsoluteFill>
);
