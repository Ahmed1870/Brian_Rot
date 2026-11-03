import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, pop, prog, sec} from '../kit';

// SC03 (frames 2375-3635, global 79.2-121.2s): the same filter in WHERE (trap) vs inside ON (safe).
const S = 79.17;
const t = (g: number) => sec(g - S);
const RH = 50;
// name, order, date (null = no match), date passes the filter?
const ROWS = [
  {n: 'Ahmed', o: '101', d: '2023-11-05', ok: false},
  {n: 'Ahmed', o: '102', d: '2024-03-10', ok: true},
  {n: 'Sara', o: '103', d: '2024-02-20', ok: true},
  {n: 'Omar', o: 'NULL', d: 'NULL', ok: false},
  {n: 'Mona', o: '104', d: '2023-12-01', ok: false},
  {n: 'Karim', o: 'NULL', d: 'NULL', ok: false},
] as const;

const Row: React.FC<{y: number; r: (typeof ROWS)[number]; color: string; fade: number; toNull?: number; strike?: boolean}> = ({y, r, color, fade, toNull = 0, strike}) => {
  const isNull = r.o === 'NULL' || toNull > 0.5;
  return (
    <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, top: y, height: RH - 6, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 22, color: C.text, borderRadius: 10, background: C.deep, border: `2px solid ${strike ? C.red : color}`, opacity: 1 - fade, transform: `translateX(${fade * 40}px)`, textDecoration: strike ? 'line-through' : 'none'}}>
      <div style={{width: 170, paddingLeft: 12}}>{r.n}</div>
      <div style={{width: 130, color: isNull ? C.amber : C.text, fontWeight: isNull ? 700 : 400}}>{isNull ? 'NULL' : r.o}</div>
      <div style={{color: isNull ? C.amber : C.muted, fontWeight: isNull ? 700 : 400}}>{isNull ? 'NULL' : r.d}</div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const panels = prog(f, t(80.4), 24);
  const buzz = f >= t(80.4) && f < t(82.4) ? Math.sin(f * 2.4) * 5 : 0;

  // SAFE (ON): Ahmed-101 drops out of the join, Mona turns into NULL; every customer stays
  const onFilter = prog(f, t(95.1), 22);
  const onRows = [0, 1, 2, 3, 4, 5].map((i) => (i === 0 ? onFilter : 0));
  const onSafe = pop(f, t(100.9));

  // TRAP (WHERE): rows failing the filter, and all NULL rows, are removed
  const wFilter = prog(f, t(103.8), 18);
  const nullKill = prog(f, t(111.3), 22);
  const wRem = ROWS.map((r, i) => (r.o === 'NULL' ? nullKill : !r.ok ? prog(f, t(103.8) + i * 5, 18) : 0));
  const inner = pop(f, t(113.0));
  const trap = f >= t(113.0) ? Math.sin(f * 2.6) * 4 * (1 - prog(f, t(113.0), sec(2.5))) : 0;
  const loss = pop(f, t(117.5));

  const posL = (i: number) => 46 + (i - wRem.slice(0, i).reduce((a, b) => a + b, 0)) * RH;
  const posR = (i: number) => 46 + (i - onRows.slice(0, i).reduce((a, b) => a + b, 0)) * RH;

  return (
    <Stage dur={1260} inFx="left" outFx="up">
      <TopBadge text="WHERE مقابل ON | الفخ في الـ Outer Joins" from={t(80.6)} to={t(92)} color={C.red} />

      {/* LEFT: trap */}
      <div style={{opacity: panels, transform: `translateX(${buzz}px)`}}>
        <Editor x={90} y={150} w={840} h={220} title="TRAP · WHERE" lines={['FROM customers c LEFT JOIN orders o', '  ON c.customer_id = o.customer_id', "WHERE o.order_date > '2024-01-01';"]} start={t(101.6)} cps={1.2} size={22} accent={C.red} />
        <Win x={90} y={400} w={840} h={500} title={f >= t(113) ? 'result · behaves like INNER JOIN' : 'result'} accent={inner > 0.3 ? C.red : C.border}>
          <div dir="ltr" style={{position: 'relative', padding: '8px 0 0 0', transform: `translateX(${trap}px)`}}>
            <div style={{display: 'flex', fontFamily: MONO, fontSize: 18, color: C.muted, height: 38, alignItems: 'center', borderBottom: `2px solid ${C.border}`, padding: '0 30px'}}>
              <div style={{width: 170}}>customer</div>
              <div style={{width: 130}}>order</div>
              <div>order_date</div>
            </div>
            {ROWS.map((r, i) => (
              <Row key={i} y={posL(i)} r={r} color={C.border} fade={wRem[i]} strike={wRem[i] > 0.05 && wRem[i] < 0.6} />
            ))}
          </div>
          <div style={{position: 'absolute', right: 20, bottom: 14, opacity: clamp(inner), transform: `scale(${clamp(inner)})`, transformOrigin: 'right bottom'}}>
            <Chip color={C.red} style={{fontSize: 24}}>TRAP: LEFT JOIN → INNER JOIN ✕</Chip>
          </div>
        </Win>
      </div>

      {/* RIGHT: safe */}
      <div style={{opacity: panels}}>
        <Editor x={990} y={150} w={840} h={220} title="SAFE · ON ... AND" lines={['FROM customers c LEFT JOIN orders o', '  ON c.customer_id = o.customer_id', "  AND o.order_date > '2024-01-01';"]} start={t(92.4)} cps={1.2} size={22} accent={C.green} />
        <Win x={990} y={400} w={840} h={500} title="result" accent={onSafe > 0.3 ? C.green : C.border}>
          <div dir="ltr" style={{position: 'relative', padding: '8px 0 0 0'}}>
            <div style={{display: 'flex', fontFamily: MONO, fontSize: 18, color: C.muted, height: 38, alignItems: 'center', borderBottom: `2px solid ${C.border}`, padding: '0 30px'}}>
              <div style={{width: 170}}>customer</div>
              <div style={{width: 130}}>order</div>
              <div>order_date</div>
            </div>
            {ROWS.map((r, i) => (
              <Row key={i} y={posR(i)} r={r} color={onFilter > 0.5 && i === 4 ? C.amber : C.border} fade={onRows[i]} toNull={i === 4 ? onFilter : 0} />
            ))}
          </div>
          <div style={{position: 'absolute', right: 20, bottom: 14, opacity: clamp(onSafe), transform: `scale(${clamp(onSafe)})`, transformOrigin: 'right bottom'}}>
            <Chip color={C.green} style={{fontSize: 24}}>5 customers preserved ✓</Chip>
          </div>
        </Win>
      </div>

      <div style={{position: 'absolute', left: 90, width: 840, top: 912, textAlign: 'right', opacity: clamp(loss), pointerEvents: 'none'}} />
      <Caption text="ON ... AND o.date > '2024' ──► Preserves Left Rows & Filters Right Matches" from={t(95)} to={t(101.2)} />
      <Caption text="WHERE o.date > '2024' ──► TRAP: Unintentionally Converts LEFT JOIN to INNER JOIN!" from={t(103)} to={t(119.5)} />
    </Stage>
  );
};
