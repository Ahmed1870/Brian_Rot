import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Editor, Mix, Stage, TopBadge, clamp, lerp, lin, pop, sec} from '../kit';

// SC01 (0-40s): CASE WHEN as a decision tree; Simple vs Searched CASE.
// Anchors (s): 1.2 welcome | 7.6 raw data needs logic | 16.5 the tool | 20.6 CASE WHEN = IF-THEN-ELSE | 23.5 evaluates | 27.2 first match | 30.9 syntax | 34.3 Searched CASE
const S = START.s1;
const t = (g: number) => sec(g - S);

type Pt = [number, number];
const D1: Pt = [1290, 300];
const D2: Pt = [1290, 470];
const D3: Pt = [1290, 640];
const IN: Pt = [1010, 300];
const LEAF = {gold: [1690, 300], silver: [1690, 470], bronze: [1690, 640]} as Record<string, Pt>;
const ROUTES: Record<string, Pt[]> = {
  gold: [IN, D1, LEAF.gold],
  silver: [IN, D1, D2, LEAF.silver],
  bronze: [IN, D1, D2, D3, LEAF.bronze],
};
const COL: Record<string, string> = {gold: C.green, silver: C.amber, bronze: C.bronze};
const FLOWS = [
  {v: 12500, tier: 'gold', at: 20.6},
  {v: 7200, tier: 'silver', at: 27.2},
  {v: 3100, tier: 'bronze', at: 31.0},
];

function along(pts: Pt[], p: number): Pt {
  const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  let d = p * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) {
      const k = segs[i] === 0 ? 1 : Math.min(1, d / segs[i]);
      return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)];
    }
    d -= segs[i];
  }
  return pts[pts.length - 1];
}

const Node: React.FC<{c: Pt; w?: number; label: string; color: string; p: number; glow?: number}> = ({c, w = 280, label, color, p, glow = 0}) => (
  <div dir="ltr" style={{position: 'absolute', left: c[0] - w / 2, top: c[1] - 34, width: w, height: 68, borderRadius: 16, border: `3px solid ${color}`, background: `linear-gradient(${color}${glow > 0.3 ? '33' : '14'}, ${color}${glow > 0.3 ? '33' : '14'}), ${C.card}`, color: C.text, fontFamily: MONO, fontSize: 22, fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: clamp(p), transform: `scale(${0.85 + 0.15 * clamp(p)})`, boxShadow: glow > 0.3 ? `0 0 ${28 * glow}px ${color}` : 'none'}}>
    {label}
  </div>
);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const tree = clamp(lin(f, t(7.6), 40));
  const nodeP = clamp(lin(f, t(8.5), 20));
  const arrived = (k: string) => {
    const fl = FLOWS.find((x) => x.tier === k)!;
    return clamp(lin(f, t(fl.at) + 70, 12));
  };

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="التحليل الشرطي المنطقي | Conditional Expressions (CASE WHEN)" from={sec(2)} to={sec(18)} color={C.blue} />

      <Editor x={80} y={180} w={860} h={330} title="Query Editor" lines={['CASE', "  WHEN total_spent > 10000 THEN 'Gold'", "  WHEN total_spent > 5000 THEN 'Silver'", "  ELSE 'Bronze'", 'END AS tier']} start={t(16.5)} cps={0.9} size={28} hl={f > t(20.6) ? 1 : -1} hlColor={C.green} />

      {/* decision tree */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {[
          [IN, D1], [D1, LEAF.gold], [D1, D2], [D2, LEAF.silver], [D2, D3], [D3, LEAF.bronze],
        ].map(([a, b], i) => (
          <line key={i} x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * tree} y2={a[1] + (b[1] - a[1]) * tree} stroke={C.blue} strokeWidth={4} strokeLinecap="round" opacity={0.9} />
        ))}
        <text x={1490} y={290} fill={C.green} fontSize={22} fontFamily={MONO} fontWeight={700} opacity={tree}>YES</text>
        <text x={1490} y={460} fill={C.amber} fontSize={22} fontFamily={MONO} fontWeight={700} opacity={tree}>YES</text>
        <text x={1304} y={394} fill={C.muted} fontSize={22} fontFamily={MONO} opacity={tree}>NO</text>
        <text x={1304} y={564} fill={C.muted} fontSize={22} fontFamily={MONO} opacity={tree}>NO / ELSE</text>
      </svg>
      <Node c={D1} label="total_spent > 10000 ?" color={C.blue} p={nodeP} glow={f > t(20.6) + 40 && f < t(20.6) + 75 ? 1 : 0} />
      <Node c={D2} label="total_spent > 5000 ?" color={C.blue} p={nodeP} glow={f > t(27.2) + 55 && f < t(27.2) + 90 ? 1 : 0} />
      <Node c={D3} label="ELSE" color={C.blue} p={nodeP} />
      <Node c={LEAF.gold} w={200} label="Gold" color={C.green} p={nodeP} glow={arrived('gold')} />
      <Node c={LEAF.silver} w={200} label="Silver" color={C.amber} p={nodeP} glow={arrived('silver')} />
      <Node c={LEAF.bronze} w={200} label="Bronze" color={C.bronze} p={nodeP} glow={arrived('bronze')} />
      <div dir="ltr" style={{position: 'absolute', left: 960, top: 214, fontFamily: MONO, fontSize: 22, color: C.blue, opacity: tree}}>row stream →</div>

      {FLOWS.map((fl) => {
        const p = lin(f, t(fl.at), 70);
        if (p <= 0 || p >= 1) return null;
        const [x, y] = along(ROUTES[fl.tier], p);
        return (
          <div key={fl.v} dir="ltr" style={{position: 'absolute', left: x - 56, top: y - 24, width: 112, height: 48, borderRadius: 24, background: C.text, color: C.bg, fontFamily: MONO, fontWeight: 700, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${C.blue}`}}>{fl.v}</div>
        );
      })}

      {/* Simple vs Searched */}
      {[
        {x: 80, at: 30.9, title: 'Simple CASE', sub: 'مقارنة تناظرية بقيمة', code: "CASE status WHEN 'paid' THEN ...", col: C.muted},
        {x: 980, at: 34.3, title: 'Searched CASE', sub: 'شروط مركبة مفتوحة', code: 'CASE WHEN total_spent > 10000 THEN ...', col: C.green},
      ].map((c) => {
        const p = clamp(pop(f, t(c.at)));
        return (
          <div key={c.title} style={{boxSizing: 'border-box', position: 'absolute', left: c.x, top: 745, width: 860, height: 150, borderRadius: 22, border: `3px solid ${c.col}`, background: `${c.col}12`, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, padding: '16px 30px', boxShadow: c.col === C.green ? `0 0 26px ${C.green}44` : 'none'}}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
              <span dir="ltr" style={{fontFamily: MONO, fontSize: 36, fontWeight: 700, color: c.col === C.green ? C.green : C.text}}>{c.title}</span>
              <Mix style={{fontSize: 24, color: C.muted}}>{c.sub}</Mix>
            </div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 25, color: C.text, marginTop: 14, whiteSpace: 'nowrap'}}>{c.code}</div>
          </div>
        );
      })}
      <Caption text="Searched CASE WHEN condition THEN result ──► IF-THEN-ELSE SQL Logic" from={sec(22)} to={sec(38)} />
    </Stage>
  );
};
