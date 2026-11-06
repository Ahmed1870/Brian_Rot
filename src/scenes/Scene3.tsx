import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {UPDATABLE_VIEW_LINES} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC03 (85-130s): CREATE OR REPLACE VIEW & Updatable Views
// Anchors: 86.0 CREATE OR REPLACE | 90.0 modify | 95.0 updatable | 100.0 single-table | 110.0 UPDATE | 118.0 DROP | 125.0 seal
const S = START.s3;
const t = (g: number) => sec(g - S);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86.5), 14));
  const modP = pop(f, t(90));
  const updatableP = pop(f, t(95));
  const singleP = clamp(lin(f, t(100), 14));
  // UPDATE animation: city value changes from 'Giza' to 'Cairo' on row 101
  const updateProg = clamp(lin(f, t(110), sec(8)));
  // DROP VIEW animation
  const dropProg = clamp(lin(f, t(118), sec(7)));
  const sealP = pop(f, t(125));

  // City value interpolation
  const cityVal = updateProg > 0.5 ? 'Cairo' : 'Giza';

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="CREATE OR REPLACE VIEW و العروض القابلة للتحديث | Updatable Views &amp; DROP VIEW CASCADE" from={sec(2)} to={sec(40)} color={C.green} />

      {/* LEFT: CREATE OR REPLACE VIEW + UPDATE editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={880}
          h={320}
          title="Query Editor · CREATE OR REPLACE VIEW + UPDATE on view"
          lines={UPDATABLE_VIEW_LINES}
          start={t(86.5)}
          cps={0.5}
          size={14}
          accent={C.green}
          hl={5}
          hlColor={C.amber}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 510, width: 880, opacity: clamp(lin(f, t(95), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Updatable view conditions:</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>Single-table ✓</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>No aggregates ✓</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>No DISTINCT ✓</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>No GROUP BY ✓</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>No UNION ✓</Chip>
        </div>
      </div>

      {/* DROP VIEW CASCADE editor */}
      <div style={{position: 'absolute', left: 80, top: 600, width: 880, opacity: clamp(lin(f, t(118), 14))}}>
        <Editor
          x={0}
          y={0}
          w={880}
          h={140}
          title="Query Editor · DROP VIEW with CASCADE option"
          lines={[
            'DROP VIEW vw_active_customers CASCADE;',
            '-- CASCADE drops dependent views automatically',
            '-- RESTRICT (default) blocks if dependents exist',
          ]}
          start={t(118)}
          cps={0.6}
          size={14}
          accent={C.red}
          hl={0}
          hlColor={C.red}
        />
      </div>

      {/* RIGHT: Updatable view demo + single-table propagation */}
      <Win x={1000} y={170} w={840} h={470} title="updatable view ──► UPDATE propagates to base table (single-table only)" accent={C.green} opacity={singleP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          UPDATE on vw_active_customers ──► propagates to store_customers base row
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={updatableP} size={16} color={C.green} /> Updatable ✓
          </Chip>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>Single-table</Chip>
        </div>

        {/* SVG: view → base table propagation */}
        <svg width={800} height={360} style={{position: 'absolute', left: 20, top: 60}}>
          {/* View box (top) */}
          <rect x={20} y={20} width={760} height={80} fill={`${C.green}18`} stroke={C.green} strokeWidth={3} rx={12} />
          <text x={400} y={48} fill={C.green} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">vw_active_customers (virtual view)</text>
          <text x={400} y={72} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">customer_id=101 · customer_name='Ahmed' · city='{cityVal}'</text>
          <text x={400} y={90} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">SELECT customer_id, customer_name, city FROM store_customers WHERE balance &gt; 0;</text>

          {/* UPDATE arrow propagating downward */}
          <g style={{opacity: clamp(pop(f, t(110)))}}>
            <line x1={400} y1={104} x2={400} y2={164} stroke={C.amber} strokeWidth={4} strokeDasharray="6 4" />
            <polygon points="392,156 408,156 400,172" fill={C.amber} />
            <text x={420} y={140} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700}>UPDATE propagates</text>
          </g>

          {/* Base table (bottom) */}
          <rect x={20} y={180} width={760} height={130} fill={`${C.blue}18`} stroke={C.blue} strokeWidth={3} rx={12} />
          <text x={400} y={208} fill={C.blue} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">store_customers (base table · on disk)</text>
          {/* Row 101 highlighted */}
          <rect x={40} y={222} width={720} height={36} fill={updateProg > 0.3 ? `${C.green}22` : `${C.card}`} stroke={updateProg > 0.3 ? C.green : C.border} strokeWidth={2} rx={6} style={updateProg > 0.3 ? {filter: `drop-shadow(0 0 8px ${C.green})`} : undefined} />
          <text x={70} y={244} fill={C.text} fontSize={12} fontFamily={MONO}>101</text>
          <text x={140} y={244} fill={C.text} fontSize={12} fontFamily={MONO}>Ahmed</text>
          <text x={280} y={244} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700}>city = '{cityVal}'</text>
          <text x={460} y={244} fill={C.muted} fontSize={12} fontFamily={MONO}>balance = 250.00</text>
          <text x={640} y={244} fill={updateProg > 0.5 ? C.green : C.muted} fontSize={12} fontFamily={MONO} fontWeight={700}>{updateProg > 0.5 ? '✓ updated' : 'pending...'}</text>

          {/* Other rows (unchanged) */}
          <rect x={40} y={264} width={720} height={28} fill={`${C.card}`} stroke={C.border} strokeWidth={1} rx={4} />
          <text x={70} y={282} fill={C.text} fontSize={12} fontFamily={MONO}>102</text>
          <text x={140} y={282} fill={C.text} fontSize={12} fontFamily={MONO}>Sara</text>
          <text x={280} y={282} fill={C.text} fontSize={12} fontFamily={MONO}>city = 'Alex'</text>
          <text x={460} y={282} fill={C.muted} fontSize={12} fontFamily={MONO}>balance = 0.00 (filtered out)</text>

          {/* Propagation success banner */}
          {updateProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(116)))}}>
              <rect x={120} y={320} width={560} height={36} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 10px ${C.green}66)`}} />
              <text x={400} y={343} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ UPDATE propagated · store_customers row 101 city = 'Cairo' (single-table updatable)</text>
            </g>
          ) : null}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>UPDATE view</span>
          <span>→ base row modified</span>
          <span>single-table ✓</span>
        </div>
      </Win>

      {/* RIGHT BOTTOM: DROP VIEW CASCADE visualization */}
      <Win x={1000} y={660} w={840} h={230} title="DROP VIEW CASCADE ──► dependent views removed automatically" accent={C.red} opacity={clamp(lin(f, t(118), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.red}}>
          DROP VIEW vw_active_customers CASCADE ──► dependent views also removed
        </div>

        <svg width={800} height={140} style={{position: 'absolute', left: 20, top: 50}}>
          {/* Main view (top) */}
          <rect x={300} y={10} width={200} height={44} fill={dropProg > 0.3 ? `${C.red}22` : `${C.green}22`} stroke={dropProg > 0.3 ? C.red : C.green} strokeWidth={2.5} rx={8} style={dropProg > 0.3 ? {filter: `drop-shadow(0 0 8px ${C.red})`} : undefined} />
          <text x={400} y={36} fill={dropProg > 0.3 ? C.red : C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">vw_active_customers</text>

          {/* Dependency arrows */}
          <line x1={340} y1={54} x2={200} y2={90} stroke={C.amber} strokeWidth={2} strokeDasharray="4 4" opacity={dropProg < 0.6 ? 0.6 : 0.2} />
          <line x1={460} y1={54} x2={600} y2={90} stroke={C.amber} strokeWidth={2} strokeDasharray="4 4" opacity={dropProg < 0.6 ? 0.6 : 0.2} />

          {/* Dependent views */}
          <rect x={120} y={90} width={160} height={36} fill={dropProg > 0.7 ? `${C.red}22` : `${C.purple}22`} stroke={dropProg > 0.7 ? C.red : C.purple} strokeWidth={2} rx={6} opacity={dropProg > 0.85 ? 0.4 : 1} />
          <text x={200} y={112} fill={dropProg > 0.7 ? C.red : C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">vw_active_vip</text>

          <rect x={520} y={90} width={160} height={36} fill={dropProg > 0.7 ? `${C.red}22` : `${C.purple}22`} stroke={dropProg > 0.7 ? C.red : C.purple} strokeWidth={2} rx={6} opacity={dropProg > 0.85 ? 0.4 : 1} />
          <text x={600} y={112} fill={dropProg > 0.7 ? C.red : C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">vw_active_summary</text>

          {/* Cascade result text */}
          {dropProg > 0.85 ? (
            <text x={400} y={135} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ CASCADE removed 3 views (1 main + 2 dependents)</text>
          ) : (
            <text x={400} y={135} fill={C.amber} fontSize={11} fontFamily={MONO} textAnchor="middle">cascading... {Math.round(dropProg * 100)}%</text>
          )}
        </svg>
      </Win>

      {/* Seal badge bottom */}
      <div style={{position: 'absolute', left: 80, top: 770, width: 880, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>CREATE OR REPLACE · Updatable · DROP CASCADE ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>Single-table views propagate writes to base tables · DROP CASCADE removes dependents</div>
          </div>
        </div>
      </div>

      <Caption text="CREATE OR REPLACE VIEW ──► Single-Table Updatable ──► UPDATE Propagates ──► DROP CASCADE" from={t(110)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
