import React from 'react';
import {A} from './anchors';
import {ar, mono} from './fonts';
import {Chip, Cursor, Grid, Logo, P, Ring, Stage, Tag, TopBadge, Win, cellWin, clamp, colName, fade, formulaOf, kf, pls, useT} from './kit';
import {C, FILE, WIN, Z} from './theme';

const W8 = '#F8FAFC';
const pt = (t: number, k: [number, {x: number; y: number}][]) => ({
  x: kf(t, k.map((q) => [q[0], q[1].x] as [number, number])),
  y: kf(t, k.map((q) => [q[0], q[1].y] as [number, number])),
});
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.floor(s.length * clamp((t - a) / (b - a))));
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
type WB = {kind: string; selR: number; selC: number; formula: string; fr?: number; sr?: number};
const WinB: React.FC<WB> = (p) => (
  <Win {...WIN} title={`${FILE} - Excel`} tab="Home" sheets={[{n: 'Sales'}, {n: 'Summary'}]} act={0} nameBox={`${colName(p.selC)}${p.selR}`} formula={p.formula}>
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
const Bx: React.FC<{x: number; y: number; w: number; h: number; c: string; label?: string; text: string; a?: number; on?: number; size?: number}> = ({x, y, w, h, c, label, text, a = 1, on = 0, size = 38}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', opacity: a, borderRadius: 18, border: `4px solid ${c}`, background: `${c}${on > 0.5 ? '33' : '12'}`, boxShadow: on > 0 ? `0 0 ${30 * on}px ${c}` : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', direction: 'ltr'}}>
    {label && <div style={{fontFamily: ar, fontSize: 22, color: '#CBD5E1', marginBottom: 4}}>{label}</div>}
    <div style={{fontFamily: mono, fontWeight: 700, fontSize: size, color: W8}}>{text}</div>
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
const PC: React.FC<{x: number; y: number; text: string; c: string; a: number; size?: number}> = ({x, y, text, c, a, size = 26}) => <Chip x={x} y={y} text={text} c={c} a={a} size={size} />;

