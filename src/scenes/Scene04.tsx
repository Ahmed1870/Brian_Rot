import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, lerp, prog} from '../common';

const CUST = [{id: 1, n: 'أحمد'}, {id: 2, n: 'سارة'}, {id: 3, n: 'منى'}, {id: 4, n: 'كريم'}];
const ORD = [{id: 101, k: 1}, {id: 102, k: 2}, {id: 103, k: 2}, {id: 104, k: 3}];
const RH = 66;

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const H = B.s4.hash, L = B.s4.loop;

  // ---------- HASH JOIN (left) ----------
  const bx = H.x + 30, by = H.y + 120; // build table (customers)
  const hx = H.x + 340, hy = H.y + 120; // hash buckets
  const px = H.x + 640, py = H.y + 120; // probe table (orders)
  const build = (i: number) => ease(prog(f, 40 + i * 50, 100 + i * 50)); // row flies into its bucket
  const probe = (i: number) => prog(f, 270 + i * 40, 320 + i * 40);
  const mem = (CUST.filter((_, i) => build(i) >= 1).length) / 4;

  // ---------- NESTED LOOP (right) ----------
  const lx = L.x + 30, ly = L.y + 120; // outer rows (customers)
  const rootP = {x: L.x + 640, y: L.y + 150};
  const leafP = (k: number) => ({x: L.x + 400 + (k - 1) * 130, y: L.y + 400});
  const T0 = 480; // starts at frame 4351 -> local 450
  const probeStart = (i: number) => T0 + 20 + i * 90;

  return (
    <Scene dur={S.s4.dur} accent={C.amber}>
      <Title ar="كواليس الـ JOIN في PostgreSQL" en="Hash Join vs Nested Loop" chip="SC 04 · ENGINE" accent={C.amber} />

      {/* ============ HASH JOIN ============ */}
      <Card box={H} accent={C.amber} at={6}>
        <div style={{position: 'absolute', left: 30, top: 24, direction: 'ltr'}}><Tag color={C.amber}>HASH JOIN · work_mem</Tag></div>
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 26, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.amber, opacity: prog(f, 330, 380)}}>بيبني هاش للجدول الأصغر، وبعدين يطابق بسرعة</div>
        {/* memory bar */}
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 90, direction: 'ltr'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.dim}}><span>work_mem</span><span>{Math.round(mem * 100)}%</span></div>
          <div style={{height: 18, background: 'rgba(100,116,139,0.35)', borderRadius: 9, marginTop: 6, overflow: 'hidden'}}><div style={{width: `${mem * 100}%`, height: '100%', background: C.amber}} /></div>
        </div>
      </Card>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {/* column headers */}
        <text x={bx + 110} y={by - 14} textAnchor="middle" fontFamily={mono} fontSize={22} fontWeight={700} fill={C.blue} opacity={prog(f, 20, 50)}>customers (small)</text>
        <text x={hx + 110} y={hy - 14} textAnchor="middle" fontFamily={mono} fontSize={22} fontWeight={700} fill={C.amber} opacity={prog(f, 20, 50)}>hash table</text>
        <text x={px + 110} y={py - 14} textAnchor="middle" fontFamily={mono} fontSize={22} fontWeight={700} fill={C.dim} opacity={prog(f, 250, 280)}>orders</text>
        {/* build rows */}
        {CUST.map((c, i) => {
          const t = build(i);
          const tx = hx + 10, ty = hy + (c.id - 1) * RH;
          const x = lerp(bx, tx, t), y = lerp(by + i * RH, ty, t);
          return (
            <g key={'b' + i} opacity={prog(f, 10 + i * 8, 40 + i * 8)}>
              <rect x={bx} y={by + i * RH} width={220} height={RH - 10} rx={12} fill={C.panel2} stroke={C.line} strokeWidth={2} opacity={1 - t * 0.7} />
              <text x={bx + 18} y={by + i * RH + 36} fontFamily={mono} fontSize={22} fontWeight={700} fill={C.blue} opacity={1 - t}>#{c.id}</text>
              <text x={bx + 202} y={by + i * RH + 37} textAnchor="end" fontFamily={cairo} fontSize={26} fontWeight={700} fill={C.text} opacity={1 - t}>{c.n}</text>
              {t > 0 && t < 1 && <rect x={x} y={y} width={220} height={RH - 10} rx={12} fill="rgba(245,158,11,0.35)" stroke={C.amber} strokeWidth={3} />}
            </g>
          );
        })}
        {/* hash buckets */}
        {CUST.map((c, i) => {
          const filled = build(i) >= 1;
          return (
            <g key={'h' + i} opacity={prog(f, 20, 50)}>
              <rect x={hx} y={hy + i * RH} width={220} height={RH - 10} rx={12} fill={filled ? 'rgba(245,158,11,0.20)' : C.panel2} stroke={filled ? C.amber : C.line} strokeWidth={filled ? 4 : 2} strokeDasharray={filled ? undefined : '8 8'} />
              <text x={hx + 18} y={hy + i * RH + 36} fontFamily={mono} fontSize={22} fontWeight={700} fill={C.dim}>h({i + 1})</text>
              {filled && <text x={hx + 202} y={hy + i * RH + 37} textAnchor="end" fontFamily={cairo} fontSize={26} fontWeight={700} fill={C.text}>{c.n}</text>}
            </g>
          );
        })}
        {/* probe rows (orders) + match flashes */}
        {ORD.map((o, i) => {
          const p = probe(i);
          const bucketY = hy + (o.k - 1) * RH + (RH - 10) / 2;
          const rowY = py + i * RH + (RH - 10) / 2;
          return (
            <g key={'p' + i} opacity={prog(f, 250 + i * 10, 280 + i * 10)}>
              <rect x={px} y={py + i * RH} width={200} height={RH - 10} rx={12} fill={p >= 1 ? 'rgba(16,185,129,0.20)' : C.panel2} stroke={p >= 1 ? C.green : C.line} strokeWidth={p >= 1 ? 4 : 2} />
              <text x={px + 18} y={py + i * RH + 36} fontFamily={mono} fontSize={22} fontWeight={700} fill={C.text}>#{o.id}</text>
              <text x={px + 184} y={py + i * RH + 36} textAnchor="end" fontFamily={mono} fontSize={22} fontWeight={700} fill={C.dim}>FK {o.k}</text>
              {p > 0 && p < 1 && <line x1={px} y1={rowY} x2={lerp(px, hx + 220, p)} y2={lerp(rowY, bucketY, p)} stroke={C.green} strokeWidth={5} filter="url(#glow)" />}
              {p >= 1 && <line x1={px} y1={rowY} x2={hx + 220} y2={bucketY} stroke={C.green} strokeWidth={3} opacity={0.5} />}
            </g>
          );
        })}
      </svg>

      {/* ============ NESTED LOOP + INDEX ============ */}
      <Card box={L} accent={C.green} at={T0 - 30}>
        <div style={{position: 'absolute', left: 30, top: 24, direction: 'ltr'}}><Tag color={C.green}>NESTED LOOP · INDEX SCAN</Tag></div>
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 26, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green, opacity: prog(f, T0 + 300, T0 + 350)}}>قفزة مباشرة بالفهرس، من غير ذاكرة هاش</div>
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 90, direction: 'ltr', display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.dim}}><span>hash memory</span><span style={{color: C.green}}>0 MB</span></div>
      </Card>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        <g opacity={prog(f, T0 - 10, T0 + 20)}>
          <text x={lx + 110} y={ly - 14} textAnchor="middle" fontFamily={mono} fontSize={22} fontWeight={700} fill={C.blue}>customers (outer)</text>
          <text x={L.x + 600} y={ly - 14} textAnchor="middle" fontFamily={mono} fontSize={22} fontWeight={700} fill={C.green}>B-Tree on orders.customer_id</text>
          {/* tree edges */}
          {[1, 2, 3, 4].map((k) => {
            const lf = leafP(k);
            const hot = CUST.some((_, i) => i + 1 === k && f >= probeStart(i) && f < probeStart(i) + 70);
            return <line key={'e' + k} x1={rootP.x - 50} y1={rootP.y + 24} x2={lf.x} y2={lf.y - 24} stroke={hot ? C.green : C.line} strokeWidth={hot ? 6 : 3} />;
          })}
          <rect x={rootP.x - 100} y={rootP.y - 24} width={100} height={48} rx={12} fill={C.bg2} stroke={C.line} strokeWidth={3} />
          <text x={rootP.x - 50} y={rootP.y + 9} textAnchor="middle" fontFamily={mono} fontSize={22} fontWeight={700} fill={C.dim}>root</text>
          {[1, 2, 3, 4].map((k) => {
            const lf = leafP(k);
            const hit = CUST.some((_, i) => i + 1 === k && f >= probeStart(i) + 45);
            return (
              <g key={'l' + k} filter={hit ? 'url(#glow)' : undefined}>
                <rect x={lf.x - 50} y={lf.y - 24} width={100} height={48} rx={12} fill={hit ? 'rgba(16,185,129,0.25)' : C.bg2} stroke={hit ? C.green : C.line} strokeWidth={hit ? 5 : 3} />
                <text x={lf.x} y={lf.y + 9} textAnchor="middle" fontFamily={mono} fontSize={22} fontWeight={700} fill={hit ? C.text : C.dim}>k={k}</text>
              </g>
            );
          })}
        </g>
        {/* outer rows */}
        {CUST.map((c, i) => {
          const active = f >= probeStart(i) && f < probeStart(i) + 70;
          const done = f >= probeStart(i) + 70;
          return (
            <g key={'o' + i} opacity={prog(f, T0 - 10 + i * 6, T0 + 20 + i * 6)}>
              <rect x={lx} y={ly + i * RH} width={220} height={RH - 10} rx={12} fill={done ? 'rgba(16,185,129,0.16)' : C.panel2} stroke={active ? C.green : done ? C.green : C.line} strokeWidth={active ? 5 : 2} />
              <text x={lx + 18} y={ly + i * RH + 36} fontFamily={mono} fontSize={22} fontWeight={700} fill={C.blue}>#{c.id}</text>
              <text x={lx + 202} y={ly + i * RH + 37} textAnchor="end" fontFamily={cairo} fontSize={26} fontWeight={700} fill={C.text}>{c.n}</text>
            </g>
          );
        })}
        {/* probe dots: row -> root -> leaf */}
        {CUST.map((c, i) => {
          const t = prog(f, probeStart(i), probeStart(i) + 45);
          if (t <= 0 || t >= 1) return null;
          const a = {x: lx + 220, y: ly + i * RH + (RH - 10) / 2};
          const r = {x: rootP.x - 100, y: rootP.y};
          const lf = leafP(c.id);
          const p = t < 0.4 ? {x: lerp(a.x, r.x, t / 0.4), y: lerp(a.y, r.y, t / 0.4)} : {x: lerp(rootP.x - 50, lf.x, (t - 0.4) / 0.6), y: lerp(rootP.y + 24, lf.y - 24, (t - 0.4) / 0.6)};
          return <circle key={'d' + i} cx={p.x} cy={p.y} r={13} fill={C.text} filter="url(#glow)" />;
        })}
        {/* matched order chips under leaves */}
        {CUST.map((c, i) => {
          const lf = leafP(c.id);
          const o = prog(f, probeStart(i) + 50, probeStart(i) + 75);
          const orders = ORD.filter((x) => x.k === c.id);
          return orders.length ? (
            <g key={'m' + i} opacity={o}>
              {orders.map((od, j) => (
                <g key={od.id}>
                  <rect x={lf.x - 50} y={lf.y + 40 + j * 46} width={100} height={38} rx={10} fill="rgba(16,185,129,0.20)" stroke={C.green} strokeWidth={2} />
                  <text x={lf.x} y={lf.y + 66 + j * 46} textAnchor="middle" fontFamily={mono} fontSize={20} fontWeight={700} fill={C.text}>#{od.id}</text>
                </g>
              ))}
            </g>
          ) : null;
        })}
      </svg>

      <Caption from={60} to={540} color={C.amber}>Hash Join ──► Builds In-Memory Hash Table of Smaller Relation in work_mem</Caption>
      <Caption from={660} to={1080} color={C.green}>Nested Loop with Index ──► Direct Index Probe for Small/Indexed Datasets</Caption>
    </Scene>
  );
};
