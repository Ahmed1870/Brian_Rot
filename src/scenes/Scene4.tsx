import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC04 (frames 3635-4755, global 121.2-158.5s): RIGHT JOIN is the mirror of LEFT JOIN -> standardise on LEFT JOIN.
const S = 121.17;
const t = (g: number) => sec(g - S);
const ROWS = [
  {c: 'Ahmed', o: '101'},
  {c: 'Ahmed', o: '102'},
  {c: 'Sara', o: '103'},
  {c: 'Mona', o: '104'},
  {c: 'NULL', o: '105'},
] as const;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const intro = prog(f, t(122.4), 24);
  const flip = prog(f, t(125.7), sec(2.4));
  const scaleX = lerp(1, -1, flip);
  const right = flip > 0.5;
  const nullFill = pop(f, t(129.4));
  const arrow = prog(f, t(137.2), 24);
  const swap = prog(f, t(151.9), sec(2.2));
  const badge = pop(f, t(154.6));
  const mirrorLine = prog(f, t(125.0), 20);

  return (
    <Stage dur={1120} inFx="up" outFx="zoom">
      <TopBadge text="الربط اليميني | RIGHT JOIN = Mirror of LEFT JOIN" from={t(122.4)} to={t(136)} color={C.blue} />

      {/* code: RIGHT JOIN -> refactored LEFT JOIN */}
      <div style={{opacity: 1 - swap}}>
        <Editor x={90} y={150} w={1740} h={150} title="before.sql" lines={['SELECT * FROM customers c RIGHT JOIN orders o ON c.customer_id = o.customer_id;']} start={t(125.0)} cps={1.7} size={28} accent={C.amber} />
      </div>
      <div style={{opacity: swap, position: 'absolute', inset: 0}}>
        <Editor x={90} y={150} w={1740} h={150} title="after.sql · clean code" lines={['SELECT * FROM orders o LEFT JOIN customers c ON o.customer_id = c.customer_id;']} start={t(152.4)} cps={1.7} size={28} accent={C.green} />
      </div>

      {/* reading direction */}
      <div dir="ltr" style={{position: 'absolute', left: 90, top: 318, display: 'flex', alignItems: 'center', gap: 16, opacity: arrow}}>
        <svg width={220} height={30} viewBox="0 0 220 30"><path d="M4 15 H200 M184 4 L204 15 L184 26" fill="none" stroke={C.amber} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span style={{fontFamily: MONO, fontSize: 24, color: C.amber}}>read left → right: one direction</span>
      </div>

      {/* mirror Venn */}
      <div style={{position: 'absolute', left: 90, top: 400, width: 820, height: 500, opacity: intro}}>
        <svg width={820} height={500}>
          <line x1={410} y1={20} x2={410} y2={480} stroke={C.border} strokeWidth={3} strokeDasharray="8 8" opacity={mirrorLine} />
          <g transform={`translate(410 0) scale(${scaleX} 1) translate(-410 0)`}>
            <circle cx={300} cy={250} r={170} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={5} />
            <circle cx={520} cy={250} r={170} fill="none" stroke={C.muted} strokeWidth={4} />
          </g>
          <circle cx={right ? 520 : 300} cy={250} r={0} fill="none" />
          <text x={right ? 650 : 160} y={256} textAnchor="middle" fontFamily={MONO} fontSize={30} fill={C.text}>{right ? 'orders' : 'customers'}</text>
          <text x={right ? 160 : 650} y={256} textAnchor="middle" fontFamily={MONO} fontSize={30} fill={C.muted}>{right ? 'customers' : 'orders'}</text>
          <text x={410} y={470} textAnchor="middle" fontFamily={MONO} fontSize={28} fontWeight={700} fill={right ? C.green : C.blue}>{right ? 'RIGHT JOIN' : 'LEFT JOIN'}</text>
        </svg>
        <div dir="ltr" style={{position: 'absolute', left: right ? 580 : 40, top: 20}}>
          <Chip color={right ? C.green : C.blue} style={{fontSize: 22}}>preserved ✓</Chip>
        </div>
      </div>

      {/* RIGHT JOIN result with NULL padding on the LEFT side */}
      <Win x={960} y={400} w={870} h={430} title="RIGHT JOIN result" accent={right ? C.green : C.border} opacity={intro}>
        <div dir="ltr" style={{padding: '10px 24px', fontFamily: MONO}}>
          <div style={{display: 'flex', fontSize: 19, color: C.muted, height: 38, alignItems: 'center', borderBottom: `2px solid ${C.border}`}}>
            <div style={{width: 300}}>customers.name</div>
            <div>orders.order_id</div>
          </div>
          {ROWS.map((r, i) => {
            const isNull = r.c === 'NULL';
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', height: 56, marginTop: 6, borderRadius: 10, border: `2px solid ${isNull && right ? C.amber : right ? C.green : C.border}`, background: C.deep, fontSize: 24, color: C.text, padding: '0 14px', opacity: right ? 1 : 0.45}}>
                <div style={{width: 300 - 28, color: isNull ? C.amber : C.text, fontWeight: isNull ? 700 : 400, background: isNull && nullFill > 0.2 ? `${C.amber}33` : 'transparent', borderRadius: 8, paddingLeft: 10, height: 40, lineHeight: '40px'}}>{isNull ? (nullFill > 0.2 ? 'NULL' : '') : r.c}</div>
                <div style={{paddingLeft: 28}}>{r.o}</div>
              </div>
            );
          })}
        </div>
      </Win>

      <div style={{position: 'absolute', left: 960, top: 850, width: 870, display: 'flex', gap: 18, opacity: clamp(badge), transform: `scale(${0.9 + 0.1 * clamp(badge)})`, transformOrigin: 'left center'}}>
        <Chip color={C.amber} style={{fontSize: 26, background: `${C.amber}33`}}>Clean Code Standard ★</Chip>
        <Mix style={{fontSize: 30, color: C.text}}>LEFT JOIN فقط — أناقة واستقرار</Mix>
      </div>

      <Caption text="RIGHT JOIN ──► Mirror Opposite of LEFT JOIN (Preserves Right Table)" from={t(123)} to={t(136)} />
      <Caption text="Clean Code Best Practice ──► Standardize on LEFT JOIN for Readable Query Flow" from={t(137)} to={t(157)} />
    </Stage>
  );
};
