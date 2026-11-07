import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {CAPSTONE_DEPLOY_CODE, CAPSTONE_VERIFICATION} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC05 (170-210s): Enterprise Capstone Deployment — manzooma_store_v2_schema.sql (15 tables)
// Module 16 Capstone Launch Seal (25% module progress)
// Anchors (scene-local seconds):
//   171.0 manzooma_store_v2 | 175.0 schema deploy | 180.0 15 tables | 190.0 zero violations | 200.0 Module 16 capstone seal
const S = START.s5;
const t = (g: number) => sec(g - S);

// 15-table list (capstone)
const TABLES_15 = [
  {name: 'store_customers', color: 'blue', icon: 'C'},
  {name: 'store_branches', color: 'green', icon: 'B'},
  {name: 'store_products', color: 'amber', icon: 'P'},
  {name: 'store_orders', color: 'purple', icon: 'O'},
  {name: 'store_order_items', color: 'red', icon: 'I'},
  {name: 'store_inventory', color: 'blue', icon: 'V'},
  {name: 'store_audit_logs', color: 'purple', icon: 'A'},
  {name: 'store_payments', color: 'green', icon: 'Y'},
  {name: 'store_shipments', color: 'amber', icon: 'S'},
  {name: 'store_returns', color: 'red', icon: 'R'},
  {name: 'store_categories', color: 'blue', icon: 'T'},
  {name: 'store_suppliers', color: 'green', icon: 'U'},
  {name: 'store_reviews', color: 'amber', icon: 'W'},
  {name: 'store_coupons', color: 'purple', icon: 'N'},
  {name: 'store_employees', color: 'red', icon: 'E'},
];

