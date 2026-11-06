import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC02 (frames 1200-2550, global 40-85s): leftmost prefix rule and Index Only Scan.
const S = 40;
const t = (g: number) => sec(g - S);
const LEAVES = [
  {x: 190, l: 'Jan · paid'},
  {x: 330, l: 'Feb · new'},
  {x: 470, l: 'Jan · paid'},
  {x: 610, l: 'Mar · paid'},
  {x: 750, l: 'Feb · paid'},
  {x: 890, l: 'Mar · new'},
];

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const tree = prog(f, t(41.4), 28);
  const pathA = prog(f, t(52.0), sec(3.4));
  const pathA2 = prog(f, t(55.6), sec(2.6));
  const cardA = pop(f, t(49.9));
  const cardB = pop(f, t(59.2));
  const brk = prog(f, t(60.0), 20);
  const seq = prog(f, t(62.6), sec(3.2));
  const ios = pop(f, t(66.2));
  const zero = pop(f, t(76.0));
  const glow = 0.5 + 0.5 * Math.sin(f / 8);

  return (
    <Stage dur={1350} inFx="zoom" outFx="left">
      <TopBadge text="قاعدة البادئة اليسرى | Leftmost Prefix Rule" from={t(41.4)} to={t(60)} color={C.blue} />

      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <g opacity={tree}>
          <rect x={90} y={170} width={1000} height={470} rx={26} fill={C.card} stroke={C.border} strokeWidth={2} />
          {/* root */}
          <rect x={290} y={200} width={400} height={60} rx={12} fill={C.deep} stroke={C.blue} strokeWidth={3} />
          <text x={490} y={238} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.blue}>branch_id · order_date · status</text>
          {[0, 1, 2].map((k) => (
            <g key={k}>
              <line x1={490} y1={260} x2={260 + k * 280} y2={340} stroke={C.border} strokeWidth={3} />
              <rect x={150 + k * 280} y={340} width={220} height={54} rx={10} fill={C.deep} stroke={k === 2 && pathA > 0.4 ? C.green : C.blue} strokeWidth={3} />
              <text x={260 + k * 280} y={374} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.text}>branch_id = {k + 1}</text>
            </g>
          ))}
          {LEAVES.map((l, i) => {
            const parent = Math.floor(i / 2);
            const hit = i === 5 && pathA2 > 0.5;
            return (
              <g key={i}>
                <line x1={260 + parent * 280} y1={394} x2={l.x + 5} y2={470} stroke={C.border} strokeWidth={2} />
                <rect x={l.x - 60} y={470} width={130} height={50} rx={9} fill={hit ? `${C.green}33` : C.deep} stroke={hit ? C.green : C.blue} strokeWidth={2} />
                <text x={l.x + 5} y={502} textAnchor="middle" fontFamily={MONO} fontSize={17} fill={hit ? C.green : C.muted}>{l.l}</text>
              </g>
            );
          })}
          <text x={110} y={600} fontFamily={MONO} fontSize={20} fill={C.muted}>B-Tree · leaf pages hold (branch_id, order_date, status)</text>
        </g>
        {/* query A: green path */}
        <g opacity={tree}>
          <line x1={490} y1={260} x2={490 + (840 - 490) * pathA} y2={260 + (340 - 260) * pathA} stroke={C.green} strokeWidth={7} strokeLinecap="round" />
          <line x1={840} y1={394} x2={840 + (895 - 840) * pathA2} y2={394 + (470 - 394) * pathA2} stroke={C.green} strokeWidth={7} strokeLinecap="round" opacity={pathA2 > 0 ? 1 : 0} />
          {/* query B: blocked at the root */}
          <line x1={490} y1={260} x2={400} y2={300} stroke={C.red} strokeWidth={6} strokeDasharray="10 8" opacity={brk} />
          <g opacity={brk} stroke={C.red} strokeWidth={8} strokeLinecap="round">
            <line x1={380} y1={286} x2={420} y2={326} />
            <line x1={420} y1={286} x2={380} y2={326} />
          </g>
        </g>
        {/* heap table with sequential scan */}
        <g opacity={tree}>
          <rect x={90} y={670} width={1000} height={200} rx={22} fill={C.card} stroke={seq > 0 && seq < 1 ? C.red : C.border} strokeWidth={2} />
          <text x={120} y={706} fontFamily={MONO} fontSize={20} fill={C.muted}>Heap (table pages)</text>
          {Array.from({length: 16}).map((_, i) => (
            <rect key={i} x={120 + i * 60} y={730} width={50} height={90} rx={8} fill={seq * 16 > i ? `${C.red}33` : C.deep} stroke={seq * 16 > i ? C.red : C.border} strokeWidth={2} />
          ))}
          <rect x={120 + seq * 940} y={722} width={6} height={106} fill={C.red} opacity={seq > 0 && seq < 1 ? 1 : 0} />
        </g>
      </svg>

      {/* query cards */}
      <div dir="ltr" style={{position: 'absolute', left: 1150, top: 170, width: 680, borderRadius: 24, border: `3px solid ${C.green}`, background: C.card, padding: '20px 28px', opacity: clamp(cardA), transform: `scale(${0.92 + 0.08 * clamp(cardA)})`, transformOrigin: 'left top', boxShadow: `0 0 ${22 * glow}px ${C.green}33`}}>
        <Chip color={C.green} style={{fontSize: 22}}>uses the leftmost column ✓</Chip>
        <div style={{fontFamily: MONO, fontSize: 24, color: C.text, marginTop: 14, lineHeight: 1.5}}>WHERE branch_id = 3<br />  AND order_date &gt;= '2025-03-01'</div>
      </div>
      <div dir="ltr" style={{position: 'absolute', left: 1150, top: 400, width: 680, borderRadius: 24, border: `3px solid ${C.red}`, background: C.card, padding: '20px 28px', opacity: clamp(cardB), transform: `scale(${0.92 + 0.08 * clamp(cardB)})`, transformOrigin: 'left top'}}>
        <Chip color={C.red} style={{fontSize: 22}}>skips branch_id ✕</Chip>
        <div style={{fontFamily: MONO, fontSize: 24, color: C.text, marginTop: 14}}>WHERE status = 'paid'</div>
        <div style={{fontFamily: MONO, fontSize: 22, color: C.red, marginTop: 10, opacity: seq}}>→ Sequential Scan fallback</div>
      </div>
      <div dir="ltr" style={{position: 'absolute', left: 1150, top: 640, width: 680, display: 'flex', flexDirection: 'column', gap: 16}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${clamp(ios)})`, opacity: clamp(ios), transformOrigin: 'left center'}}><Check p={clamp(ios)} size={44} /><Chip color={C.blue} style={{fontSize: 24}}>Index Only Scan</Chip></div>
        <div style={{transform: `scale(${clamp(zero)})`, opacity: clamp(zero), transformOrigin: 'left center'}}><Chip color={C.green} style={{fontSize: 24, background: `${C.green}26`}}>Heap reads: 0</Chip></div>
        <div style={{opacity: clamp(zero)}}><Mix style={{fontSize: 26, color: C.muted}}>الأعمدة المطلوبة كلها داخل الفهرس نفسه</Mix></div>
      </div>

      <Caption text="Leftmost Prefix Rule ──► Queries Must Include First Index Column (col1)" from={t(49.9)} to={t(65.4)} />
      <Caption text="Index Only Scan ──► Fetches Data Directly From Index Pages (Zero Heap Reads)" from={t(66.4)} to={t(82)} />
    </Stage>
  );
};
