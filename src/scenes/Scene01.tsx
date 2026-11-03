import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, lerp, prog} from '../common';

const CUST = [
  {id: 1, n: 'أحمد'}, {id: 2, n: 'سارة'}, {id: 3, n: 'منى'}, {id: 4, n: 'كريم'}, {id: 5, n: 'ليلى'},
];
const ORD = [
  {id: 101, fk: '1'}, {id: 102, fk: '2'}, {id: 103, fk: '3'}, {id: 104, fk: 'NULL'}, {id: 105, fk: 'NULL'},
];
const CW = 170, CH = 56;
const CY = 545, R = 270;

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const V = B.s1.venn, D = B.s1.side;
  const cx = V.x + V.w / 2; // 660
  // circles: separated -> overlapping (spring-like ease) from frame 181
  const ov = ease(prog(f, 181, 330));
  const lx = lerp(cx - 300, cx - 170, ov), rx = lerp(cx + 300, cx + 170, ov);
  const merge = ease(prog(f, 330, 480)); // matched chips travel to the intersection
  const fade = prog(f, 430, 540); // unmatched chips fade (amber)
  const pillOn = prog(f, 490, 540);
  const glow = prog(f, 190, 260);

  const chip = (x: number, y: number, label: string, sub: string, color: string, o: number, key: string) => (
    <g key={key} opacity={o}>
      <rect x={x - CW / 2} y={y - CH / 2} width={CW} height={CH} rx={14} fill={C.panel2} stroke={color} strokeWidth={3} />
      <text x={x - CW / 2 + 16} y={y + 8} fontFamily={mono} fontSize={22} fontWeight={700} fill={color}>{sub}</text>
      <text x={x + CW / 2 - 16} y={y + 9} textAnchor="end" fontFamily={cairo} fontSize={26} fontWeight={700} fill={C.text}>{label}</text>
    </g>
  );

  return (
    <Scene dur={S.s1.dur} accent={C.blue}>
      <Title ar="الربط الداخلي" en="INNER JOIN & Relational Intersection" chip="SC 01 · INTERSECTION" accent={C.blue} />

      <Card box={V} accent={C.line} at={4} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        <clipPath id="clipR"><circle cx={rx} cy={CY} r={R} /></clipPath>
        <circle cx={lx} cy={CY} r={R} fill="rgba(56,189,248,0.07)" stroke={C.dim} strokeWidth={4} opacity={prog(f, 10, 40)} />
        <circle cx={rx} cy={CY} r={R} fill="rgba(245,158,11,0.06)" stroke={C.dim} strokeWidth={4} opacity={prog(f, 10, 40)} />
        {/* intersection glow */}
        <g clipPath="url(#clipR)" opacity={glow}>
          <circle cx={lx} cy={CY} r={R} fill="rgba(56,189,248,0.30)" filter="url(#softglow)" />
        </g>
        <circle cx={lx} cy={CY} r={R} fill="none" stroke={C.blue} strokeWidth={5} opacity={glow} />
        <circle cx={rx} cy={CY} r={R} fill="none" stroke={C.blue} strokeWidth={5} opacity={glow} />

        {/* circle titles (above the circles, never over rows) */}
        <text x={lx - 40} y={V.y + 44} textAnchor="middle" fontFamily={mono} fontSize={32} fontWeight={700} fill={C.blue} opacity={prog(f, 20, 50)}>customers</text>
        <text x={rx + 40} y={V.y + 44} textAnchor="middle" fontFamily={mono} fontSize={32} fontWeight={700} fill={C.amber} opacity={prog(f, 20, 50)}>orders</text>

        {/* customers chips */}
        {CUST.map((c, i) => {
          const oy = -170 + i * 85;
          const matched = i < 3;
          const x0 = lx, y0 = CY + oy;
          const tx = cx - 0, ty = CY - 90 + i * 90; // meet point (intersection)
          const x = matched ? lerp(x0, tx - 2, merge) : lerp(x0, x0 - 60, ease(prog(f, 330, 440)));
          const y = matched ? lerp(y0, ty, merge) : y0;
          const o = prog(f, 40 + i * 8, 70 + i * 8) * (matched ? 1 - prog(f, 480, 510) : 1 - fade);
          return chip(x, y, c.n, '#' + c.id, matched ? C.blue : fade > 0 ? C.amber : C.blue, o, 'c' + i);
        })}
        {/* orders chips */}
        {ORD.map((o2, i) => {
          const oy = -170 + i * 85;
          const matched = i < 3;
          const x0 = rx, y0 = CY + oy;
          const tx = cx, ty = CY - 90 + i * 90;
          const x = matched ? lerp(x0, tx + 2, merge) : lerp(x0, x0 + 60, ease(prog(f, 330, 440)));
          const y = matched ? lerp(y0, ty, merge) : y0;
          const o = prog(f, 40 + i * 8, 70 + i * 8) * (matched ? 1 - prog(f, 480, 510) : 1 - fade);
          return chip(x, y, o2.fk === 'NULL' ? 'NULL' : 'FK ' + o2.fk, '#' + o2.id, matched ? C.amber : fade > 0 ? C.amber : C.amber, o, 'o' + i);
        })}
        {/* merged matched pills */}
        {[0, 1, 2].map((i) => {
          const y = CY - 90 + i * 90;
          const o = pillOn * (1 - 0);
          return (
            <g key={'p' + i} opacity={o} transform={`translate(0 ${(1 - ease(pillOn)) * 14})`}>
              <rect x={cx - 100} y={y - 30} width={200} height={60} rx={16} fill="rgba(16,185,129,0.22)" stroke={C.green} strokeWidth={4} filter="url(#glow)" />
              <text x={cx} y={y + 10} textAnchor="middle" fontFamily={mono} fontSize={28} fontWeight={700} fill={C.text}>{CUST[i].id} ⇄ {ORD[i].id}</text>
            </g>
          );
        })}
        {/* PK / FK hint */}
        <text x={cx} y={V.y + V.h - 28} textAnchor="middle" fontFamily={mono} fontSize={26} fontWeight={700} fill={C.green} opacity={prog(f, 560, 600)}>PK = FK</text>
      </svg>

      {/* side: query + result */}
      <Card box={D} accent={C.blue} at={200}>
        <div style={{position: 'absolute', left: 28, right: 28, top: 26, direction: 'ltr', fontFamily: mono, fontWeight: 700, color: C.text, lineHeight: 1.6}}>
          {[
            ['SELECT', ' c.first_name, o.order_id'],
            ['FROM', ' customers c'],
            ['INNER JOIN', ' orders o'],
            ['  ON', ' c.customer_id = o.customer_id;'],
          ].map(([k, v], i) => (
            <div key={i} style={{whiteSpace: 'pre', fontSize: fs('  ON c.customer_id = o.customer_id;', D.w - 56, 26, mono), opacity: prog(f, 210 + i * 14, 240 + i * 14)}}>
              <span style={{color: C.pink}}>{k}</span>{v}
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 28, right: 28, top: 250, direction: 'ltr', opacity: prog(f, 540, 580)}}>
          <Tag color={C.green}>RESULT</Tag>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{marginTop: 12, height: 56, borderRadius: 14, background: 'rgba(16,185,129,0.14)', border: `2px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', opacity: prog(f, 560 + i * 20, 590 + i * 20)}}>
              <span style={{fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.text}}>{CUST[i].n}</span>
              <span style={{fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.green}}>{ORD[i].id}</span>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 28, right: 28, bottom: 28, direction: 'rtl', opacity: prog(f, 700, 750)}}>
          <div style={{fontFamily: cairo, fontWeight: 900, fontSize: 32, color: C.green}}>3 صفوف متطابقة فقط</div>
          <div style={{fontFamily: cairo, fontWeight: 700, fontSize: 26, color: C.amber, marginTop: 6}}>4 صفوف معزولة اتستبعدت</div>
        </div>
      </Card>

      <Caption from={60} to={540} ltr={false} color={C.blue}>الربط الداخلي | INNER JOIN & Relational Intersection</Caption>
      <Caption from={660} to={1140} color={C.green}>INNER JOIN ──► Returns Only Matching Records Between Key Relations</Caption>
    </Scene>
  );
};
