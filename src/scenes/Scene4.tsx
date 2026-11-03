import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Code, CodeLine} from '../components/Code';
import {Field, SchemaCard} from '../components/Schema';
import {appear, pop} from '../components/Text';
import {back, eo, prog, pulse, seg, typed} from '../lib/anim';

const S = TL.cues.sc04;
const L4 = 145.4;
const L5 = 147.2;
const CODE: CodeLine[] = [
  {text: 'CREATE TABLE orders (', at: S.l1},
  {text: '  order_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,', at: S.l2, dt: 0.03},
  {text: '  customer_id INT NOT NULL,', at: S.l3},
  {text: '  order_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,', at: L4},
  {text: '  total_amount NUMERIC(10,2) CHECK (total_amount >= 0),', at: L5},
  {text: '  CONSTRAINT fk_customer FOREIGN KEY (customer_id)', at: S.l6},
  {text: '    REFERENCES customers(customer_id)', at: S.l7},
  {text: '    ON DELETE RESTRICT', at: S.l8},
  {text: ');', at: S.l9},
];
const PARENT: Field[] = [
  {name: 'customer_id', type: 'INT', at: 133.4, badges: [{kind: 'PK', at: 133.9}]},
  {name: 'first_name', type: 'VARCHAR(50)', at: 133.6, badges: []},
  {name: 'email', type: 'VARCHAR(100)', at: 133.8, badges: [{kind: 'UQ', at: 134.3}]},
];
const CHILD: Field[] = [
  {name: 'order_id', type: 'INT IDENTITY', at: S.l2 + 1.6, badges: [{kind: 'PK', at: S.l2 + 1.9}]},
  {name: 'customer_id', type: 'INT', at: S.l3 + 1.0, badges: [{kind: 'NN', at: S.l3 + 1.3}, {kind: 'FK', at: S.bridge + 2.2}]},
  {name: 'order_date', type: 'TIMESTAMPTZ', at: L4 + 1.3, badges: [{kind: 'DF', at: L4 + 1.8}]},
  {name: 'total_amount', type: 'NUMERIC(10,2)', at: L5 + 1.5, badges: [{kind: 'CK', at: L5 + 1.9}]},
];
const CX = 1290;
const CW = 570;
const PY = 190;
const CY = 520;
const RH = 66;
const P_ROW = PY + 90 + RH + 33 - RH; // customer_id row center (first row)
const C_ROW = CY + 90 + RH + 29; // orders.customer_id center (second row)
const PATH = `M${CX} ${C_ROW} C ${CX - 110} ${C_ROW} ${CX - 110} ${PY + 90 + 29} ${CX} ${PY + 90 + 29}`;

