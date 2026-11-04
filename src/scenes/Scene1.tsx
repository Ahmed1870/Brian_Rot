import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Cell, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {CUSTOMERS, SET_IDS} from '../data';

// SC01 (0-40s): IN with a dynamic array produced by a subquery.
// Anchors (s): 1.1 welcome | 8.7 time has come | 13.0 full array | 18.1 IN takes the array | 21.2 checks existence | 26.8 based on it | 35.6 fetch
const S = START.s1;
const t = (g: number) => sec(g - S);
const ROW0 = 50;
const RH = 62;
const SCAN_FROM = t(18.1);
const SCAN_LEN = sec(7.5);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const scan = lin(f, SCAN_FROM, SCAN_LEN);
  const tableP = clamp(lin(f, t(13.5), 20));
  const scanning = f >= SCAN_FROM && scan < 1;
  const laserY = 236 + ROW0 + scan * CUSTOMERS.length * RH;
  const hits = CUSTOMERS.filter((c) => SET_IDS.includes(c.id));
  const reportP = pop(f, t(26.8));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="الفلترة بالمجموعات | Set Membership Filtering (IN Operator)" from={sec(2)} to={sec(18)} />

      <Editor x={80} y={180} w={800} h={290} title="Query Editor" lines={['SELECT name FROM customers', 'WHERE customer_id IN (', '  SELECT customer_id FROM orders', '  WHERE total_amount > 5000', ');']} start={t(8.7)} cps={0.9} size={28} hl={f > t(18.1) ? 1 : -1} hlColor={C.blue} />

      {/* the dynamic array produced by the subquery */}
      <div style={{position: 'absolute', left: 80, top: 500, width: 800, height: 170, borderRadius: 22, border: `2px dashed ${C.blue}`, background: `${C.blue}0d`, opacity: clamp(lin(f, t(13.0), 16))}}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 22, color: C.blue}}>subquery result → dynamic 1D array</div>
        {SET_IDS.map((v, i) => (
          <Cell key={v} x={34 + i * 188} y={64} w={160} text={String(v)} p={pop(f, t(13.2 + i * 0.35))} />
        ))}
      </div>

      {/* customers table */}
      <Win x={960} y={180} w={880} h={620} title="customers" accent={C.border} opacity={tableP}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 30px', fontFamily: MONO, fontSize: 24, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 180}}>customer_id</span>
          <span>name</span>
        </div>
        {CUSTOMERS.map((c, i) => {
          const inSet = SET_IDS.includes(c.id);
          const hitAt = SCAN_FROM + ((i + 0.5) / CUSTOMERS.length) * SCAN_LEN;
          const passed = f >= hitAt;
          const g = passed && inSet ? clamp(lin(f, hitAt, 10)) : 0;
          const bad = passed && !inSet ? clamp(lin(f, hitAt, 10)) : 0;
          return (
            <div key={c.id} dir="ltr" style={{position: 'absolute', left: 14, right: 14, top: ROW0 + i * RH + 4, height: RH - 8, borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: MONO, fontSize: 30, background: g > 0 ? `${C.green}33` : 'transparent', border: `2px solid ${g > 0 ? C.green : 'transparent'}`, color: bad > 0 ? '#64748B' : C.text}}>
              <span style={{width: 166, fontWeight: 700, color: g > 0 ? C.green : bad > 0 ? '#64748B' : C.blue}}>{c.id}</span>
              <span style={{flex: 1}}>{c.name}</span>
              {g > 0.5 ? <span style={{color: C.green, fontWeight: 700}}>∈ IN ✓</span> : null}
            </div>
          );
        })}
        {scanning ? null : null}
      </Win>
      {scanning ? (
        <div style={{position: 'absolute', left: 970, width: 860, top: laserY, height: 4, background: C.blue, boxShadow: `0 0 24px 6px ${C.blue}aa`, borderRadius: 2}} />
      ) : null}

      {/* report */}
      <div style={{position: 'absolute', left: 80, top: 820, width: 1760, height: 100, opacity: clamp(reportP), transform: `translateY(${(1 - clamp(reportP)) * 30}px)`, borderRadius: 22, background: C.card, border: `2px solid ${C.green}`, display: 'flex', alignItems: 'center', gap: 26, padding: '0 36px'}}>
        <Check p={reportP} size={64} />
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 30, color: C.green, fontWeight: 700, width: 360}}>Report · {hits.length} customers</div>
        {hits.map((c, i) => (
          <div key={c.id} style={{opacity: clamp(pop(f, t(27.4 + i * 0.5))), transform: `scale(${0.8 + 0.2 * clamp(pop(f, t(27.4 + i * 0.5)))})`}}>
            <Chip color={C.green} style={{fontSize: 34, padding: '10px 28px'}}>{c.id} · {c.name}</Chip>
          </div>
        ))}
      </div>
      <Caption text="WHERE customer_id IN (Subquery) ──► Dynamic Array Membership Matching" from={sec(22)} to={sec(38)} />
    </Stage>
  );
};
