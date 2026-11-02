import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC02 (frames 1230-2390, global 41.0-79.7s): single & bulk INSERT, DEFAULT / IDENTITY auto-fill.
const S = 41.0;
const t = (g: number) => sec(g - S);

const CODE = [
  'INSERT INTO customers',
  '  (first_name, last_name, email)',
  'VALUES',
  "  ('أحمد', 'علي', 'ahmed@example.com'),",
  "  ('سارة', 'محمود', 'sara@example.com'),",
  "  ('عمر', 'حسن', 'omar@example.com');",
];
const ROWS = [
  {id: 1, fn: 'أحمد', ln: 'علي', em: 'ahmed@example.com', ts: '2025-06-01 09:30:12', g: 52.0},
  {id: 2, fn: 'سارة', ln: 'محمود', em: 'sara@example.com', ts: '2025-06-01 09:30:12', g: 53.8},
  {id: 3, fn: 'عمر', ln: 'حسن', em: 'omar@example.com', ts: '2025-06-01 09:30:12', g: 55.4},
];
const COLS = [
  {k: 'customer_id', w: 150},
  {k: 'first_name', w: 150},
  {k: 'last_name', w: 140},
  {k: 'email', w: 250},
  {k: 'created_at', w: 230},
];

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const tbl = prog(f, t(50.9), 24);
  const idGlow = prog(f, t(62.5), 20);
  const tsGlow = prog(f, t(64.8), 20);
  const statusChip = pop(f, t(67.6));
  const trips = prog(f, t(50.9), 24);
  const saved = prog(f, t(71.4), 30);
  const pct = Math.round(lerp(0, 70, prog(f, t(71.6), sec(2.2))));

  return (
    <Stage dur={1160} inFx="zoom" outFx="left">
      <TopBadge text="INSERT INTO · الإدخال المفرد والمتعدد" from={t(42.6)} to={t(58)} color={C.blue} />

      <Editor x={90} y={170} w={800} h={340} title="customers_insert.sql" lines={CODE} start={t(42.6)} cps={1.5} size={23} accent={C.blue} />

      {/* roundtrip comparison */}
      <Win x={90} y={550} w={800} h={340} title="Network Roundtrips" accent={C.border} opacity={trips}>
        <div dir="ltr" style={{position: 'absolute', inset: 0, padding: '26px 30px', fontFamily: MONO, color: C.text}}>
          <div style={{fontSize: 22, color: C.muted}}>3 × single INSERT</div>
          <div style={{display: 'flex', gap: 14, marginTop: 10, alignItems: 'center'}}>
            {[0, 1, 2].map((i) => (
              <svg key={i} width={80} height={36} viewBox="0 0 80 36"><path d="M4 18 H68 M54 6 L68 18 L54 30" fill="none" stroke={C.amber} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
            ))}
            <span style={{fontSize: 24, color: C.amber, fontWeight: 700}}>3 roundtrips</span>
          </div>
          <div style={{fontSize: 22, color: C.muted, marginTop: 26}}>1 × Bulk INSERT</div>
          <div style={{display: 'flex', gap: 14, marginTop: 10, alignItems: 'center'}}>
            <svg width={80} height={36} viewBox="0 0 80 36"><path d="M4 18 H68 M54 6 L68 18 L54 30" fill="none" stroke={C.green} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{fontSize: 24, color: C.green, fontWeight: 700}}>1 roundtrip</span>
          </div>
          <div style={{position: 'absolute', right: 30, bottom: 22, textAlign: 'right', opacity: saved, transform: `scale(${0.9 + 0.1 * saved})`, transformOrigin: 'right bottom'}}>
            <span style={{fontSize: 96, fontWeight: 700, color: C.green, lineHeight: 1}}>−{pct}%+</span>
            <div style={{fontSize: 20, color: C.muted}}>processing time & network effort</div>
          </div>
        </div>
      </Win>

      {/* customers table */}
      <Win x={940} y={170} w={900} h={460} title="customers" accent={C.green} opacity={prog(f, t(46.8), 22)}>
        <div dir="ltr" style={{padding: '20px 10px 0 10px'}}>
          <div style={{display: 'flex', fontFamily: MONO, fontSize: 19, color: C.muted, borderBottom: `2px solid ${C.border}`, paddingBottom: 12}}>
            {COLS.map((c) => (
              <div key={c.k} style={{width: c.w, paddingLeft: 10, color: c.k === 'customer_id' || c.k === 'created_at' ? C.green : C.muted, fontWeight: c.k === 'customer_id' || c.k === 'created_at' ? 700 : 400}}>{c.k}</div>
            ))}
          </div>
          {ROWS.map((r) => {
            const p = pop(f, t(r.g));
            return (
              <div key={r.id} style={{display: 'flex', alignItems: 'center', height: 76, fontFamily: MONO, fontSize: 22, color: C.text, borderBottom: `1px solid ${C.border}`, transform: `translateX(${(1 - clamp(p)) * -300}px)`, opacity: clamp(p)}}>
                <div style={{width: 150, paddingLeft: 10, color: C.green, fontWeight: 700, background: `rgba(16,185,129,${0.2 * idGlow})`, borderRadius: 8, height: 50, lineHeight: '50px'}}>{idGlow > 0.2 ? r.id : '—'}</div>
                <div style={{width: 150, paddingLeft: 10}}><Mix>{r.fn}</Mix></div>
                <div style={{width: 140, paddingLeft: 10}}><Mix>{r.ln}</Mix></div>
                <div style={{width: 250, paddingLeft: 10, fontSize: 19}}>{r.em}</div>
                <div style={{width: 230, paddingLeft: 10, fontSize: 19, color: C.green, background: `rgba(16,185,129,${0.2 * tsGlow})`, borderRadius: 8, height: 50, lineHeight: '50px'}}>{tsGlow > 0.2 ? r.ts : 'NULL'}</div>
              </div>
            );
          })}
        </div>
      </Win>

      {/* DEFAULT / IDENTITY explainers */}
      <div dir="ltr" style={{position: 'absolute', left: 940, top: 670, width: 900, display: 'flex', gap: 18, flexWrap: 'wrap'}}>
        {[
          {n: 'customer_id → IDENTITY', c: C.green, p: idGlow},
          {n: 'created_at → DEFAULT now()', c: C.green, p: tsGlow},
        ].map((x) => (
          <div key={x.n} style={{opacity: x.p, transform: `translateY(${(1 - x.p) * 16}px)`}}>
            <Chip color={x.c} style={{fontSize: 26, padding: '8px 22px'}}>{x.n}</Chip>
          </div>
        ))}
        <div style={{transform: `scale(${statusChip})`, opacity: clamp(statusChip), transformOrigin: 'left center'}}>
          <Chip color={C.blue} style={{fontSize: 26, padding: '8px 22px'}}>order_status → DEFAULT 'pending'</Chip>
        </div>
      </div>

      <Caption text="INSERT INTO customers (first_name, email) VALUES ..." from={t(42.4)} to={t(58.5)} />
      <Caption text="Bulk Insert ──► Single Roundtrip for Multiple Rows" from={t(62)} to={t(78)} />
    </Stage>
  );
};
