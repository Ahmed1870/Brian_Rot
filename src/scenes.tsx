import React from 'react';
import {A} from './anchors';
import {ar, mono} from './fonts';
import {BRS, CATS, Chip, Cursor, Grid, LKW, Logo, MAT, MON, P, RATE, Ring, S5W, SBR, Stage, Tag, TopBadge, Win, cellWin, clamp, colName, fade, fmt, kf, pls, setCols, sRow, useT} from './kit';
import {C, FILE, WIN, Z} from './theme';

const W8 = '#F8FAFC';
const GR = '#BBF7D0', BL = '#BAE6FD', AM = '#FDE68A', CY = '#A5F3FC';
const GOLD = '#FBBF24';
type HL = (number | string)[];
const pt = (t: number, k: [number, {x: number; y: number}][]) => ({
  x: kf(t, k.map((q) => [q[0], q[1].x] as [number, number])),
  y: kf(t, k.map((q) => [q[0], q[1].y] as [number, number])),
});
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.floor(s.length * clamp((t - a) / (b - a))));
const lk = (j: string, k: string, r: string, hl: HL[]) => `lk|${j}|${k}|${r}|${JSON.stringify(hl)}`;
const cfg0 = {fr: 0, fc: 0, sr: 1, sc: 0};
const gx = (r: number, c: number, g = cfg0) => {
  const q = cellWin(g, r, c, true);
  return P(q.x, q.y);
};
const Hud: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 4, top: -24}}><Logo s={136} /></div>
    {children}
  </div>
);
type WB = {kind: string; selR: number; selC: number; formula: string; sheets: string[]; fr?: number; sr?: number};
const WinB: React.FC<WB> = (p) => (
  <Win {...WIN} title={`${FILE} - Excel`} tab="Home" sheets={p.sheets.map((n) => ({n}))} act={0} nameBox={`${colName(p.selC)}${p.selR}`} formula={p.formula}>
    {({gw, gh}) => <Grid gw={gw} gh={gh} kind={p.kind} fr={p.fr ?? 0} fc={0} sr={Math.max(p.sr ?? 1, (p.fr ?? 0) + 1)} sc={0} selR={p.selR} selC={p.selC} />}
  </Win>
);
const Panel: React.FC<{a: number; children: React.ReactNode}> = ({a, children}) => (
  <div style={{position: 'absolute', left: 160, top: 575, width: 1600, height: 400, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, borderRadius: 26, background: 'rgba(15,23,42,.95)', border: '2px solid rgba(148,163,184,.4)', boxShadow: '0 20px 60px rgba(0,0,0,.5)', overflow: 'hidden', fontFamily: ar, color: W8}}>{children}</div>
);
type Tok = [string, string];
const Fx: React.FC<{toks: Tok[]; x: number; y: number; size?: number; a?: number}> = ({toks, x, y, size = 44, a = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: a, fontFamily: mono, fontWeight: 700, fontSize: size, whiteSpace: 'pre', direction: 'ltr', lineHeight: 1.25}}>
    {toks.map(([t, c], i) => <span key={i} style={{color: c, textShadow: c === W8 ? 'none' : `0 0 14px ${c}88`}}>{t}</span>)}
  </div>
);
const Bx: React.FC<{x: number; y: number; w: number; h: number; c: string; label?: string; text: string; a?: number; on?: number; size?: number}> = ({x, y, w, h, c, label, text, a = 1, on = 0, size = 34}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', opacity: a, borderRadius: 16, border: `4px solid ${c}`, background: `${c}${on > 0.5 ? '33' : '12'}`, boxShadow: on > 0 ? `0 0 ${30 * on}px ${c}` : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', direction: 'ltr'}}>
    {label && <div style={{fontFamily: ar, fontSize: 20, color: '#CBD5E1', marginBottom: 2}}>{label}</div>}
    <div style={{fontFamily: mono, fontWeight: 700, fontSize: size, color: W8, whiteSpace: 'nowrap'}}>{text}</div>
  </div>
);
const Lines: React.FC<{ls: [number, number, number, number, string, number][]}> = ({ls}) => (
  <svg style={{position: 'absolute', left: 0, top: 0}} width={1600} height={400}>
    {ls.map(([a, b, c, d, col, o], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke={col} strokeWidth={5} strokeLinecap="round" opacity={o} />)}
  </svg>
);
const Dot: React.FC<{x: number; y: number; c: string; a: number}> = ({x, y, c, a}) => (
  <div style={{position: 'absolute', left: x - 15, top: y - 15, width: 30, height: 30, borderRadius: 15, background: c, boxShadow: `0 0 24px ${c}`, opacity: a}} />
);
const PC: React.FC<{x: number; y: number; text: string; c: string; a: number; size?: number}> = ({x, y, text, c, a, size = 24}) => <Chip x={x} y={y} text={text} c={c} a={a} size={size} />;

/* ───────── SCENE 1 — XMATCH anatomy + radar ───────── */
export const Scene1: React.FC<{from: number}> = ({from}) => {
  setCols(LKW);
  const t = useT(from);
  const a = A[1];
  const fx = '=XMATCH(J2,tbl_Branches[BranchName])';
  const entered = t >= 23.0;
  const hl: HL[] = [];
  if (t >= 9.6 && t < 23) hl.push([2, 9, AM]);
  for (let i = 0; i < 3; i++) if (t >= 20.65 + 0.7 * i && t < 23) hl.push([2 + i, 0, AM]);
  if (t >= 23.0) hl.push([5, 0, 5, 1, GR]);
  const barX = kf(t, [[20.65, 10], [22.8, 20 + 3 * 315 + 140]]);
  const lock = t >= 23.0;
  const L2 = gx(2, 11);
  const cur = pt(t, [[0, {x: 1100, y: 500}], [1.4, L2], [4, L2], [40, {x: 1100, y: 500}]]);
  return (
    <Stage>
      <WinB sheets={['Lookup', 'Summary']} kind={lk('Giza East', '', entered ? '4' : '', hl)} selR={2} selC={11} formula={entered ? fx : typed(fx, t, 2.0, 9.0)} />
      <Ring x={L2.x - 80} y={L2.y - 24} w={160} h={48} c={C.amber} t={t} a={fade(t, 1.6, 3.0)} r={6} />
      <Panel a={fade(t, 1.0, 38.6, 0.8)}>
        <Fx x={385} y={10} size={38} a={clamp((t - 2) / 0.8)} toks={[['=XMATCH(', W8], ['J2', C.amber], [', ', W8], ['tbl_Branches[BranchName]', C.blue], [')', W8]]} />
        <Bx x={30} y={76} w={350} h={96} c={C.amber} label="lookup_value" text="J2" a={fade(t, 9.6, 38.6)} on={1} />
        <Bx x={430} y={76} w={350} h={96} c={C.blue} label="lookup_array" text="tbl_Branches[BranchName]" size={20} a={fade(t, 11.0, 38.6)} on={1} />
        <Bx x={830} y={76} w={350} h={96} c={C.green} label="match_mode · DEFAULT = Exact" text="0" a={fade(t, a.exact, 38.6)} on={1} />
        <Bx x={1230} y={76} w={350} h={96} c="#06B6D4" label="search_mode" text="1  (first → last)" size={28} a={fade(t, a.exact + 1.4, 38.6)} on={1} />
        {BRS.map((n, i) => {
          const passed = barX > 20 + i * 315 + 140;
          const isLock = lock && i === 3;
          const c = isLock ? C.green : passed ? '#06B6D4' : '#475569';
          return <Bx key={n} x={20 + i * 315} y={200} w={290} h={66} c={c} text={`${i + 1} · ${n}`} size={26} a={clamp((t - 17.0) / 0.6)} on={isLock ? 1 : 0} />;
        })}
        <div style={{position: 'absolute', left: barX, top: 190, width: 6, height: 86, background: '#06B6D4', boxShadow: '0 0 22px #06B6D4', opacity: fade(t, 20.65, 23.2, 0.2)}} />
        <PC x={1010} y={276} text="Position = 4" c={C.green} a={fade(t, 23.0, 38.6, 0.3)} />
        <div style={{position: 'absolute', left: 60, top: 322, width: 700, height: 62, borderRadius: 14, border: `4px solid ${C.purple}`, background: `${C.purple}14`, fontFamily: mono, fontWeight: 700, fontSize: 28, textAlign: 'center', lineHeight: '54px', opacity: fade(t, a.zero, 38.6), direction: 'ltr'}}>
          MATCH(J2, Branches, <span style={{color: C.red, textDecoration: 'line-through'}}>0</span>)
        </div>
        <Bx x={840} y={322} w={700} h={62} c={C.green} text="XMATCH(J2, Branches)  ✓ exact by default" size={26} a={fade(t, a.zero + 0.6, 38.6)} on={1} />
        <PC x={1230} y={278} text="Fewer typing errors" c={C.green} a={fade(t, a.simple, 36, 0.4)} size={22} />
      </Panel>
      <Cursor x={cur.x} y={cur.y} t={t} left={[1.5]} />
      <Hud>
        <TopBadge text="الدالة التوأم XMATCH والبحث ثنائي الأبعاد | XMATCH & 2D XLOOKUP Engine" a={fade(t, 2, 18)} />
        <Tag text="XMATCH Syntax → =XMATCH(lookup_val, lookup_arr, [match_mode], [search_mode])" c={C.blue} a={fade(t, 22, 38)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 2 — nested XLOOKUP ───────── */
export const Scene2: React.FC<{from: number}> = ({from}) => {
  setCols(LKW);
  const t = useT(from);
  const a = A[2];
  const fx = '=XLOOKUP(J2,tbl_Matrix[Branch],XLOOKUP(K2,Months,Body))';
  const entered = t >= 65.8;
  const colOn = (i: number) => t >= 58.9 + 0.3 * i && t < 64.4;
  const hl: HL[] = [[2, 9, AM], [2, 10, AM]];
  for (let i = 0; i < 5; i++) if (colOn(i)) hl.push([2 + i, 6, BL]);
  if (t >= 64.4) hl.push([4, 3, 4, 7, AM]);
  if (t >= 65.6) hl.push([4, 6, GR]);
  const cw = 150, x0 = 230;
  const L2 = gx(2, 11);
  const cur = pt(t, [[40, {x: 1100, y: 500}], [41.4, L2], [60, L2], [85, L2]]);
  return (
    <Stage>
      <WinB sheets={['Lookup', 'Summary']} kind={lk('Cairo Main', 'Mar', entered ? '497,000' : '', hl)} selR={2} selC={11} formula={entered ? fx : typed(fx, t, 42.0, 51.5)} />
      <Panel a={fade(t, 41.0, 83.7, 0.8)}>
        <Fx x={170} y={10} size={30} a={clamp((t - 42) / 0.8)} toks={[['=XLOOKUP(', t >= a.outer ? C.green : W8], ['J2, tbl_Matrix[Branch], ', t >= a.outer ? C.green : W8], ['XLOOKUP(K2, Months, Body)', t >= a.inner ? C.blue : W8], [')', t >= a.outer ? C.green : W8]]} />
        {MON.map((m, j) => <div key={m} style={{position: 'absolute', left: x0 + j * cw, top: 78, width: cw - 6, height: 40, borderRadius: 8, background: j === 2 && t >= a.inner - 0.2 ? `${C.blue}55` : '#1E293B', border: `2px solid ${j === 2 && t >= a.inner - 0.2 ? C.blue : '#475569'}`, textAlign: 'center', lineHeight: '36px', fontFamily: mono, fontWeight: 700, fontSize: 24}}>{m}</div>)}
        {BRS.map((n, i) => (
          <div key={n}>
            <div style={{position: 'absolute', left: 30, top: 124 + i * 46, width: 190, height: 42, borderRadius: 8, background: i === 2 && t >= 64.4 ? `${C.amber}44` : '#1E293B', border: `2px solid ${i === 2 && t >= 64.4 ? C.amber : '#475569'}`, textAlign: 'center', lineHeight: '38px', fontFamily: ar, fontWeight: 600, fontSize: 24}}>{n}</div>
            {MAT[i].map((v, j) => {
              const col = j === 2 && colOn(i);
              const hit = i === 2 && j === 2 && t >= 65.6;
              const row = i === 2 && t >= 64.4;
              const c = hit ? C.green : col ? C.blue : row ? C.amber : '#475569';
              return <div key={j} style={{position: 'absolute', left: x0 + j * cw, top: 124 + i * 46, width: cw - 6, height: 42, borderRadius: 8, background: hit ? `${C.green}44` : col ? `${C.blue}33` : row ? `${C.amber}22` : '#1E293B', border: `2px solid ${c}`, boxShadow: hit ? `0 0 24px ${C.green}` : 'none', textAlign: 'center', lineHeight: '38px', fontFamily: mono, fontWeight: 700, fontSize: 22, direction: 'ltr'}}>{fmt(v)}</div>;
            })}
          </div>
        ))}
        <Bx x={900} y={86} w={660} h={112} c={C.blue} label="① Inner · returns the whole column (vector)" text="XLOOKUP(K2, Months, Body)" size={28} a={fade(t, a.inner, 83.7)} on={t < 64.4 ? 1 : 0.4} />
        <Bx x={900} y={222} w={660} h={112} c={C.green} label="② Outer · picks the intersecting cell" text="XLOOKUP(J2, tbl_Matrix[Branch], vector)" size={24} a={fade(t, a.cut, 83.7)} on={t >= 65.6 ? 1 : 0.4} />
        <PC x={930} y={344} text="Zero INDEX/MATCH Required  →  497,000" c={C.green} a={fade(t, 66.0, 83.7, 0.4)} />
        <PC x={930} y={344} text="Dynamic Array column (vector)" c={C.blue} a={fade(t, a.vector, 64.2, 0.4)} />
      </Panel>
      <Cursor x={cur.x} y={cur.y} t={t} left={[41.6]} />
      <Hud>
        <Tag text="Modern 2D Lookup → Nested XLOOKUP: =XLOOKUP(Row_Key, Rows, XLOOKUP(Col_Key, Cols, Body))" c={C.blue} a={fade(t, 42, 60)} />
        <Tag text="Zero INDEX/MATCH Needed → Inner XLOOKUP Returns Column Vector, Outer Returns Cell Value" c={C.green} a={fade(t, 64, 82)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 3 — INDEX + XMATCH, wildcards ───────── */
export const Scene3: React.FC<{from: number}> = ({from}) => {
  setCols(LKW);
  const t = useT(from);
  const a = A[3];
  const f1 = '=INDEX(Revenue,XMATCH(J2,Branches))';
  const f2 = '=XMATCH("Cai*",Branches,2)';
  const phase2 = t >= 105.7;
  const res = t >= 116.6 ? '3' : t >= 97.5 ? '1,105,000' : '';
  const hl: HL[] = [[2, 9, AM]];
  if (t >= 97.5 && t < 105.7) hl.push([5, 0, 5, 1, BL]);
  if (t >= 116.4) hl.push([4, 0, GR]);
  const formula = t >= 116.6 ? f2 : t >= 105.7 ? typed(f2, t, 105.8, 110.5) : t >= 97.5 ? f1 : typed(f1, t, 88.6, 94.5);
  const chain = (i: number) => clamp((t - (a.synergy + 0.5 * i)) / 0.5);
  const d = pt(t, [[96.9, {x: 125, y: 195}], [97.3, {x: 395, y: 195}], [97.7, {x: 665, y: 195}]]);
  const rows = [113.4, 113.9, 114.58];
  const L2 = gx(2, 11);
  return (
    <Stage>
      <WinB sheets={['Lookup', 'Summary']} kind={lk('Giza East', '', res, hl)} selR={2} selC={11} formula={formula} />
      <Panel a={fade(t, 86.6, 128.6, 0.8)}>
        <div style={{position: 'absolute', left: 800, top: 20, width: 2, height: 360, background: '#334155'}} />
        <Fx x={20} y={10} size={24} a={fade(t, 88.6, 92.0, 0.3)} toks={[['=INDEX(Revenue, ', C.purple], ['MATCH', C.red], ['(J2, Branches, 0))', C.purple]]} />
        <Fx x={20} y={58} size={28} a={clamp((t - 92.0) / 0.6)} toks={[['=INDEX(Revenue, ', W8], ['XMATCH', C.blue], ['(J2, Branches))', W8]]} />
        <Lines ls={[[240, 195, 280, 195, C.blue, chain(1)], [510, 195, 550, 195, C.blue, chain(2)]]} />
        <Bx x={10} y={150} w={230} h={90} c={C.amber} label="J2" text="Giza East" size={24} a={chain(0)} />
        <Bx x={280} y={150} w={230} h={90} c={C.blue} label="XMATCH →" text="4" a={chain(1)} on={t >= 97.5 ? 1 : 0} />
        <Bx x={550} y={150} w={240} h={90} c={C.green} label="INDEX →" text="1,105,000" size={26} a={chain(2)} on={t >= 97.5 ? 1 : 0} />
        <Dot x={d.x} y={d.y} c={C.blue} a={fade(t, 96.9, 98.0, 0.2)} />
        <PC x={40} y={300} text="Faster · exact match by default" c={C.blue} a={fade(t, 98.4, 105.5, 0.4)} />
        <Fx x={850} y={14} size={30} a={clamp((t - a.wild) / 0.6)} toks={[['=XMATCH(', W8], ['"Cai', W8], ['*', C.amber], ['"', W8], [', Branches, ', W8], ['2', C.amber], [')', W8]]} />
        {BRS.map((n, i) => {
          const done = t >= (rows[i] ?? 999);
          const hit = i === 2 && t >= 114.58;
          return (
            <div key={n} style={{position: 'absolute', left: 850, top: 78 + i * 56, width: 360, height: 48, borderRadius: 12, border: `3px solid ${hit ? C.green : done ? C.red : '#475569'}`, background: hit ? `${C.green}22` : 'transparent', boxShadow: hit ? `0 0 22px ${C.green}` : 'none', fontFamily: mono, fontWeight: 700, fontSize: 24, lineHeight: '42px', paddingLeft: 16, direction: 'ltr', opacity: clamp((t - a.wild) / 0.6) * (done && !hit ? 0.55 : 1)}}>
              {hit ? <span><span style={{color: C.green}}>Cai</span><span style={{color: C.amber}}>ro Main</span></span> : n}
              <span style={{position: 'absolute', right: 14, fontSize: 22, color: hit ? C.green : C.red}}>{hit ? '✓' : done ? '✗' : ''}</span>
            </div>
          );
        })}
        <Bx x={1260} y={150} w={300} h={120} c={C.green} label="Position" text="3" size={56} a={fade(t, 116.4, 128.6, 0.3)} on={1} />
        <PC x={1240} y={310} text="match_mode = 2 → Wildcards" c={C.amber} a={fade(t, a.two - 0.3, 128.6, 0.4)} size={22} />
      </Panel>
      <Ring x={L2.x - 80} y={L2.y - 24} w={160} h={48} c={C.blue} t={t} a={fade(t, 97.4, 100, 0.2) * (phase2 ? 0 : 1)} r={6} />
      <Hud>
        <Tag text="INDEX + XMATCH Synergy → Upgraded Modern Replacement for Classic INDEX/MATCH" c={C.blue} a={fade(t, 88, 106)} />
        <Tag text={'Wildcard Support (Match Mode 2) → XMATCH("Cai*", Range, 2) Finds Partial Text Positions'} c={C.amber} a={fade(t, 110, 126)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 4 — engine / performance (illustrative) ───────── */
export const Scene4: React.FC<{from: number}> = ({from}) => {
  setCols(LKW);
  const t = useT(from);
  const a = A[4];
  const hl: HL[] = [[4, 6, GR]];
  const gp = kf(t, [[a.speed, 0], [a.speed + 6, 1]]);
  const ang = (180 + 180 * gp) * (Math.PI / 180);
  const barL = kf(t, [[a.load, 0], [a.load + 4, 0.88]]);
  const barR = kf(t, [[a.load, 0], [a.load + 4, 0.32]]);
  const ca = clamp((t - a.engine - 0.4) / 0.6);
  return (
    <Stage>
      <WinB sheets={['Lookup', 'Summary']} kind={lk('Cairo Main', 'Mar', '497,000', hl)} selR={2} selC={11} formula={'=XLOOKUP(J2,tbl_Matrix[Branch],XLOOKUP(K2,Months,Body))'} />
      <Panel a={fade(t, 131.0, 168.9, 0.8)}>
        <div style={{position: 'absolute', left: 30, top: 24, width: 600, height: 352, borderRadius: 22, border: `4px solid ${C.amber}`, background: `${C.amber}10`, opacity: ca}}>
          <div style={{textAlign: 'center', fontFamily: ar, fontWeight: 700, fontSize: 30, marginTop: 14, color: C.amber}}>Classic INDEX / MATCH</div>
          <div style={{margin: '14px 60px 0', height: 56, borderRadius: 12, border: `3px solid ${C.amber}`, textAlign: 'center', lineHeight: '50px', fontFamily: mono, fontWeight: 700, fontSize: 24}}>MATCH → position</div>
          <div style={{margin: '12px 60px 0', height: 56, borderRadius: 12, border: `3px solid ${C.amber}`, textAlign: 'center', lineHeight: '50px', fontFamily: mono, fontWeight: 700, fontSize: 24}}>INDEX → value</div>
          <div style={{margin: '26px 40px 0', height: 26, borderRadius: 13, background: '#334155', overflow: 'hidden'}}><div style={{width: `${barL * 100}%`, height: 26, background: C.amber, boxShadow: `0 0 14px ${C.amber}`}} /></div>
          <div style={{textAlign: 'center', fontFamily: ar, fontSize: 22, color: C.dim, marginTop: 8}}>Calculation load</div>
        </div>
        <div style={{position: 'absolute', left: 970, top: 24, width: 600, height: 352, borderRadius: 22, border: `4px solid ${C.green}`, background: `${C.green}10`, opacity: ca, boxShadow: t >= a.dyn ? `0 0 ${24 + 10 * pls(t)}px ${C.green}` : 'none'}}>
          <div style={{textAlign: 'center', fontFamily: ar, fontWeight: 700, fontSize: 30, marginTop: 14, color: C.green}}>XMATCH & 2D XLOOKUP</div>
          <div style={{margin: '14px 40px 0', height: 126, borderRadius: 12, border: `3px solid ${C.green}`, textAlign: 'center', paddingTop: 22, fontFamily: mono, fontWeight: 700, fontSize: 24, lineHeight: '38px'}}>Dynamic Array engine<br />direct lookup</div>
          <div style={{margin: '26px 40px 0', height: 26, borderRadius: 13, background: '#334155', overflow: 'hidden'}}><div style={{width: `${barR * 100}%`, height: 26, background: C.green, boxShadow: `0 0 14px ${C.green}`}} /></div>
          <div style={{textAlign: 'center', fontFamily: ar, fontSize: 22, color: C.dim, marginTop: 8}}>Calculation load</div>
        </div>
        <svg style={{position: 'absolute', left: 660, top: 70, opacity: clamp((t - a.speed + 1) / 0.6)}} width={280} height={250} viewBox="0 0 280 250">
          <path d="M 30 170 A 110 110 0 0 1 250 170" fill="none" stroke="#334155" strokeWidth={22} strokeLinecap="round" />
          <path d="M 30 170 A 110 110 0 0 1 250 170" fill="none" stroke={C.green} strokeWidth={22} strokeLinecap="round" strokeDasharray={`${gp * 346} 400`} />
          <line x1={140} y1={170} x2={140 + 90 * Math.cos(ang)} y2={170 + 90 * Math.sin(ang)} stroke="#F8FAFC" strokeWidth={6} strokeLinecap="round" />
          <circle cx={140} cy={170} r={12} fill="#F8FAFC" />
          <text x={140} y={212} textAnchor="middle" fill="#F8FAFC" fontFamily={ar} fontWeight={700} fontSize={26}>Efficiency</text>
          <text x={140} y={240} textAnchor="middle" fill={C.dim} fontFamily={ar} fontSize={18}>illustrative visual</text>
        </svg>
        <PC x={1010} y={346} text="Native to Dynamic Arrays" c={C.green} a={fade(t, a.dyn, 150, 0.4)} size={22} />
        <PC x={60} y={346} text="Lighter memory load" c={C.green} a={fade(t, a.load + 0.5, 150, 0.4)} size={22} />
      </Panel>
      <Hud>
        <Tag text="Engine Performance → XMATCH Built Directly for Microsoft 365 Dynamic Array Calculation" c={C.green} a={fade(t, 132, 148)} />
        <Tag text="Lower Overhead → Helps Avoid Calculation Bottlenecks in Large Financial Models" c={C.green} a={fade(t, 152, 166)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 5 — 50,000 rows, 2D lookup ───────── */
export const Scene5: React.FC<{from: number}> = ({from}) => {
  setCols(S5W);
  const t = useT(from);
  const a = A[5];
  const fE = '=XLOOKUP([@Category],tbl_Rates[Category],XLOOKUP([@Branch],RateBranches,RateBody))';
  const fF = '=[@Revenue]*[@Rate]';
  const flags = (t >= 191.0 ? 'r' : '') + (t >= 195.2 ? 'c' : '');
  const selC = t >= 193.2 ? 5 : 4;
  const formula = t < 191.0 ? typed(fE, t, 185.6, 190.6) : t < 193.3 ? fE : t < 195.2 ? typed(fF, t, 193.3, 195.0) : fF;
  const sr = kf(t, [[171, 1], [191.1, 1], [192.6, 30000], [192.8, 30000], [193.1, 1], [195.4, 1], [199.0, 49990], [208, 49990]]);
  const g5 = {fr: 1, fc: 0, sr: 2, sc: 0};
  const cur = pt(t, [[171, {x: 1100, y: 640}], [185.2, gx(2, 4, g5)], [192.9, gx(2, 4, g5)], [193.2, gx(2, 5, g5)], [208, {x: 1100, y: 700}]]);
  const ev = 2 + (Math.floor(Math.max(0, t - 187) / 1.0) % 4);
  const cur5 = sRow(ev);
  const sealP = kf(t, [[199.0, 0], [199.9, 1]]);
  const sealA = clamp(sealP) * clamp((208 - t) / 0.6);
  const load = fade(t, 171.6, 178.8, 0.4);
  const cardA = fade(t, a.write, 200, 0.5);
  return (
    <Stage>
      <WinB sheets={['Sales', 'Rates']} kind={`s5|${flags}`} selR={2} selC={selC} fr={1} sr={sr} formula={formula} />
      <Ring x={P(235, 3).x} y={P(235, 3).y} w={330 * Z} h={26 * Z} c={C.green} t={t} a={fade(t, a.file - 0.2, 183.3)} />
      <Chip x={960} y={170} center text="50,000 data rows" c={C.green} a={fade(t, a.fifty - 0.3, 188)} />
      <Chip x={960} y={170} center text="One formula fills the whole column" c={C.green} a={fade(t, 191.1, 195)} />
      <Chip x={960} y={170} center text="Commission = Revenue × Rate" c={C.blue} a={fade(t, 195.3, 200)} />
      <div style={{position: 'absolute', left: 1150, top: 410, width: 710, height: 470, opacity: cardA, borderRadius: 22, background: 'rgba(15,23,42,.95)', border: `3px solid ${C.blue}`, boxShadow: `0 0 26px ${C.blue}55`, fontFamily: ar, color: W8, zIndex: 20, padding: '14px 18px', boxSizing: 'border-box'}}>
        <div style={{fontSize: 26, fontWeight: 700, textAlign: 'center', color: C.blue}}>tbl_Rates · Category × Branch</div>
        <div style={{display: 'flex', marginTop: 12, direction: 'ltr'}}>
          <div style={{width: 160}} />
          {SBR.map((b, j) => <div key={b} style={{flex: 1, textAlign: 'center', fontFamily: mono, fontWeight: 700, fontSize: 22, color: j === cur5.b && t >= 187 ? C.amber : '#CBD5E1'}}>{b}</div>)}
        </div>
        {CATS.map((c, i) => (
          <div key={c} style={{display: 'flex', marginTop: 10, direction: 'ltr'}}>
            <div style={{width: 160, fontFamily: mono, fontWeight: 700, fontSize: 22, lineHeight: '56px', color: i === cur5.c && t >= 187 ? C.amber : '#CBD5E1'}}>{c}</div>
            {RATE[i].map((v, j) => {
              const hit = i === cur5.c && j === cur5.b && t >= 187;
              return <div key={j} style={{flex: 1, margin: '0 4px', height: 56, borderRadius: 10, border: `3px solid ${hit ? C.green : '#475569'}`, background: hit ? `${C.green}33` : 'transparent', boxShadow: hit ? `0 0 20px ${C.green}` : 'none', textAlign: 'center', lineHeight: '50px', fontFamily: mono, fontWeight: 700, fontSize: 24}}>{v.toFixed(1)}%</div>;
            })}
          </div>
        ))}
        <div style={{marginTop: 16, textAlign: 'center', fontFamily: mono, fontSize: 22, color: C.green, direction: 'ltr'}}>{t >= 187 ? `${cur5.cat} × ${cur5.br} → ${cur5.rate.toFixed(1)}%` : ''}</div>
      </div>
      <Cursor x={cur.x} y={cur.y} t={t} left={[185.4, 193.2]} />
      {load > 0.01 && (
        <div style={{position: 'absolute', left: 560, top: 400, width: 800, height: 220, opacity: load, borderRadius: 20, background: 'rgba(15,23,42,.96)', border: `3px solid ${C.blue}`, boxShadow: `0 0 30px ${C.blue}66`, zIndex: 60, fontFamily: ar, color: W8, textAlign: 'center', paddingTop: 36, boxSizing: 'border-box'}}>
          <div style={{fontSize: 38, fontWeight: 700, direction: 'ltr'}}>Loading {FILE}</div>
          <div style={{fontSize: 28, color: C.dim, marginTop: 6}}>50,000 rows</div>
          <div style={{margin: '24px 60px 0', height: 14, background: '#334155', borderRadius: 7}}><div style={{width: `${kf(t, [[172.0, 0], [178.2, 100]])}%`, height: 14, background: C.blue, borderRadius: 7}} /></div>
        </div>
      )}
      <Hud>
        <Tag text="Enterprise 2D Matrix Lookup → Execute 2D Nested XLOOKUP Across 50,000 Sales Records" c={C.blue} a={fade(t, 172, 188)} />
        <Tag text="Modern 365 Architecture → Instant Two-Way Data Extraction Across All Rows" c={C.green} a={fade(t, 192, 206)} />
        {sealA > 0.01 && (
          <div style={{position: 'absolute', left: 730, top: 310, width: 460, height: 460, opacity: sealA, transform: `scale(${0.5 + 0.5 * clamp(sealP)})`, zIndex: 80}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, #065F46 0%, #0F172A 72%)', border: `6px solid ${C.green}`, boxShadow: `0 0 ${50 + 30 * pls(t, 1.6)}px ${C.green}`}} />
            <div style={{position: 'absolute', inset: 26, borderRadius: '50%', border: `2px dashed ${C.green}`, transform: `rotate(${(t - 199) * 30}deg)`}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontSize: 120, color: C.green, lineHeight: '120px'}}>✓</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', fontFamily: ar, fontWeight: 700, fontSize: 36}}>Enterprise 2D Lookup</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 276, textAlign: 'center', fontFamily: ar, fontWeight: 600, fontSize: 30, color: '#6EE7B7'}}>Modern 365 Architecture</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 340, textAlign: 'center', fontFamily: mono, fontSize: 24, color: C.dim}}>{FILE}</div>
          </div>
        )}
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 6 — unit 3 complete ───────── */
export const Scene6: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[6];
  const pop = (s: number) => {
    const p = clamp((t - s) / 0.6);
    return {opacity: p, transform: `translateY(${(1 - p) * 26}px)`};
  };
  const prog = kf(t, [[211.6, 0], [215.0, 100]]);
  const skills = ['XMATCH — exact match by default, no 0 needed', 'Nested XLOOKUP — 2D lookup without INDEX/MATCH', 'INDEX + XMATCH and Wildcards (match_mode 2)', 'Dynamic Array engine — lighter calculation'];
  const out = clamp((t - 238.3) / 1.6);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 80, top: 110, width: 1760, height: 860, borderRadius: 32, background: 'rgba(30,41,59,.78)', border: '2px solid rgba(148,163,184,.35)', boxShadow: '0 30px 90px rgba(0,0,0,.5)', fontFamily: ar, color: W8, ...pop(a.great - 0.2)}}>
        <div style={{position: 'absolute', left: 60, top: 50, display: 'flex', alignItems: 'center', gap: 28}}>
          <div style={{margin: '-56px -44px'}}><Logo s={230} /></div>
          <div>
            <div dir="rtl" style={{fontSize: 52, fontWeight: 700, whiteSpace: 'nowrap'}}>منظومة أكاديمي | Manzooma Excel Masterclass</div>
            <div style={{fontSize: 28, color: C.dim, marginTop: 4}}>Excel From Zero to Professional — Unit 3: Lookup & Data Merging Engine</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 250, width: 820, ...pop(211.0)}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, padding: '12px 26px', borderRadius: 18, background: 'rgba(251,191,36,.16)', border: `3px solid ${GOLD}`, boxShadow: `0 0 ${14 + 12 * pls(t, 1.8)}px ${GOLD}66`, fontSize: 30, fontWeight: 600, direction: 'ltr'}}>
            <span style={{fontSize: 40, color: GOLD}}>✓</span>Unit 3 Fully Completed: Lookup & Data Merging Engine Mastered
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 390, width: 800, ...pop(211.4)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, color: C.dim, direction: 'ltr'}}><span>Unit 3 progress</span><span style={{color: W8, fontWeight: 700}}>{Math.round(prog)}%</span></div>
          <div style={{marginTop: 12, height: 26, borderRadius: 13, background: '#334155', overflow: 'hidden'}}><div style={{width: `${prog}%`, height: 26, borderRadius: 13, background: `linear-gradient(90deg, ${C.green}, ${GOLD})`, boxShadow: `0 0 18px ${GOLD}`}} /></div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 520, width: 820, direction: 'ltr'}}>
          {skills.map((s, i) => (
            <div key={s} style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 28, margin: '0 0 22px', ...pop(212.0 + i * 0.7)}}>
              <span style={{width: 40, height: 40, borderRadius: 20, background: GOLD, color: '#0F172A', textAlign: 'center', lineHeight: '40px', fontWeight: 700, fontSize: 26}}>✓</span>{s}
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 940, top: 250, width: 760, height: 300, borderRadius: 24, background: 'rgba(15,23,42,.7)', border: `2px solid ${C.blue}`, padding: '30px 40px', boxSizing: 'border-box', direction: 'ltr', ...pop(a.down)}}>
          <div style={{fontSize: 30, color: C.dim}} dir="rtl">الملفات والتدريبات</div>
          <div style={{fontFamily: mono, fontSize: 30, fontWeight: 700, color: C.blue, marginTop: 18}}>{FILE}</div>
          <div style={{fontFamily: mono, fontSize: 36, fontWeight: 700, color: W8, marginTop: 24, padding: '14px 18px', border: `2px dashed ${C.blue}`, borderRadius: 14, boxShadow: `0 0 ${10 + 14 * pls(t, 1.8)}px ${C.blue}55`}}>solutions.gomaaintelligence.me</div>
        </div>
        <div style={{position: 'absolute', left: 940, top: 590, width: 760, height: 280, borderRadius: 24, background: 'rgba(15,23,42,.7)', border: `2px solid ${C.purple}`, padding: '26px 40px', boxSizing: 'border-box', ...pop(a.next - 0.6)}}>
          <div dir="rtl" style={{fontSize: 28, color: C.dim}}>الدرس القادم — بداية الوحدة الرابعة</div>
          <div dir="rtl" style={{fontSize: 42, fontWeight: 700, marginTop: 10, lineHeight: '58px'}}>الدرس 15: دوال المصفوفات الديناميكية الحديثة</div>
          <div style={{fontSize: 32, color: '#C4B5FD', marginTop: 10, direction: 'ltr', fontWeight: 600}}>FILTER · SORT · UNIQUE →</div>
        </div>
      </div>
      <Hud />
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: out}} />
    </Stage>
  );
};