/* ───────── SCENE 1 — IF anatomy + decision tree ───────── */
export const Scene1: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[1];
  const fx = '=IF(C2>=50000,"Target Met","Below Target")';
  const entered = t >= 28.5;
  const blocks = 1 - clamp((t - 21.5) / 0.8);
  const tree = clamp((t - 22.0) / 0.8);
  const d1 = pt(t, [[26.0, {x: 320, y: 155}], [26.8, {x: 560, y: 200}], [27.6, {x: 940, y: 195}], [28.4, {x: 1180, y: 145}]]);
  const d2 = pt(t, [[29.6, {x: 320, y: 285}], [30.4, {x: 560, y: 235}], [31.2, {x: 940, y: 235}], [32.0, {x: 1180, y: 335}]]);
  const F2 = gx(2, 5);
  const cur = pt(t, [[0, {x: 1100, y: 500}], [1.4, F2], [4, F2], [40, {x: 1100, y: 500}]]);
  return (
    <Stage>
      <WinB kind={entered ? 'b1v' : 'b1'} selR={2} selC={5} formula={entered ? fx : typed(fx, t, 2.0, 9.0)} />
      <Ring x={F2.x - 90} y={F2.y - 24} w={180} h={48} c={C.amber} t={t} a={fade(t, 1.6, 3.0)} r={6} />
      <Panel a={fade(t, 1.0, 38.9, 0.8)}>
        <Fx x={330} y={16} toks={[['=IF(', W8], ['C2>=50000', C.amber], [', ', W8], ['"Target Met"', C.green], [', ', W8], ['"Below Target"', C.red], [')', W8]]} a={clamp((t - 2) / 0.8)} />
        <Bx x={60} y={130} w={470} h={140} c={C.amber} label="logical_test" text="C2>=50000" a={fade(t, a.test, 21.9) * blocks} on={1} />
        <Bx x={565} y={130} w={470} h={140} c={C.green} label="value_if_true" text={'"Target Met"'} a={fade(t, a.vtrue, 21.9) * blocks} on={1} />
        <Bx x={1070} y={130} w={470} h={140} c={C.red} label="value_if_false" text={'"Below Target"'} a={fade(t, a.vfalse, 21.9) * blocks} on={1} />
        <div style={{position: 'absolute', inset: 0, opacity: tree}}>
          <Lines ls={[[320, 155, 560, 205, '#64748B', 1], [320, 285, 560, 235, '#64748B', 1], [940, 195, 1180, 145, C.green, 0.9], [940, 235, 1180, 335, C.red, 0.9]]} />
          <Bx x={40} y={120} w={280} h={70} c={C.amber} text="C2 = 60,000" size={30} />
          <Bx x={40} y={250} w={280} h={70} c={C.amber} text="C3 = 35,000" size={30} />
          <Bx x={560} y={150} w={380} h={110} c={C.amber} label="logical_test" text="Sales >= 50000" size={30} on={0.6 + 0.4 * pls(t)} />
          <Bx x={1180} y={100} w={380} h={90} c={C.green} label="TRUE" text="Target Met" on={clamp((t - 28.4) / 0.4)} />
          <Bx x={1180} y={290} w={380} h={90} c={C.red} label="FALSE" text="Below Target" on={clamp((t - 32.0) / 0.4)} />
          <Dot x={d1.x} y={d1.y} c={C.green} a={fade(t, 26.0, 28.6, 0.2)} />
          <Dot x={d2.x} y={d2.y} c={C.red} a={fade(t, 29.6, 32.2, 0.2)} />
        </div>
      </Panel>
      <Cursor x={cur.x} y={cur.y} t={t} left={[1.5]} />
      <Hud>
        <TopBadge text="المنطق الشرطي المتعدد والإنشاء المركب | IF, AND & OR Logic Engine" a={fade(t, 2, 18)} />
        <Tag text="IF Function Syntax → =IF(Logical_Test, Value_if_True, Value_if_False)" c={C.amber} a={fade(t, 22, 38)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 2 — IF + AND ───────── */
export const Scene2: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[2];
  const c2 = t >= 67.94;
  const r = c2 ? 4 : 2;
  const g1 = !c2 ? (t >= 56.4 ? 1 : 0) : t >= 68.5 ? 1 : 0;
  const g2 = !c2 ? (t >= 59.8 ? 1 : 0) : t >= 69.6 ? -1 : 0;
  const col = (s: number) => (s === 1 ? C.green : s === -1 ? C.red : C.amber);
  const out = !c2 ? (t >= 65.8 ? 1 : 0) : t >= 70.6 ? -1 : 0;
  const fx = '=IF(AND(C2>=50000,D2>0.15),"Bonus Eligible","No Bonus")';
  const entered = t >= 65.8;
  const selR = c2 ? 4 : 2;
  const F2 = gx(2, 5);
  const andOn = !c2 ? (t >= 62.5 ? 1 : 0) : t >= 69.6 ? -1 : 0;
  return (
    <Stage>
      <WinB kind={entered ? 'b2v' : 'b2'} selR={selR} selC={5} formula={entered ? formulaOf('b2v', selR, 5) : typed(fx, t, 42.0, 48.0)} />
      <Panel a={fade(t, 41.4, 83.7, 0.8)}>
        <Fx x={150} y={16} size={34} toks={[['=IF(', W8], ['AND(', W8], [`C${r}>=50000`, col(g1)], [', ', W8], [`D${r}>0.15`, col(g2)], ['), ', W8], ['"Bonus Eligible"', C.green], [', ', W8], ['"No Bonus"', C.red], [')', W8]]} a={clamp((t - 42) / 0.8)} />
        <Lines ls={[[500, 215, 560, 215, col(g1), 0.9], [1000, 215, 1060, 225, col(g2), 0.9], [1170, 225, 1200, 215, col(out), 0.9]]} />
        <Bx x={60} y={140} w={440} h={150} c={col(g1)} label="Gate 1 · Sales >= 50,000" text={`C${r} = ${c2 ? '58,000' : '60,000'}  ${g1 === 1 ? '✓' : '?'}`} on={g1 !== 0 ? 1 : 0} a={clamp((t - a.and) / 0.6)} size={34} />
        <Bx x={560} y={140} w={440} h={150} c={col(g2)} label="Gate 2 · Margin > 15%" text={`D${r} = ${c2 ? '12%' : '22%'}  ${g2 === 1 ? '✓' : g2 === -1 ? '✗' : '?'}`} on={g2 !== 0 ? 1 : 0} a={clamp((t - a.and - 0.3) / 0.6)} size={34} />
        <div style={{position: 'absolute', left: 1060, top: 165, width: 110, height: 110, borderRadius: 55, border: `4px solid ${col(andOn)}`, background: `${col(andOn)}22`, boxShadow: andOn ? `0 0 28px ${col(andOn)}` : 'none', textAlign: 'center', lineHeight: '102px', fontFamily: mono, fontWeight: 700, fontSize: 32, opacity: clamp((t - a.and) / 0.6)}}>AND</div>
        <Bx x={1200} y={140} w={340} h={150} c={out === 0 ? '#64748B' : out === 1 ? C.green : C.red} label="Output" text={out === 0 ? '?' : out === 1 ? 'Bonus Eligible' : 'No Bonus'} on={out !== 0 ? 1 : 0} size={out === 0 ? 50 : 34} a={clamp((t - a.and - 0.6) / 0.6)} />
        <PC x={560} y={330} text="ALL conditions must be TRUE" c={C.green} a={fade(t, a.all, 56, 0.4)} />
        <PC x={420} y={330} text="Gate 2 fails → No Bonus" c={C.red} a={fade(t, 70.0, 76, 0.4)} />
      </Panel>
      <Cursor x={F2.x} y={F2.y} t={t} left={[]} />
      <Hud>
        <Tag text="IF + AND Logic → ALL Conditions Must Be TRUE to Trigger True Output" c={C.green} a={fade(t, 42, 60)} />
        <Tag text="Strict Criteria → Sales >= 50K AND Margin > 15%" c={C.green} a={fade(t, 64, 82)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 3 — IF + OR ───────── */
export const Scene3: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[3];
  const fx = '=IF(OR(E2="Cairo",E2="Alex"),"Free Shipping","Shipping Fee")';
  const entered = t >= 110.4;
  const l1 = t >= 101.6, l2 = t >= 108.0;
  const d = pt(t, [[108.2, {x: 290, y: 205}], [108.7, {x: 380, y: 300}], [109.3, {x: 800, y: 300}], [109.8, {x: 960, y: 235}], [110.1, {x: 1070, y: 225}], [110.4, {x: 1140, y: 210}]]);
  const E2 = gx(2, 4);
  const o1 = clamp((t - a.ex) / 0.6);
  return (
    <Stage>
      <WinB kind={entered ? 'b3v' : 'b3'} selR={2} selC={5} formula={entered ? fx : typed(fx, t, 88.0, 96.5)} />
      <Ring x={E2.x - 50} y={E2.y - 16} w={100} h={32} c={C.purple} t={t} a={fade(t, 100.5, 111, 0.4)} r={6} />
      <Panel a={fade(t, 86.6, 128.7, 0.8)}>
        <Fx x={150} y={16} size={34} toks={[['=IF(OR(', W8], ['E2="Cairo"', l1 ? C.red : C.amber], [', ', W8], ['E2="Alex"', l2 ? C.purple : C.amber], ['), ', W8], ['"Free Shipping"', C.blue], [', ', W8], ['"Shipping Fee"', '#94A3B8'], [')', W8]]} a={clamp((t - 88) / 0.8)} />
        <Lines ls={[[290, 205, 380, 150, '#64748B', o1], [290, 205, 380, 300, l2 ? C.purple : '#64748B', o1], [800, 150, 960, 215, '#475569', o1], [800, 300, 960, 235, l2 ? C.purple : '#475569', o1], [1070, 225, 1140, 210, entered ? C.blue : '#475569', o1]]} />
        <Bx x={40} y={165} w={250} h={80} c={C.purple} text="E2 = Alex" size={30} a={o1} />
        <Bx x={380} y={95} w={420} h={110} c={l1 ? C.red : C.amber} label="Stream 1" text={'E2 = "Cairo"'} on={l1 ? 0.4 : 0} a={o1 * (l1 ? 0.55 : 1)} size={32} />
        <Bx x={380} y={245} w={420} h={110} c={l2 ? C.purple : C.amber} label="Stream 2" text={'E2 = "Alex"'} on={l2 ? 1 : 0} a={o1} size={32} />
        <div style={{position: 'absolute', left: 820, top: 112, fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.red, opacity: l1 ? 1 : 0}}>FALSE</div>
        <div style={{position: 'absolute', left: 820, top: 262, fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.purple, opacity: l2 ? 1 : 0}}>TRUE</div>
        <div style={{position: 'absolute', left: 960, top: 170, width: 110, height: 110, borderRadius: 55, border: `4px solid ${l2 ? C.purple : '#64748B'}`, background: l2 ? `${C.purple}22` : 'transparent', boxShadow: l2 ? `0 0 28px ${C.purple}` : 'none', textAlign: 'center', lineHeight: '102px', fontFamily: mono, fontWeight: 700, fontSize: 32, opacity: o1}}>OR</div>
        <Bx x={1140} y={150} w={400} h={120} c={entered ? C.blue : '#64748B'} label="Output" text={entered ? 'Free Shipping' : '?'} on={entered ? 1 : 0} a={o1} size={entered ? 34 : 50} />
        <Dot x={d.x} y={d.y} c={C.blue} a={fade(t, 108.2, 110.6, 0.2)} />
        <PC x={520} y={345} text="ANY one TRUE is enough" c={C.purple} a={fade(t, a.any, 98, 0.4)} />
        <PC x={440} y={345} text="Both conditions are NOT required" c={C.blue} a={fade(t, a.notboth, 116, 0.4)} />
      </Panel>
      <Hud>
        <Tag text="IF + OR Logic → ANY Single Condition TRUE Triggers the True Output" c={C.purple} a={fade(t, 88, 106)} />
        <Tag text={'Flexible Rule → Branch = "Cairo" OR Branch = "Alex"'} c={C.blue} a={fade(t, 110, 126)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 4 — Nested IF ladder + order trap ───────── */
const Ladder: React.FC<{x: number; rows: [string, string, string][]; t: number; reveal: number[]}> = ({x, rows, t, reveal}) => (
  <div style={{position: 'absolute', left: 0, top: 0}}>
    {rows.map(([cond, res, c], i) => {
      const p = clamp((t - reveal[i]) / 0.5);
      return (
        <div key={i} style={{opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
          <Bx x={x + i * 40} y={115 + i * 80} w={330} h={70} c={c} text={cond} size={28} />
          <Bx x={x + 460} y={115 + i * 80} w={210} h={70} c={c} text={res} size={30} />
        </div>
      );
    })}
  </div>
);
export const Scene4: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[4];
  const fx = '=IF(C5>=100000,"Tier 1",IF(C5>=50000,"Tier 2","Tier 3"))';
  const entered = t >= 141.2;
  const dL = pt(t, [[139.4, {x: 40, y: 60}], [140.0, {x: 205, y: 150}], [141.0, {x: 440, y: 150}]]);
  const dR = pt(t, [[149.0, {x: 840, y: 60}], [149.8, {x: 1005, y: 150}], [150.8, {x: 1240, y: 150}]]);
  const wrong = clamp((t - a.wrong) / 0.6);
  const F5 = gx(5, 5);
  const cur = pt(t, [[130, {x: 1100, y: 500}], [134.6, F5], [135.0, F5], [168, F5]]);
  return (
    <Stage>
      <WinB kind={entered ? 'b4v' : 'b4'} selR={5} selC={5} formula={entered ? fx : typed(fx, t, 135.6, 141.0)} />
      <Panel a={fade(t, 131.6, 168.7, 0.8)}>
        <Fx x={40} y={8} size={27} a={clamp((t - 135.6) / 0.6)} toks={[['=IF(', W8], ['C5>=100000', C.amber], [',', W8], ['"Tier 1"', C.green], [',\n   IF(', W8], ['C5>=50000', C.amber], [',', W8], ['"Tier 2"', C.green], [',', W8], ['"Tier 3"', C.red], ['))', W8]]} />
        <Fx x={860} y={8} size={27} a={wrong} toks={[['=IF(', W8], ['C5>=50000', C.red], [',', W8], ['"Tier 2"', C.red], [',\n   IF(', W8], ['C5>=100000', '#94A3B8'], [',', W8], ['"Tier 1"', '#94A3B8'], [',', W8], ['"Tier 3"', C.red], ['))', W8]]} />
        <Ladder x={40} t={t} reveal={[a.nested, a.tiers, a.inside]} rows={[['C5>=100000', 'Tier 1', C.green], ['C5>=50000', 'Tier 2', C.amber], ['ELSE', 'Tier 3', C.purple]]} />
        <div style={{position: 'absolute', left: 820, top: 0, width: 780, height: 400, opacity: wrong}}>
          <Ladder x={40} t={t} reveal={[a.wrong, a.wrong + 0.3, a.wrong + 0.6]} rows={[['C5>=50000', 'Tier 2', C.red], ['C5>=100000', 'Tier 1', '#64748B'], ['ELSE', 'Tier 3', '#64748B']]} />
        </div>
        <div style={{position: 'absolute', left: dL.x - 55, top: dL.y - 22, width: 110, height: 44, borderRadius: 12, background: C.green, color: '#0F172A', fontFamily: mono, fontWeight: 700, fontSize: 26, textAlign: 'center', lineHeight: '44px', boxShadow: `0 0 22px ${C.green}`, opacity: fade(t, 139.4, 142.5, 0.2)}}>120,000</div>
        <div style={{position: 'absolute', left: dR.x - 55, top: dR.y - 22, width: 110, height: 44, borderRadius: 12, background: C.red, color: '#0F172A', fontFamily: mono, fontWeight: 700, fontSize: 26, textAlign: 'center', lineHeight: '44px', boxShadow: `0 0 22px ${C.red}`, opacity: fade(t, 149.0, 156.5, 0.2)}}>120,000</div>
        <PC x={870} y={190} text="Logic Overlap Trap" c={C.amber} a={fade(t, a.trap, 146.4, 0.4)} />
        <PC x={860} y={270} text="▼ Highest → Lowest" c={C.green} a={fade(t, a.order, 146.4, 0.4)} />
        <PC x={850} y={352} text="120,000 trapped in Tier 2 — Tier 1 never reached" c={C.red} a={fade(t, a.hold, 156.6, 0.4)} size={24} />
        <PC x={60} y={352} text="Correct order → 120,000 = Tier 1" c={C.green} a={fade(t, a.right, 168.4, 0.4)} size={24} />
      </Panel>
      <Cursor x={cur.x} y={cur.y} t={t} left={[134.8]} />
      <Hud>
        <Tag text="Nested IF Architecture → Evaluate Conditions Sequentially from Highest to Lowest" c={C.purple} a={fade(t, 132, 148)} />
        <Tag text="Logic Trap Warning → Incorrect Range Order Blinds Higher Logical Thresholds" c={C.red} a={fade(t, 152, 166)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 5 — 50,000 rows ───────── */
export const Scene5: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[5];
  const fF = '=IF([@Sales]>=100000,"Tier 1",IF([@Sales]>=50000,"Tier 2","Tier 3"))';
  const fG = '=IF(OR([@Branch]="Cairo",[@Branch]="Alex"),"Free Shipping","Shipping Fee")';
  const kind = t >= 194.8 ? 'b5vwc' : t >= 188.4 ? 'b5vc' : 'b5c';
  const selC = t >= 190.8 ? 6 : 5;
  const formula = t < 188.4 ? typed(fF, t, 184.2, 187.9) : t < 190.8 ? fF : t < 194.8 ? typed(fG, t, 190.9, 194.5) : fG;
  const sr = kf(t, [[171, 1], [188.5, 1], [190.0, 30000], [190.2, 30000], [190.8, 1], [195.0, 1], [198.4, 49990], [208, 49990]]);
  const g5 = {fr: 1, fc: 0, sr: 2, sc: 0};
  const cur = pt(t, [[171, {x: 1100, y: 640}], [183.6, gx(2, 5, g5)], [190.6, gx(2, 5, g5)], [191.0, gx(2, 6, g5)], [208, {x: 1100, y: 700}]]);
  const sealP = kf(t, [[198.5, 0], [199.4, 1]]);
  const sealA = clamp(sealP) * clamp((208 - t) / 0.6);
  const load = fade(t, 171.6, 178.8, 0.4);
  return (
    <Stage>
      <WinB kind={kind} selR={2} selC={selC} fr={1} sr={sr} formula={formula} />
      <Ring x={P(235, 3).x} y={P(235, 3).y} w={330 * Z} h={26 * Z} c={C.green} t={t} a={fade(t, a.file - 0.2, 183.3)} />
      <Chip x={960} y={560} center text="50,000 data rows" c={C.green} a={fade(t, a.fifty - 0.3, 186.5)} />
      <Chip x={960} y={170} center text="Table formulas use [@Sales] — one formula fills the whole column" c={C.green} a={fade(t, 188.5, 193.0)} />
      <Chip x={960} y={170} center text="Shipping rule fills all rows too" c={C.blue} a={fade(t, 195.0, 200)} />
      <Cursor x={cur.x} y={cur.y} t={t} left={[183.6, 190.8]} />
      {load > 0.01 && (
        <div style={{position: 'absolute', left: 560, top: 400, width: 800, height: 220, opacity: load, borderRadius: 20, background: 'rgba(15,23,42,.96)', border: `3px solid ${C.blue}`, boxShadow: `0 0 30px ${C.blue}66`, zIndex: 60, fontFamily: ar, color: W8, textAlign: 'center', paddingTop: 36, boxSizing: 'border-box'}}>
          <div style={{fontSize: 38, fontWeight: 700, direction: 'ltr'}}>Loading {FILE}</div>
          <div style={{fontSize: 28, color: C.dim, marginTop: 6}}>50,000 rows</div>
          <div style={{margin: '24px 60px 0', height: 14, background: '#334155', borderRadius: 7}}><div style={{width: `${kf(t, [[172.0, 0], [178.2, 100]])}%`, height: 14, background: C.blue, borderRadius: 7}} /></div>
        </div>
      )}
      <Hud>
        <Tag text="Enterprise Conditional Logic → Classify 50,000 Sales Records via Nested IF & OR Logic" c={C.blue} a={fade(t, 172, 188)} />
        <Tag text="Automated Decisions → Instant Multi-Tier Commission & Shipping Allocation" c={C.green} a={fade(t, 192, 206)} />
        {sealA > 0.01 && (
          <div style={{position: 'absolute', left: 730, top: 310, width: 460, height: 460, opacity: sealA, transform: `scale(${0.5 + 0.5 * clamp(sealP)})`}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, #065F46 0%, #0F172A 72%)', border: `6px solid ${C.green}`, boxShadow: `0 0 ${50 + 30 * pls(t, 1.6)}px ${C.green}`}} />
            <div style={{position: 'absolute', inset: 26, borderRadius: '50%', border: `2px dashed ${C.green}`, transform: `rotate(${(t - 198.5) * 30}deg)`}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontSize: 120, color: C.green, lineHeight: '120px'}}>✓</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', fontFamily: ar, fontWeight: 700, fontSize: 36}}>Enterprise Logic</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 276, textAlign: 'center', fontFamily: ar, fontWeight: 600, fontSize: 30, color: '#6EE7B7'}}>Automated Decisions</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 340, textAlign: 'center', fontFamily: mono, fontSize: 24, color: C.dim}}>{FILE}</div>
          </div>
        )}
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 6 — academy outro ───────── */
export const Scene6: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[6];
  const pop = (s: number) => {
    const p = clamp((t - s) / 0.6);
    return {opacity: p, transform: `translateY(${(1 - p) * 26}px)`};
  };
  const prog = kf(t, [[211.6, 0], [214.6, 60]]);
  const skills = ['IF — Logical test, Value if true, Value if false', 'IF + AND — all conditions must be TRUE', 'IF + OR — any one condition is enough', 'Nested IF — order from highest to lowest'];
  const out = clamp((t - 238.3) / 1.6);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 80, top: 110, width: 1760, height: 860, borderRadius: 32, background: 'rgba(30,41,59,.78)', border: '2px solid rgba(148,163,184,.35)', boxShadow: '0 30px 90px rgba(0,0,0,.5)', fontFamily: ar, color: W8, ...pop(a.great - 0.2)}}>
        <div style={{position: 'absolute', left: 60, top: 50, display: 'flex', alignItems: 'center', gap: 28}}>
          <div style={{margin: '-56px -44px'}}><Logo s={230} /></div>
          <div>
            <div dir="rtl" style={{fontSize: 56, fontWeight: 700}}>منظومة أكاديمي | Manzooma Excel Masterclass</div>
            <div style={{fontSize: 28, color: C.dim, marginTop: 4}}>Excel From Zero to Professional — Unit 2: Core Formulas & Conditional Logic Engine</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 250, width: 800, ...pop(211.0)}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, padding: '12px 26px', borderRadius: 18, background: 'rgba(16,185,129,.16)', border: `3px solid ${C.green}`, fontSize: 32, fontWeight: 600, direction: 'ltr'}}>
            <span style={{fontSize: 40, color: C.green}}>✓</span>Lesson 08 Completed: Conditional Logic Engine Mastered
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 370, width: 800, ...pop(211.4)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, color: C.dim, direction: 'ltr'}}><span>Unit 2 progress</span><span style={{color: W8, fontWeight: 700}}>{Math.round(prog)}%</span></div>
          <div style={{marginTop: 12, height: 26, borderRadius: 13, background: '#334155', overflow: 'hidden'}}><div style={{width: `${prog}%`, height: 26, borderRadius: 13, background: `linear-gradient(90deg, ${C.green}, ${C.blue})`, boxShadow: `0 0 18px ${C.green}`}} /></div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 500, width: 800, direction: 'ltr'}}>
          {skills.map((s, i) => (
            <div key={s} style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 29, margin: '0 0 22px', ...pop(212.0 + i * 0.7)}}>
              <span style={{width: 40, height: 40, borderRadius: 20, background: C.green, color: '#0F172A', textAlign: 'center', lineHeight: '40px', fontWeight: 700, fontSize: 26}}>✓</span>{s}
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 940, top: 250, width: 760, height: 300, borderRadius: 24, background: 'rgba(15,23,42,.7)', border: `2px solid ${C.blue}`, padding: '30px 40px', boxSizing: 'border-box', direction: 'ltr', ...pop(a.down)}}>
          <div style={{fontSize: 30, color: C.dim}} dir="rtl">الملفات والتدريبات</div>
          <div style={{fontFamily: mono, fontSize: 30, fontWeight: 700, color: C.blue, marginTop: 18}}>{FILE}</div>
          <div style={{fontFamily: mono, fontSize: 36, fontWeight: 700, color: W8, marginTop: 24, padding: '14px 18px', border: `2px dashed ${C.blue}`, borderRadius: 14, boxShadow: `0 0 ${10 + 14 * pls(t, 1.8)}px ${C.blue}55`}}>solutions.gomaaintelligence.me</div>
        </div>
        <div style={{position: 'absolute', left: 940, top: 590, width: 760, height: 280, borderRadius: 24, background: 'rgba(15,23,42,.7)', border: `2px solid ${C.purple}`, padding: '30px 40px', boxSizing: 'border-box', ...pop(a.next - 0.6)}}>
          <div dir="rtl" style={{fontSize: 30, color: C.dim}}>الدرس القادم</div>
          <div dir="rtl" style={{fontSize: 44, fontWeight: 700, marginTop: 14, lineHeight: '62px'}}>الدرس 9: الدوال الشرطية التجميعية للمجموعات</div>
          <div style={{fontSize: 32, color: '#C4B5FD', marginTop: 12, direction: 'ltr', fontWeight: 600}}>SUMIFS · AVERAGEIFS · COUNTIFS →</div>
        </div>
      </div>
      <Hud />
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: out}} />
    </Stage>
  );
};
