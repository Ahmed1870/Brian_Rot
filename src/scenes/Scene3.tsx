import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Editor, Kpi, Stage, TopBadge, Win, clamp, lerp, lin, pop, sec} from '../kit';
import {ORDERS} from '../data';

// SC03 (85-130s): conditional aggregation - SUM(CASE WHEN ...) pivots rows into columns.
// Anchors (s): 86.3 most powerful use | 95.5 instead of total | 100.0 you can write SUM(CASE..) | 108.4 rows -> columns | 116.7 no JOINs | 122.4 monitoring dashboards
const S = START.s3;
const t = (g: number) => sec(g - S);
const RY0 = 56 + 52;
const RH = 58;
const TX = 1080;
const TY = 170;

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  let shipped = 0;
  let cancelled = 0;
  const flights: React.ReactNode[] = [];
  ORDERS.forEach((o, i) => {
    const st = t(100.0 + i * 1.1);
    const p = lin(f, st, 26);
    const ok = o.status === 'shipped';
    if (p >= 1) {
      if (ok) shipped += o.amount;
      else cancelled += o.amount;
    } else if (p > 0) {
      const fx = TX + 520;
      const fy = TY + RY0 + i * RH + 28;
      const tx = 700;
      const ty = ok ? 610 : 750;
      const e = p * p * (3 - 2 * p);
      flights.push(
        <div key={o.id} dir="ltr" style={{position: 'absolute', left: lerp(fx, tx, e) - 60, top: lerp(fy, ty, e) - 24, width: 120, height: 48, borderRadius: 24, background: ok ? C.green : C.amber, color: C.bg, fontFamily: MONO, fontWeight: 700, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 18px ${ok ? C.green : C.amber}`}}>{o.amount}</div>,
      );
    }
  });
  const done = f >= t(100.0 + 5 * 1.1) + 26;
  const fmt = (n: number) => n.toLocaleString('en-US');

  return (
    <Stage dur={1350} inFx="up" outFx="up">
      <TopBadge text="التجميع الشرطي | Conditional Aggregation" from={sec(1)} to={sec(40)} color={C.green} />

      <Editor x={80} y={170} w={950} h={330} title="Query Editor" lines={['SELECT', "  SUM(CASE WHEN order_status = 'shipped'", '      THEN total_amount ELSE 0 END) AS shipped_revenue,', "  SUM(CASE WHEN order_status = 'cancelled'", '      THEN total_amount ELSE 0 END) AS cancelled_revenue', 'FROM orders;']} start={t(95.5)} cps={1.0} size={24} hl={f > t(100) ? 1 : -1} hlColor={C.green} />

      <Win x={TX} y={TY} w={760} h={480} title="orders" opacity={clamp(lin(f, t(86.3), 16))}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: 52, display: 'flex', alignItems: 'center', padding: '0 30px', fontFamily: MONO, fontSize: 24, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 100}}>id</span><span style={{width: 300}}>order_status</span><span>total_amount</span>
        </div>
        {ORDERS.map((o, i) => {
          const sent = f >= t(100.0 + i * 1.1) + 26;
          const col = o.status === 'shipped' ? C.green : C.amber;
          return (
            <div key={o.id} dir="ltr" style={{position: 'absolute', left: 14, right: 14, top: 58 + i * RH, height: RH - 6, borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: MONO, fontSize: 28, color: sent ? '#64748B' : C.text, background: f >= t(100.0 + i * 1.1) && !sent ? `${col}33` : 'transparent'}}>
              <span style={{width: 100}}>{o.id}</span>
              <span style={{width: 300, color: sent ? '#64748B' : col, fontWeight: 700}}>{o.status}</span>
              <span>{o.amount}</span>
            </div>
          );
        })}
      </Win>

      <Kpi x={80} y={560} w={950} h={120} label="shipped_revenue" ar="مبيعات مشحونة" value={fmt(shipped)} color={C.green} p={lin(f, t(98.5), 16)} glow={done ? 1 : 0} />
      <Kpi x={80} y={700} w={950} h={120} label="cancelled_revenue" ar="مبيعات ملغاة" value={fmt(cancelled)} color={C.amber} p={lin(f, t(98.5), 16)} glow={done ? 1 : 0} />
      {flights}

      <div style={{position: 'absolute', left: 1080, top: 700, width: 760, display: 'flex', flexDirection: 'column', gap: 14}}>
        <div style={{opacity: clamp(pop(f, t(108.4)))}}><Chip color={C.blue} style={{fontSize: 26}}>Rows → Horizontal Columns (Pivot)</Chip></div>
        <div style={{opacity: clamp(pop(f, t(116.7)))}}><Chip color={C.green} style={{fontSize: 26}}>✓ one scan · no extra JOINs</Chip></div>
        <div style={{opacity: clamp(pop(f, t(122.4)))}}><Chip color={C.amber} style={{fontSize: 26}}>✓ monitoring dashboards</Chip></div>
      </div>

      <Caption text="SUM(CASE WHEN status = 'shipped' THEN amount ELSE 0 END)" from={t(96)} to={t(108)} />
      <Caption text="Conditional Aggregation ──► Pivots Row Values into Horizontal Metrics" from={t(110)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
