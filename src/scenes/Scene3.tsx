import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {DDL_ORDER_ITEMS, DDL_STORE_ORDERS} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC03 (85-130s): DDL Scripting & Referential Integrity Constraints
// Editor writes CREATE TABLE store_orders + store_order_items with PK/FK/ON DELETE/CHECK/UNIQUE
// Anchors (scene-local seconds):
//   86.0 CREATE TABLE | 92.0 PK · FK | 100.0 ON DELETE | 105.0 CHECK | 110.0 UNIQUE | 120.0 production-ready
const S = START.s3;
const t = (g: number) => sec(g - S);

interface ConstraintRow {
  name: string;
  type: string;
  action: string;
  table: string;
  color: string;
}

const CONSTRAINTS: ConstraintRow[] = [
  {name: 'pk_orders', type: 'PRIMARY KEY', action: 'identity', table: 'store_orders', color: 'amber'},
  {name: 'fk_orders_customer', type: 'FOREIGN KEY', action: 'ON DELETE RESTRICT', table: 'store_orders → customers', color: 'blue'},
  {name: 'fk_orders_branch', type: 'FOREIGN KEY', action: 'ON DELETE RESTRICT', table: 'store_orders → branches', color: 'blue'},
  {name: 'chk_orders_amount', type: 'CHECK', action: 'total_amount >= 0', table: 'store_orders', color: 'green'},
  {name: 'fk_items_order', type: 'FOREIGN KEY', action: 'ON DELETE CASCADE', table: 'order_items → orders', color: 'purple'},
  {name: 'fk_items_product', type: 'FOREIGN KEY', action: 'ON DELETE RESTRICT', table: 'order_items → products', color: 'blue'},
  {name: 'chk_items_qty', type: 'CHECK', action: 'quantity > 0', table: 'store_order_items', color: 'green'},
  {name: 'uq_customers_email', type: 'UNIQUE', action: 'no duplicates', table: 'store_customers.email', color: 'red'},
];

const colorOf = (k: string) => (k === 'amber' ? C.amber : k === 'blue' ? C.blue : k === 'green' ? C.green : k === 'purple' ? C.purple : C.red);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86), 14));
  const createP = pop(f, t(86));
  const fkP = pop(f, t(100));
  const chkP = pop(f, t(105));
  const uqP = pop(f, t(110));
  const prodP = pop(f, t(120));

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="الصياغة الفيزيائية والقيود البنيوية | DDL · PRIMARY KEY · FOREIGN KEY · CHECK · UNIQUE (Module 16)" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* LEFT: DDL store_orders editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={880}
          h={370}
          title="ddl_store_orders.sql · CREATE TABLE with PK · FK · CHECK (PostgreSQL 16)"
          lines={DDL_STORE_ORDERS}
          start={t(86)}
          cps={0.5}
          size={14}
          accent={C.amber}
          hl={0}
          hlColor={C.amber}
        />
      </div>

      {/* LEFT-BOTTOM: DDL store_order_items editor */}
      <div style={{opacity: clamp(prodP)}}>
        <Editor
          x={80}
          y={555}
          w={880}
          h={330}
          title="ddl_order_items.sql · ON DELETE CASCADE for child rows"
          lines={DDL_ORDER_ITEMS}
          start={t(96)}
          cps={0.5}
          size={14}
          accent={C.purple}
          hl={7}
          hlColor={C.purple}
        />
      </div>

      {/* Concept chips below editors */}
      <div style={{position: 'absolute', left: 80, top: 900, width: 880, opacity: clamp(createP)}}>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>PRIMARY KEY IDENTITY</Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>FOREIGN KEY</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>ON DELETE RESTRICT</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>ON DELETE CASCADE</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>CHECK constraint</Chip>
          <Chip color={C.red} style={{fontSize: 14, padding: '4px 12px'}}>UNIQUE constraint</Chip>
        </div>
      </div>

      {/* RIGHT: Constraints visualization panel */}
      <Win x={980} y={170} w={860} h={730} title="referential integrity engine ──► 8 active constraints · DDL lock" accent={C.green} opacity={clamp(lin(f, t(90), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.green}}>
          Each constraint enforces a business rule · RESTRICT blocks parent deletion · CASCADE propagates to children
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 8}}>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{prodP > 0.5 ? '8 constraints ✓' : '...'}</Chip>
        </div>

        <svg width={820} height={620} style={{position: 'absolute', left: 18, top: 50}}>
          {/* Header row */}
          <rect x={10} y={10} width={800} height={30} fill={`${C.deep}cc`} stroke={C.border} strokeWidth={1} rx={6} />
          <text x={30} y={30} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>#</text>
          <text x={80} y={30} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>CONSTRAINT NAME</text>
          <text x={320} y={30} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>TYPE</text>
          <text x={490} y={30} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>ACTION / RULE</text>
          <text x={730} y={30} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>TABLE</text>

          {/* Constraint rows */}
          {CONSTRAINTS.map((c, i) => {
            const rowP = clamp(pop(f, t(86 + i * 0.8)));
            const color = colorOf(c.color);
            return (
              <g key={i} style={{opacity: clamp(rowP), transform: `translate(${(1 - rowP) * 30}px, 0)`}}>
                <rect x={10} y={50 + i * 50} width={800} height={44} fill={`${color}11`} stroke={color} strokeWidth={1.5} rx={6} />
                <text x={30} y={76 + i * 50} fill={color} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{i + 1}</text>
                <text x={80} y={76 + i * 50} fill={color} fontSize={11} fontFamily={MONO} fontWeight={700}>{c.name}</text>
                <text x={320} y={76 + i * 50} fill={color} fontSize={11} fontFamily={MONO} fontWeight={700}>{c.type}</text>
                <text x={490} y={76 + i * 50} fill={C.text} fontSize={11} fontFamily={MONO}>{c.action}</text>
                <text x={730} y={76 + i * 50} fill={C.muted} fontSize={10} fontFamily={MONO}>{c.table}</text>
                {/* Lock icon */}
                <g transform={`translate(${770}, ${60 + i * 50})`}>
                  <rect x={0} y={5} width={16} height={12} fill={color} rx={2} />
                  <path d="M3 5 V2 a5 5 0 0 1 10 0 V5" fill="none" stroke={color} strokeWidth={1.5} />
                </g>
              </g>
            );
          })}

          {/* Referential action legend */}
          <g style={{opacity: clamp(prodP)}}>
            <rect x={10} y={470} width={800} height={60} fill={`${C.green}11`} stroke={C.green} strokeWidth={2.5} rx={10} />
            <text x={410} y={495} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Referential Action Rules</text>
            <text x={410} y={515} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">RESTRICT = block parent deletion · CASCADE = propagate delete to child rows</text>
          </g>

          {/* Production-ready footer */}
          <g style={{opacity: clamp(prodP)}}>
            <rect x={10} y={555} width={800} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
            <text x={410} y={585} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ DDL Constraints · Sealed · 8 rules enforced · zero violations · production-ready</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>PK · IDENTITY</span>
          <span style={{color: C.purple}}>FK · RESTRICT · CASCADE</span>
          <span style={{color: C.green}}>production-ready ✓</span>
        </div>
      </Win>

      <Caption text="CREATE TABLE ──► PRIMARY KEY ──► FOREIGN KEY ──► ON DELETE RESTRICT/CASCADE ──► CHECK ──► UNIQUE ──► DDL ✓" from={t(95)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