const colorOf = (k: string) => (k === 'blue' ? C.blue : k === 'green' ? C.green : k === 'amber' ? C.amber : k === 'purple' ? C.purple : C.red);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171), 14));
  const depP = pop(f, t(171));
  const tablesP = pop(f, t(180));
  const verifyP = pop(f, t(190));
  const sealP = pop(f, t(200));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Table reveal progress
  const tableReveal = clamp(lin(f, t(180), sec(10)));

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="التطبيقات المؤسسية | Capstone Deployment · manzooma_store_v2_schema.sql · 15 Tables (Module 16)" from={sec(2)} to={sec(38)} color={C.green} />

      {/* LEFT: Capstone deployment code editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={860}
          h={460}
          title="manzooma_store_v2_schema.sql · 15-table capstone deployment (PostgreSQL 16)"
          lines={CAPSTONE_DEPLOY_CODE}
          start={t(171)}
          cps={0.5}
          size={14}
          accent={C.green}
          hl={1}
          hlColor={C.green}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 645, width: 860, opacity: clamp(depP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Module 16 capstone — production-ready deployment</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>15 tables</Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>28 foreign keys</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>22 CHECK</Chip>
          <Chip color={C.red} style={{fontSize: 14, padding: '4px 12px'}}>17 UNIQUE</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>0 violations ✓</Chip>
        </div>
      </div>

      {/* Module 16 Capstone Launch Seal */}
      <Win x={80} y={725} w={860} h={220} title="module 16 capstone launch seal ──► 25% module progress · schema deployed" accent={C.green} opacity={clamp(sealP)}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 22px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Check p={sealP} size={64} color={C.green} />
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 26, color: C.green, fontWeight: 700}}>Module 16 Capstone · Launched ✓</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 4}}>manzooma_store_v2 schema deployed · 15 tables · 28 FK · 22 CHECK · 17 UNIQUE · 0 violations</div>
            </div>
          </div>
          {/* Progress bar at 25% (Module 16 just started) */}
          <div style={{width: '100%', height: 18, borderRadius: 9, background: C.deep, overflow: 'hidden', border: `2px solid ${C.green}`}}>
            <div style={{width: `${0.25 * sealP * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 9, boxShadow: `0 0 ${10 + pulse * 6}px ${C.green}`}} />
          </div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.green, fontWeight: 700}}>Schema deployed · {CAPSTONE_VERIFICATION.deploymentMs}ms · {CAPSTONE_VERIFICATION.schemaSizeMb} MB · production-ready · Module 16 at 25%</div>
        </div>
      </Win>

      {/* RIGHT: 15-table deployment grid + verification */}
      <Win x={960} y={170} w={880} h={780} title="capstone deployment grid ──► 15 tables built in sequence · zero FK violations" accent={C.green} opacity={clamp(lin(f, t(175), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.green}}>
          \i manzooma_store_v2_schema.sql ──► 15 tables built sequentially with all constraints · 0 violations
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 8}}>
          <Chip color={C.amber} style={{fontSize: 12, padding: '4px 10px'}}>{tableReveal > 0.05 && tableReveal < 0.99 ? 'deploying...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{tableReveal > 0.95 ? '15 ✓' : `${Math.floor(tableReveal * 15)}/15`}</Chip>
        </div>

        <svg width={840} height={680} style={{position: 'absolute', left: 18, top: 50}}>
          {/* 15 table cards in a 5x3 grid */}
          {TABLES_15.map((tbl, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const x = 20 + col * 162;
            const y = 10 + row * 130;
            const color = colorOf(tbl.color);
            const p = clamp(tableReveal - i * 0.04);
            return (
              <g key={i} style={{opacity: clamp(p), transform: `translate(${(1 - p) * 18}px, 0)`}}>
                <rect x={x} y={y} width={150} height={110} fill={`${color}22`} stroke={color} strokeWidth={2.5} rx={10} style={{filter: `drop-shadow(0 0 6px ${color}66)`}} />
                {/* Table icon */}
                <circle cx={x + 75} cy={y + 35} r={18} fill={`${color}33`} stroke={color} strokeWidth={2} />
                <text x={x + 75} y={y + 42} fill={color} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">{tbl.icon}</text>
                {/* Table name */}
                <text x={x + 75} y={y + 72} fill={color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{tbl.name}</text>
                <text x={x + 75} y={y + 88} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">table #{i + 1}</text>
                {/* Status badge */}
                <rect x={x + 50} y={y + 95} width={50} height={12} fill={`${C.green}22`} stroke={C.green} strokeWidth={1} rx={3} />
                <text x={x + 75} y={y + 104} fill={C.green} fontSize={8} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ deployed</text>
              </g>
            );
          })}

          {/* Verification summary */}
          <g style={{opacity: clamp(verifyP)}}>
            <rect x={20} y={410} width={800} height={140} fill={`${C.green}11`} stroke={C.green} strokeWidth={2.5} rx={10} />
            <text x={420} y={435} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Schema Verification Report</text>

            {/* 4 verification metrics */}
            {[
              {label: 'tables', value: `${CAPSTONE_VERIFICATION.totalTables}`, color: C.green, x: 60},
              {label: 'foreign keys', value: `${CAPSTONE_VERIFICATION.totalForeignKeys}`, color: C.blue, x: 240},
              {label: 'CHECK', value: `${CAPSTONE_VERIFICATION.totalCheckConstraints}`, color: C.amber, x: 420},
              {label: 'UNIQUE', value: `${CAPSTONE_VERIFICATION.totalUniqueConstraints}`, color: C.red, x: 600},
            ].map((m, i) => (
              <g key={i}>
                <text x={m.x + 80} y={475} fill={m.color} fontSize={26} fontFamily={MONO} fontWeight={700} textAnchor="middle">{m.value}</text>
                <text x={m.x + 80} y={498} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">{m.label}</text>
              </g>
            ))}

            {/* Bottom: zero violations */}
            <rect x={20} y={510} width={800} height={32} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} />
            <text x={420} y={531} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ {CAPSTONE_VERIFICATION.fkViolations} foreign-key violations · {CAPSTONE_VERIFICATION.deploymentMs}ms deploy · {CAPSTONE_VERIFICATION.schemaSizeMb} MB schema</text>
          </g>

          {/* Performance footer */}
          <g style={{opacity: clamp(pop(f, t(200)))}}>
            <rect x={20} y={580} width={800} height={70} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
            <text x={420} y={608} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Capstone Schema · Production-Ready · 15 tables · 0 violations · enterprise traffic certified</text>
            <text x={420} y={630} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">Module 16 capstone launched · ready for analytics pipelines in Lesson 66</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.green}}>15 tables deployed</span>
          <span style={{color: C.amber}}>0 violations</span>
          <span style={{color: C.green}}>Module 16 · 25% ✓</span>
        </div>
      </Win>

      <Caption text="manzooma_store_v2 ──► schema.sql ──► 15 tables ──► 28 FK ──► 22 CHECK ──► 17 UNIQUE ──► 0 violations ──► Capstone ✓" from={t(180)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
