import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Check, Chip, Editor, Stage, TopBadge, Win, clamp, pop, prog, sec} from '../kit';

// SC01 (frames 0-1200): AVG() OVER() adds a window metric beside every row - the 10 rows never collapse.
const t = (g: number) => sec(g);
const P = [
  {n: 'Laptop', a: 1200},
  {n: 'Mouse', a: 80},
  {n: 'Keyboard', a: 150},
  {n: 'Monitor', a: 600},
  {n: 'Webcam', a: 220},
  {n: 'Headset', a: 180},
  {n: 'Cable', a: 40},
  {n: 'Chair', a: 450},
  {n: 'Desk', a: 700},
  {n: 'Lamp', a: 130},
];
const AVG = 375;
const RH = 44;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const tbl = prog(f, t(1.6), 26);
  const gb = pop(f, t(8.6)) * (1 - prog(f, t(18.6), 12));
  const win = prog(f, t(19.0), 26);
  const colHead = prog(f, t(28.1), 14);
  const kept = pop(f, t(33.7));
  const glow = 0.5 + 0.5 * Math.sin(f / 8);

  return (
    <Stage dur={1200} inFx="none" outFx="zoom">
      <TopBadge text="الدوال التحليلية والنافذية | Window Functions Core Concepts" from={t(2)} to={t(18)} color={C.blue} />

      <Editor x={90} y={150} w={1250} h={180} title="window_avg.sql" lines={['SELECT product_name, total_amount,', '       AVG(total_amount) OVER() AS window_avg FROM product_sales;']} start={t(23.1)} cps={1.5} size={24} accent={C.blue} />

      <Win x={90} y={360} w={1200} h={540} title="product_sales" accent={C.border} opacity={tbl}>
        <div dir="ltr" style={{position: 'relative', padding: '0 22px'}}>
          <div style={{display: 'flex', height: 40, alignItems: 'center', fontFamily: MONO, fontSize: 20, color: C.muted, borderBottom: `2px solid ${C.border}`}}>
            <div style={{width: 300, paddingLeft: 12}}>product_name</div>
            <div style={{width: 240}}>total_amount</div>
            <div style={{color: C.green, fontWeight: 700, opacity: colHead}}>window_avg</div>
          </div>
          {P.map((r, i) => {
            const g = pop(f, t(28.4) + i * 5);
            return (
              <div key={r.n} style={{display: 'flex', alignItems: 'center', height: RH, fontFamily: MONO, fontSize: 23, color: C.text, borderBottom: `1px solid ${C.border}`, opacity: clamp(tbl * 1.4 - i * 0.04)}}>
                <div style={{width: 300, paddingLeft: 12}}>{r.n}</div>
                <div style={{width: 240}}>{r.a}</div>
                <div style={{color: C.green, fontWeight: 700, opacity: clamp(g), transform: `translateX(${(1 - clamp(g)) * 90}px)`, background: g > 0.5 ? `${C.green}1F` : 'transparent', borderRadius: 8, padding: '0 14px'}}>{AVG.toFixed(2)}</div>
              </div>
            );
          })}
          {/* floating window frame */}
          <div style={{position: 'absolute', left: 4, right: 4, top: 40 - (1 - win) * 90, bottom: 2, borderRadius: 14, border: `3px solid ${C.blue}`, background: `${C.blue}0D`, boxShadow: `0 0 ${26 * glow}px ${C.blue}66`, opacity: win}} />
        </div>
      </Win>

      {/* side panel */}
      <div dir="ltr" style={{position: 'absolute', left: 1340, top: 360, width: 490, display: 'flex', flexDirection: 'column', gap: 20}}>
        <div style={{transform: `scale(${clamp(gb)})`, opacity: clamp(gb), transformOrigin: 'left center', borderRadius: 20, border: `2px solid ${C.red}`, background: `${C.red}14`, padding: '16px 22px'}}>
          <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.red}}>GROUP BY</div>
          <div style={{fontFamily: MONO, fontSize: 24, color: C.text, marginTop: 6}}>10 rows → 1 summary row</div>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginTop: 4}}>row details are lost ✕</div>
        </div>
        <div style={{opacity: win}}><Chip color={C.blue} style={{fontSize: 24}}>OVER() = the window</Chip></div>
        <div style={{transform: `scale(${clamp(kept)})`, opacity: clamp(kept), transformOrigin: 'left center', borderRadius: 22, border: `2px solid ${C.green}`, background: C.card, padding: '18px 26px', boxShadow: `0 0 ${24 * glow * clamp(kept)}px ${C.green}44`}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.muted}}>rows in → rows out</div>
          <div style={{fontFamily: MONO, fontSize: 64, fontWeight: 700, color: C.green, lineHeight: 1.15}}>10 → 10</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 6}}><Check p={clamp(kept)} size={34} /><span style={{fontFamily: MONO, fontSize: 20, color: C.green}}>no collapse</span></div>
        </div>
      </div>

      <Caption text="AVG(amount) OVER() ──► Computes Aggregate Window Metric Without Collapsing Rows" from={t(22.4)} to={t(38)} />
    </Stage>
  );
};