export const Scene4: React.FC<{t: number}> = ({t}) => {
  const enter = appear(t, 133.0, 134.0);
  const draw = eo(prog(t, S.bridge, S.bridge + 2.2));
  const shieldP = back(prog(t, S.shield, S.shield + 0.7));
  const warn = 0.5 + 0.5 * pulse(t, 0.9);
  const lockFlash = Math.sin(prog(t, S.shield, S.shield + 1.0) * Math.PI);
  const q = typed('DELETE FROM customers WHERE customer_id = 1;', t, S.demo[0], 0.04);
  const errP = pop(t, S.demo[0] + 2.2, S.demo[0] + 2.9);
  const flow = (t * 0.5) % 1;

  const tag = (range: number[], head: string, body: string, color: string) => {
    const p = pop(t, range[0], range[0] + 0.8) * (1 - seg(t, range[1] - 0.4, range[1]));
    if (p <= 0.01) return null;
    return (
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 28px', borderRadius: 16, background: `${color}22`, border: `2px solid ${color}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 26, color: C.text, whiteSpace: 'nowrap', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * -40}px)`, boxShadow: `0 0 30px ${color}44`}}>
        <span style={{color}}>{head}</span>
        <span>{body}</span>
      </div>
    );
  };
  // point along the bridge (cubic) for the travelling pulse
  const bz = (u: number, a: number, b: number, c: number, d: number) => (1 - u) ** 3 * a + 3 * (1 - u) ** 2 * u * b + 3 * (1 - u) * u * u * c + u ** 3 * d;
  const bx = bz(flow, CX, CX - 110, CX - 110, CX);
  const by = bz(flow, C_ROW, C_ROW, PY + 90 + 29, PY + 90 + 29);

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}>{tag(S.tag1, 'CONSTRAINT fk_customer', 'FOREIGN KEY (customer_id) REFERENCES customers', D.code)}</div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}>{tag(S.tag2, 'Child Entity Schema', '──► Referential Link with ON DELETE RESTRICT', D.err)}</div>

      <div style={{opacity: enter, transform: `translateY(${(1 - enter) * 40}px)`}}>
        <Code lines={CODE} t={t} x={60} y={190} w={930} h={560} title="02_orders.sql" fontSize={24} lineH={50} />
      </div>

      <SchemaCard t={t} x={CX} y={PY} w={CW} name="customers" ar="الجدول الأب" accent={D.key} fields={PARENT} rowH={RH} at={133.2} glow={16} dim={0.95} />
      <SchemaCard t={t} x={CX} y={CY} w={CW} name="orders" ar="الجدول الابن" accent={D.code} fields={CHILD} rowH={RH} at={S.l1 + 1.0} glow={22} />

      {/* luminous FK bridge */}
      <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', overflow: 'visible'}}>
        <path d={PATH} fill="none" stroke={D.code} strokeWidth="18" strokeLinecap="round" opacity={0.2 + 0.3 * lockFlash} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
        <path d={PATH} fill="none" stroke={D.code} strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} style={{filter: `drop-shadow(0 0 10px ${D.code})`}} />
        {draw > 0.98 ? <circle cx={bx} cy={by} r={9} fill="#fff" style={{filter: `drop-shadow(0 0 12px ${D.code})`}} /> : null}
        <circle cx={CX} cy={C_ROW} r={8} fill={D.code} opacity={draw > 0.02 ? 1 : 0} />
        <circle cx={CX} cy={PY + 90 + 29} r={8} fill={D.key} opacity={draw > 0.97 ? 1 : 0} />
        {draw > 0.98 ? (
          <>
            <text x={CX - 52} y={C_ROW - 14} fontFamily={FONT_MONO} fontWeight="800" fontSize="30" fill={D.code}>∞</text>
            <text x={CX - 46} y={PY + 90 + 8} fontFamily={FONT_MONO} fontWeight="800" fontSize="30" fill={D.key}>1</text>
          </>
        ) : null}
      </svg>

      {/* RESTRICT shield */}
      {shieldP > 0.01 ? (
        <div style={{position: 'absolute', left: CX - 345, top: (C_ROW + PY + 119) / 2 - 62, opacity: Math.min(1, shieldP * 1.5), transform: `scale(${0.5 + 0.5 * shieldP})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 20px 10px 14px', borderRadius: 20, background: 'rgba(127,29,29,0.85)', border: `2.5px solid ${D.err}`, boxShadow: `0 0 ${26 + 26 * warn}px ${D.err}`}}>
            <svg width="54" height="62" viewBox="0 0 86 98" fill="none"><path d="M43 4 L80 18 V48 C80 70 64 86 43 94 C22 86 6 70 6 48 V18 Z" fill={`${D.err}44`} stroke={D.err} strokeWidth="7" strokeLinejoin="round" /><rect x="30" y="40" width="26" height="22" rx="5" fill="#fff" /><path d="M35 40 V34 a8 8 0 0 1 16 0 v6" stroke="#fff" strokeWidth="5" fill="none" /></svg>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 28, color: '#fff'}}>RESTRICT</span>
              <span style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 20, color: '#FECACA', direction: 'rtl'}}>يمنع حذف عميل له طلبات</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* blocked delete demo */}
      {t >= S.demo[0] - 0.2 ? (
        <div style={{position: 'absolute', left: 60, top: 790, width: 1800, opacity: appear(t, S.demo[0] - 0.2, S.demo[0] + 0.3)}}>
          <div style={{height: 64, borderRadius: 16, background: '#0B1222', border: `2px solid ${D.err}55`, display: 'flex', alignItems: 'center', padding: '0 26px', fontFamily: FONT_MONO, fontSize: 26, color: C.text, width: 930}}>
            <span style={{color: C.mute, marginRight: 14}}>postgres=#</span>{q}
          </div>
          {errP > 0.01 ? (
            <div style={{marginTop: 16, padding: '14px 24px', borderRadius: 14, background: 'rgba(127,29,29,0.55)', border: `2px solid ${D.err}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 21, color: '#FECACA', opacity: Math.min(1, errP * 1.5), transform: `translateY(${(1 - errP) * 16}px)`, width: 1580}}>
              ERROR: update or delete on table "customers" violates foreign key constraint "fk_customer" on table "orders"
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
