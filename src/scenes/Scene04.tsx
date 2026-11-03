import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, lerp, prog} from '../common';

const IDS = [101, 102, 101, 103, 102, 104, 101, 105, 103, 106, 104, 102]; // 12 orders, 6 distinct
const FIRST = IDS.map((id, i) => IDS.indexOf(id) === i);
const SLOT_OF = (id: number) => [101, 102, 103, 104, 105, 106].indexOf(id);
const T0 = 450, GAP = 55, FLY = 40, FLY2 = 28;
const QUERY = 'SELECT COUNT(DISTINCT customer_id) FROM orders;';

const chipPos = (i: number) => ({x: B.s4.input.x + 34 + (i % 4) * 165 + 75, y: B.s4.input.y + 96 + Math.floor(i / 4) * 100 + 35});
const slotPos = (s: number) => ({x: B.s4.hash.x + 40 + (s % 3) * 190 + 80, y: B.s4.hash.y + 110 + Math.floor(s / 3) * 150 + 60});
const countPos = {x: B.s4.count.x + B.s4.count.w / 2, y: B.s4.count.y + 270};

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const typed = Math.floor(prog(f, 20, 300) * QUERY.length);
  const start = (i: number) => T0 + i * GAP;
  const arrived = (i: number) => f >= start(i) + FLY;
  let uniq = 0, processed = 0;
  const filled: boolean[] = Array(6).fill(false);
  IDS.forEach((id, i) => {
    if (arrived(i)) { processed++; if (FIRST[i]) filled[SLOT_OF(id)] = true; }
    if (FIRST[i] && f >= start(i) + FLY + FLY2) uniq++;
  });
  const mem = filled.filter(Boolean).length / 6;
  const done = f > start(11) + FLY + FLY2;

  return (
    <Scene dur={S.s4.dur} accent={C.amber}>
      <Title ar="COUNT(DISTINCT) في الذاكرة" en="Hash Filter in work_mem" chip="SC 04 · DISTINCT" accent={C.amber} />

      {/* typed query */}
      <Card box={B.s4.code} accent={C.line} at={6}>
        <div style={{position: 'absolute', left: 40, right: 40, top: 0, bottom: 0, display: 'flex', alignItems: 'center', direction: 'ltr', fontFamily: mono, fontWeight: 700, whiteSpace: 'pre', fontSize: fs(QUERY, 1700, 54, mono), color: C.text}}>
          {(() => {
            const parts = [['SELECT', C.pink], [' ', C.text], ['COUNT', C.amber], ['(', C.text], ['DISTINCT', C.pink], [' customer_id)', C.text], [' ', C.text], ['FROM', C.pink], [' orders;', C.text]] as const;
            let used = 0;
            return parts.map(([t, c], i) => {
              const take = Math.max(0, Math.min(t.length, typed - used));
              used += t.length;
              return <span key={i} style={{color: c}}>{t.slice(0, take)}</span>;
            });
          })()}
          {typed < QUERY.length && <span style={{width: 4, height: 54, background: C.amber, marginLeft: 3, opacity: Math.floor(f / 8) % 2}} />}
        </div>
      </Card>

      {/* orders chips */}
      <Card box={B.s4.input} accent={C.line} at={30}>
        <div style={{position: 'absolute', left: 30, top: 24, direction: 'ltr'}}><Tag color={C.dim}>orders.customer_id</Tag></div>
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 24, display: 'flex', justifyContent: 'space-between', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.text}}>
          <span style={{color: C.dim}}>processed</span><span>{processed} / 12</span>
        </div>
      </Card>

      {/* hash table in RAM */}
      <Card box={B.s4.hash} accent={C.amber} at={50}>
        <div style={{position: 'absolute', left: 30, top: 24, direction: 'ltr'}}><Tag color={C.amber}>work_mem · HASH TABLE</Tag></div>
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 34, direction: 'ltr'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 24, fontWeight: 700, color: C.dim}}><span>memory</span><span>{Math.round(mem * 100)}%</span></div>
          <div style={{height: 20, background: 'rgba(100,116,139,0.35)', borderRadius: 10, marginTop: 8, overflow: 'hidden'}}><div style={{width: `${mem * 100}%`, height: '100%', background: C.amber, borderRadius: 10}} /></div>
        </div>
      </Card>

      {/* distinct counter */}
      <Card box={B.s4.count} accent={C.amber} at={70}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 28, textAlign: 'center', direction: 'ltr'}}><Tag color={C.amber}>COUNT(DISTINCT)</Tag></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: mono, fontWeight: 700, fontSize: 200, lineHeight: 1, color: C.amber}}>{uniq}</div>
        <div style={{position: 'absolute', left: 20, right: 20, bottom: 84, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.text}}>عملاء فريدين</div>
        <div style={{position: 'absolute', left: 20, right: 20, bottom: 30, textAlign: 'center', fontFamily: mono, fontWeight: 700, fontSize: 28, color: done ? C.green : C.dim}}>{done ? '12 orders → 6' : '…'}</div>
      </Card>

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {/* chips */}
        {IDS.map((id, i) => {
          const c = chipPos(i), s = start(i);
          const active = f >= s && f < s + FLY;
          const dup = !FIRST[i];
          const doneI = f >= s + FLY;
          return (
            <g key={i} opacity={prog(f, 60 + i * 6, 90 + i * 6)}>
              <rect x={c.x - 75} y={c.y - 35} width={150} height={70} rx={16} fill={doneI ? (dup ? 'rgba(148,163,184,0.10)' : 'rgba(245,158,11,0.16)') : C.panel2} stroke={active ? C.amber : doneI ? (dup ? C.line : C.amber) : C.line} strokeWidth={active ? 5 : 2} />
              <text x={c.x} y={c.y + 11} textAnchor="middle" fontFamily={mono} fontSize={32} fontWeight={700} fill={doneI && dup ? C.dim : C.text}>{id}</text>
            </g>
          );
        })}
        {/* hash slots */}
        {Array.from({length: 6}, (_, s) => {
          const p = slotPos(s), id = [101, 102, 103, 104, 105, 106][s];
          const idx = IDS.indexOf(id);
          const isFilled = filled[s];
          // flash when a duplicate hits this slot
          const flash = IDS.reduce((m, vid, i) => (vid === id && !FIRST[i] && f >= start(i) + FLY ? Math.max(m, 1 - (f - start(i) - FLY) / 25) : m), 0);
          return (
            <g key={s} opacity={prog(f, 70, 100)}>
              <rect x={p.x - 80} y={p.y - 60} width={160} height={120} rx={18} fill={isFilled ? 'rgba(245,158,11,0.18)' : C.panel2} stroke={isFilled ? C.amber : C.line} strokeWidth={isFilled ? 4 : 2} strokeDasharray={isFilled ? undefined : '8 8'} />
              {flash > 0 && <rect x={p.x - 80} y={p.y - 60} width={160} height={120} rx={18} fill={C.red} opacity={flash * 0.45} />}
              <text x={p.x} y={p.y + 14} textAnchor="middle" fontFamily={mono} fontSize={44} fontWeight={700} fill={isFilled ? C.text : C.line}>{isFilled && f >= start(idx) + FLY ? id : '?'}</text>
            </g>
          );
        })}
        {/* flying tokens */}
        {IDS.map((id, i) => {
          const a = chipPos(i), b = slotPos(SLOT_OF(id)), s = start(i);
          const t1 = ease(prog(f, s, s + FLY));
          const x1 = lerp(a.x, b.x, t1), y1 = lerp(a.y, b.y, t1) - Math.sin(t1 * Math.PI) * 50;
          const fly = f >= s && f < s + FLY;
          // duplicates fizzle on the slot
          const fz = !FIRST[i] ? prog(f, s + FLY, s + FLY + 22) : 0;
          // unique: second flight slot -> counter
          const t2 = FIRST[i] ? ease(prog(f, s + FLY, s + FLY + FLY2)) : 0;
          const x2 = lerp(b.x, countPos.x, t2), y2 = lerp(b.y, countPos.y, t2);
          return (
            <g key={i}>
              {fly && <circle cx={x1} cy={y1} r={22} fill={FIRST[i] ? C.amber : C.red} filter="url(#glow)" />}
              {!FIRST[i] && fz > 0 && fz < 1 && (
                <g opacity={1 - fz}>
                  <circle cx={b.x} cy={b.y} r={22 + fz * 50} fill="none" stroke={C.red} strokeWidth={4} />
                  {[0, 1, 2, 3, 4, 5].map((k) => (<circle key={k} cx={b.x + Math.cos(k * 1.05) * fz * 70} cy={b.y + Math.sin(k * 1.05) * fz * 70 - fz * 20} r={5} fill={C.red} />))}
                </g>
              )}
              {FIRST[i] && t2 > 0 && t2 < 1 && <circle cx={x2} cy={y2} r={16} fill={C.amber} filter="url(#glow)" />}
            </g>
          );
        })}
      </svg>

      <Caption from={60} to={540} color={C.amber}>COUNT(DISTINCT customer_id) ──► Eliminates Duplicates</Caption>
      <Caption from={660} to={1080} color={C.amber}>Under the Hood: Builds Hash Table / Sorts in work_mem</Caption>
    </Scene>
  );
};
