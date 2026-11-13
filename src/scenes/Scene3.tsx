import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, CellV, KeyBadge, Stage, XL, clamp, prog, ribbonItemBox, sec} from '../kit';
import {sheetTabBox} from '../xl';
import {PPWin, RelLine, RelId, STAR, TableBox, TId} from '../lp';
import {Pointer, Wp} from '../lq';
import {Host} from '../l46';
import {Tag, relSt} from '../l54';
import {BLANK_SUM, CATS, GRAND, MISS_CAT, MISS_KEY, MISS_ROW, OK_ROWS, catSum, fmt, prodRows} from '../l56';

// SC03 anchors (s, abs): 86.5 pivot | 99.9 (blank) amber | 102.2 meaning | 103.9 Manage | 105.5-110.2 key check | 110.2 mismatch | 113.0 Dim_Product sheet | 114.2-117.6 type new row | 118.4 back | 120.3 refresh | 122.0 blank gone | 122.6 purple | 124.7 100% match
const S = START.s3;
const t = (g: number) => sec(g - S);
const P = STAR;
const colW3 = (c: number) => [0, 170, 150, 130, 110][c] ?? 64;
const MAN = ribbonItemBox('Power Pivot', 'Manage');
const cellXY = (r: number, c: number) => ({x: 38 + [0, 0, 170, 320, 450][c] + colW3(c) / 2, y: 208 + (r - 1) * 20 + 10});
const BL = cellXY(4 + CATS.length, 1);
const SH = ['Report', 'Dim_Product'];
const TY = XL.H - 24 - 13;
const TD = sheetTabBox(SH, 'Dim_Product'), TR = sheetTabBox(SH, 'Report');
const PTS: Wp[] = [{f: 0, x: 900, y: 560}, {f: t(99.4), ...BL}, {f: t(103.7), ...BL}, {f: t(103.9), x: MAN.cx, y: MAN.cy}, {f: t(104.1), x: MAN.cx, y: MAN.cy}, {f: t(106.0), x: 760, y: 600}, {f: t(112.8), x: TD.cx, y: TY}, {f: t(113.0), x: TD.cx, y: TY}, {f: t(114.0), x: 400, y: 300}, {f: t(118.2), x: TR.cx, y: TY}, {f: t(118.4), x: TR.cx, y: TY}, {f: t(119.6), x: 700, y: 330}];
const CLICKS = [99.9, 103.9, 113.0, 118.4].map(t);
const REL4: RelId[] = ['prod', 'cust', 'store', 'date'];
const typed = (s: string, f: number, from: number, to: number) => s.slice(0, Math.floor(s.length * prog(f, t(from), sec(to - from)) + 0.0001));
const Chips: React.FC<{x: number; y: number; label: string; keys: number[]; color: string; miss?: number; missP?: number; p: number}> = ({x, y, label, keys, color, miss, missP = 0, p}) => (
  p > 0.01 ? (
    <div dir="ltr" style={{position: 'absolute', left: x, top: y, opacity: clamp(p), zIndex: 30, display: 'flex', alignItems: 'center', gap: 6, fontFamily: MONO}}>
      <span style={{fontSize: 12.5, fontWeight: 700, color: C.text, background: '#0B1222', border: `2px solid ${color}`, borderRadius: 999, padding: '3px 10px', marginRight: 4}}>{label}</span>
      {keys.map((k) => {
        const m = miss === k;
        return <span key={k} style={{fontSize: 13, fontWeight: 700, color: m ? C.red : '#0B1222', background: m ? 'transparent' : color, border: m ? `2px dashed ${C.red}` : 'none', borderRadius: 6, padding: '2px 8px', boxShadow: m ? `0 0 ${12 * missP}px ${C.red}` : undefined, minWidth: 34, textAlign: 'center'}}>{m ? (missP > 0.5 ? '✗' : '?') : k}</span>;
      })}
    </div>
  ) : null
);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const fixed = at(122.0);
  const onDim = f >= t(113.0) && f < t(118.4);
  const ppOpen = prog(f, t(104.2), 12) * (1 - prog(f, t(112.6), 10));
  const allKeys = prodRows.map((r) => r.key).sort((a, b) => a - b);
  const dimKeys = allKeys;
  const cats = [...CATS];
  const cell = (r: number, c: number): CellV | undefined => {
    if (onDim) {
      if (c < 1 || c > 4) return undefined;
      const head = ['ProductKey', 'ProductName', 'Category', 'UnitPrice'];
      if (r === 1) return {t: head[c - 1], b: true, bg: '#4472C4', color: '#FFFFFF'};
      const bg = r % 2 === 0 ? '#D9E1F2' : undefined;
      if (r >= 2 && r <= 1 + OK_ROWS.length) { const o = OK_ROWS[r - 2]; const v = [String(o.key), o.name, o.cat, String(o.price)][c - 1]; return c === 1 || c === 4 ? {t: v, num: 1, al: 'r', bg} : {t: v, bg}; }
      if (r === 2 + OK_ROWS.length) {
        const v = [String(MISS_KEY), MISS_ROW.name, MISS_ROW.cat, String(MISS_ROW.price)];
        const times: Array<[number, number]> = [[114.2, 114.8], [115.0, 116.0], [116.2, 117.0], [117.1, 117.6]];
        const s = typed(v[c - 1], f, times[c - 1][0], times[c - 1][1]);
        return s ? {t: s, num: c === 1 || c === 4 ? 1 : undefined, al: c === 1 || c === 4 ? 'r' : undefined, bg, color: '#1B1B1B'} : undefined;
      }
      return undefined;
    }
    if (c < 1 || c > 2 || r < 3) return undefined;
    if (r === 3) return c === 1 ? {t: 'Row Labels', b: true, bg: '#DDEBF7'} : {t: 'Sum of Amount', b: true, bg: '#DDEBF7', al: 'r'};
    const i = r - 4;
    if (i < cats.length) {
      const k = cats[i];
      const hot = fixed && k === MISS_CAT && f < t(127.0);
      const bg = hot ? '#E9D5FF' : undefined;
      return c === 1 ? {t: k, bg, b: hot} : {t: fmt(catSum(k, fixed)), num: 1, al: 'r', bg, b: hot};
    }
    if (i === cats.length && !fixed) { const bg = at(99.9) ? '#FDE68A' : undefined; return c === 1 ? {t: '(blank)', bg, b: true} : {t: fmt(BLANK_SUM), num: 1, al: 'r', bg, b: true}; }
    const gi = fixed ? cats.length : cats.length + 1;
    if (i === gi) return c === 1 ? {t: 'Grand Total', b: true, bg: '#F2F2F2'} : {t: fmt(GRAND), num: 1, al: 'r', b: true, bg: '#F2F2F2'};
    return undefined;
  };
  const refreshing = f >= t(120.3) && f < t(122.0);
  return (
    <Stage dur={SCENES.s3.dur} inFx="left" outFx="up">
      <Host tab={f >= t(103.0) && f < t(105.0) ? 'Power Pivot' : 'Insert'} cell={cell} colW={colW3} sheets={['Report', 'Dim_Product']} sheet={onDim ? 'Dim_Product' : 'Report'} glow={at(99.9) && !fixed ? C.amber : fixed && f < t(127.0) ? C.purple : undefined}>
        {ppOpen > 0.01 ? (
          <PPWin open={ppOpen} view="diagram" status="Diagram View · key check">
            {REL4.map((r) => <RelLine key={r} r={r} pos={P} f={f} st={relSt(f, 0, {one: 0, many: 0, arrow: 0, color: C.green})} />)}
            {(['prod', 'cust', 'store', 'date', 'fact'] as TId[]).map((id) => <TableBox key={id} id={id} pos={P[id]} st={{rowsLabel: id === 'prod' ? '7 rows' : undefined, fieldGlow: id === 'prod' && at(107.5) ? {0: C.purple} : id === 'fact' && at(105.5) ? {1: C.blue} : undefined}} />)}
            <Chips x={440} y={470} label="Fact_Sales[ProductKey]" keys={allKeys} color={C.blue} p={prog(f, t(105.5), 10)} />
            <Chips x={440} y={508} label="Dim_Product[ProductKey]" keys={dimKeys} color={C.purple} miss={MISS_KEY} missP={prog(f, t(110.2), 10)} p={prog(f, t(107.5), 10)} />
            <Tag x={440} y={552} text={`Key ${MISS_KEY} is in the Fact table but missing from Dim_Product`} color={C.red} p={prog(f, t(110.4), 10)} dark />
          </PPWin>
        ) : null}
        <Tag x={560} y={300} text="(blank) = sales whose key has no match in the dimension" color={C.amber} p={prog(f, t(102.2), 10) * (1 - prog(f, t(104.0), 10))} dark />
        <Tag x={760} y={298} text={`New row: key ${MISS_KEY} added to Dim_Product`} color={C.purple} p={prog(f, t(117.4), 10) * (1 - prog(f, t(118.4), 8))} dark />
        <Tag x={560} y={300} text="Grand Total unchanged ──► the sales moved to their real category" color={C.purple} p={prog(f, t(122.8), 10)} dark />
        <Tag x={560} y={338} text="✓ 100% key match" color={C.green} p={prog(f, t(124.7), 10)} />
        {refreshing ? <div style={{position: 'absolute', left: 560, top: 280, fontFamily: MONO, fontSize: 14, color: C.green, zIndex: 20}}>Refreshing…</div> : null}
        <Pointer f={f} pts={PTS} clicks={CLICKS} hide={at(124.0)} />
      </Host>
      {f >= t(120.2) && f < t(122.0) ? <KeyBadge keys={['Ctrl', 'Alt', 'F5']} p={prog(f, t(120.2), 6) * (1 - prog(f, t(121.8), 6))} /> : null}
      <Caption text="Relationship Integrity Audit ──► Detect & Fix (blank) Rows in Data Model PivotTables" from={t(88.0)} to={t(106.0)} tone="danger" />
      <Caption text="Key Alignment Fix ──► Ensures 100% Primary-Foreign Key Match Across All Dimensions" from={t(110.0)} to={t(128.0)} />
    </Stage>
  );
};
