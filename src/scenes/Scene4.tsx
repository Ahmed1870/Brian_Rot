import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, pop, prog, sec} from '../kit';

// SC04 (frames 3900-5100, global 130-170s): the multi-row exception and the two safe fixes (aggregate or LIMIT 1).
const S = 130;
const t = (g: number) => sec(g - S);
const CAT2 = [12, 25, 40, 55, 68];

const FixCard: React.FC<{x: number; title: string; code: string; value: string; color: string; p: number}> = ({x, title, code, value, color, p}) => (
  <div dir="ltr" style={{position: 'absolute', left: x, top: 440, width: 560, height: 440, borderRadius: 24, background: C.card, border: `3px solid ${color}`, opacity: clamp(p), transform: `translateY(${(1 - clamp(p)) * 40}px) scale(${0.94 + 0.06 * clamp(p)})`, boxShadow: `0 0 ${30 * clamp(p)}px ${color}33`}}>
    <div style={{padding: '24px 30px'}}>
      <Chip color={color} style={{fontSize: 28}}>{title}</Chip>
      <div style={{marginTop: 22, background: C.deep, borderRadius: 14, padding: '16px 18px', fontFamily: MONO, fontSize: 21, color: C.text, minHeight: 110, lineHeight: 1.6}}>{code}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 26}}>
        <div style={{padding: '12px 30px', borderRadius: 14, border: `3px solid ${C.green}`, background: `${C.green}22`, fontFamily: MONO, fontSize: 44, fontWeight: 700, color: C.green}}>{value}</div>
        <Check p={clamp(p)} size={54} />
      </div>
      <div style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginTop: 14}}>1 row × 1 column ✓</div>
    </div>
  </div>
);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const aOut = 1 - prog(f, t(153.6), 14);
  const shake = f >= t(144.6) && f < t(148.6) ? Math.sin(f * 2.6) * 7 * (1 - prog(f, t(144.6), sec(4))) : 0;
  const err = pop(f, t(147.0));
  const inner = prog(f, t(140.0), 20);
  const fixIn = prog(f, t(155.2), 20);
  const bOn = prog(f, t(156.6), 16);
  const c1 = pop(f, t(157.8));
  const c2 = pop(f, t(160.6));
  const c3 = pop(f, t(165.0));

  return (
    <Stage dur={1200} inFx="up" outFx="zoom">
      <TopBadge text="الخطأ الكارثي | Multi-Row Subquery Exception" from={t(131.4)} to={t(150)} color={C.red} />

      {/* broken query */}
      <div style={{opacity: aOut, transform: `translateX(${shake}px)`}}>
        <Editor x={90} y={150} w={1160} h={250} title="broken.sql" lines={['SELECT product_name FROM products', 'WHERE unit_price =', '  (SELECT unit_price FROM products WHERE category_id = 2);']} start={t(131.6)} cps={1.2} size={24} accent={C.red} />

        <Win x={90} y={430} w={520} h={470} title="inner subquery result" accent={C.red} opacity={inner}>
          <div dir="ltr" style={{padding: '14px 22px', fontFamily: MONO, fontSize: 26, color: C.text}}>
            {CAT2.map((p, i) => {
              const a = pop(f, t(140.0) + i * 8);
              return (
                <div key={i} style={{height: 52, marginBottom: 8, borderRadius: 10, border: `2px solid ${C.red}`, background: `${C.red}14`, display: 'flex', alignItems: 'center', padding: '0 18px', opacity: clamp(a), transform: `translateX(${(1 - clamp(a)) * -60}px)`}}>{p}</div>
              );
            })}
            <div style={{marginTop: 12, fontSize: 22, color: C.red}}>5 rows × 1 col ✕ (expected 1 × 1)</div>
          </div>
        </Win>

        <div style={{position: 'absolute', left: 660, top: 430, width: 1170, height: 330, borderRadius: 26, background: `${C.red}1A`, border: `4px solid ${C.red}`, boxShadow: `0 0 ${50 * clamp(err)}px ${C.red}66`, opacity: clamp(err), transform: `scale(${0.7 + 0.3 * clamp(err)})`}}>
          <div dir="ltr" style={{padding: '34px 44px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <svg width={80} height={72} viewBox="0 0 70 64"><path d="M35 4 L66 58 H4 Z" fill="none" stroke={C.red} strokeWidth={6} strokeLinejoin="round" /><line x1={35} y1={24} x2={35} y2={40} stroke={C.red} strokeWidth={6} strokeLinecap="round" /><circle cx={35} cy={50} r={3.5} fill={C.red} /></svg>
              <span style={{fontFamily: MONO, fontSize: 40, fontWeight: 700, color: C.red}}>ERROR</span>
            </div>
            <div style={{fontFamily: MONO, fontSize: 31, color: C.text, marginTop: 22, lineHeight: 1.5}}>more than one row returned by a subquery used as an expression</div>
            <Mix style={{display: 'block', fontSize: 32, color: C.muted, marginTop: 18}}>المحرك يرفض التنفيذ فوراً</Mix>
          </div>
        </div>
      </div>

      {/* safe fixes */}
      <div style={{opacity: fixIn}}>
        <Editor x={90} y={150} w={1160} h={250} title="safe.sql" lines={['SELECT product_name FROM products', 'WHERE unit_price =', '  (SELECT MAX(unit_price) FROM products WHERE category_id = 2);']} start={t(156.8)} cps={1.4} size={24} accent={C.green} opacity={bOn} />
        <FixCard x={90} title="AVG()" code={'SELECT AVG(unit_price)\nFROM products WHERE category_id = 2'} value="$40.00" color={C.green} p={c1} />
        <FixCard x={680} title="MAX()" code={'SELECT MAX(unit_price)\nFROM products WHERE category_id = 2'} value="$68.00" color={C.blue} p={c2} />
        <FixCard x={1270} title="LIMIT 1" code={'SELECT unit_price FROM products\nWHERE category_id = 2\nORDER BY unit_price LIMIT 1'} value="$12.00" color={C.amber} p={c3} />
      </div>

      <Caption text="ERROR: more than one row returned by a subquery used as an expression" from={t(147.4)} to={t(153.4)} />
      <Caption text="Safety Rule: Use Aggregate Functions (AVG, MAX) or LIMIT 1" from={t(156.2)} to={t(168.6)} />
    </Stage>
  );
};
