import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';
import {ENTERPRISE_QUERY_LINES} from '../data';

// SC05 (170-210s): Enterprise Refactoring Capstone — SARGable store_orders Query + Benchmark
// Anchors: 171.0 enterprise | 175.0 refactor | 180.0 SARGable | 185.0 dashboard | 192.0 instant | 200.0 module 12 seal | 205.0 complete
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const reportP = clamp(lin(f, t(180), 14));
  const dashboardP = clamp(lin(f, t(185), 16));
  // Performance benchmark fill
  const benchProg = clamp(lin(f, t(186), sec(12)));
  const sealP = pop(f, t(200));
  const completeP = pop(f, t(205));

  // Interpolated times
  const beforeTime = 4.2;
  const afterTime = lerp(4.2, 0.003, benchProg);

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="التطبيق المؤسسي | Enterprise SARGable Refactoring Capstone" from={sec(1)} to={sec(38)} color={C.green} />

      {/* Editor with SARGable enterprise query */}
      <Editor
        x={80}
        y={170}
        w={880}
        h={280}
        title="Enterprise · SARGable Refactor · store_orders (manzooma_store_db)"
        lines={ENTERPRISE_QUERY_LINES.concat([
          '',
          '-- SARGable: bare columns · constant arithmetic',
          '-- both predicates route to Index Scan',
        ])}
        start={t(171.5)}
        cps={0.55}
        size={15}
        accent={C.green}
        hl={2}
        hlColor={C.blue}
      />

      {/* Executive report panel */}
      <Win x={1000} y={170} w={840} h={280} title="executive report · SARGable refactoring" accent={C.green} opacity={reportP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          SARGable Refactor · Module 12 Capstone
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 46, right: 24, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>bare columns</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>Index Scan ✓</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>constant arithmetic</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>DATE_TRUNC SARGable</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, top: 110, padding: '12px 14px', border: `1px solid ${C.border}`, borderRadius: 8, background: C.deep, fontFamily: MONO, fontSize: 13, color: C.text, lineHeight: 1.5}}>
          <span style={{color: '#64748B'}}>refactor strategy:</span> eliminate function wrapping · move arithmetic to constant side · match column types · route both predicates through B-Tree indexes.
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.text, fontWeight: 700}}>
            instant dashboard ✓
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: clamp(sealP), transform: `scale(${0.85 + 0.15 * clamp(sealP)})`}}>
            <Check p={sealP} size={40} color={C.green} />
            <div style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Module 12 Seal ✓</div>
          </div>
        </div>
      </Win>

      {/* Performance benchmark dashboard */}
      <Win x={80} y={470} w={1760} h={420} title="performance benchmark · 4.2s → 0.003s · Module 12 Completion" accent={C.green} opacity={dashboardP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          before vs after refactoring ──► 1400× speedup
        </div>

        {/* Two large panels: BEFORE / AFTER */}
        <div style={{position: 'absolute', left: 24, right: 24, top: 56, display: 'flex', gap: 18}}>
          {/* BEFORE panel */}
          <div style={{flex: 1, padding: '18px', border: `2px solid ${C.red}`, borderRadius: 14, background: `${C.red}0d`, opacity: clamp(pop(f, t(186)))}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
              <span style={{fontFamily: MONO, fontSize: 18, color: C.red, fontWeight: 700}}>BEFORE (non-SARGable)</span>
            </div>
            <div style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 4}}>query form:</div>
            <div dir="ltr" style={{padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.deep, fontFamily: MONO, fontSize: 12, color: C.text, minHeight: 80, whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: 14}}>
              {`SELECT * FROM store_orders\nWHERE EXTRACT(YEAR FROM order_date) = 2024\n  AND total_amount * 1.10 > 5000;`}
            </div>
            <div style={{marginTop: 6}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 4}}>
                <span>execution time</span>
                <span style={{color: C.red, fontWeight: 700}}>{beforeTime.toFixed(1)}s</span>
              </div>
              <div style={{height: 18, borderRadius: 9, background: C.border, overflow: 'hidden'}}>
                <div style={{height: '100%', width: '100%', background: C.red, borderRadius: 9}} />
              </div>
            </div>
            <div style={{marginTop: 14, fontFamily: MONO, fontSize: 13, color: C.red, fontWeight: 700}}>plan: Seq Scan · cost 5432</div>
          </div>

          {/* Arrow */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.amber, fontWeight: 700}}>refactor</div>
            <svg width={60} height={40}>
              <line x1={4} y1={20} x2={48} y2={20} stroke={C.amber} strokeWidth={4} />
              <polygon points="42,10 42,30 56,20" fill={C.amber} />
            </svg>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>1400×</div>
          </div>

          {/* AFTER panel */}
          <div style={{flex: 1, padding: '18px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`, opacity: clamp(pop(f, t(188)))}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
              <span style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>AFTER (SARGable ✓)</span>
              <Check p={1} size={28} color={C.green} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 4}}>query form:</div>
            <div dir="ltr" style={{padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.deep, fontFamily: MONO, fontSize: 12, color: C.text, minHeight: 80, whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: 14}}>
              {`SELECT order_id, customer_id, total_amount\nFROM store_orders\nWHERE order_date >= DATE_TRUNC('year', CURRENT_DATE)\n  AND total_amount > 5000 / 1.10;`}
            </div>
            <div style={{marginTop: 6}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 4}}>
                <span>execution time</span>
                <span style={{color: C.green, fontWeight: 700}}>{afterTime.toFixed(3)}s</span>
              </div>
              <div style={{height: 18, borderRadius: 9, background: C.border, overflow: 'hidden'}}>
                <div style={{height: '100%', width: `${Math.max(2, (afterTime / beforeTime) * 100)}%`, background: `linear-gradient(90deg, ${C.green}, ${C.blue})`, borderRadius: 9}} />
              </div>
            </div>
            <div style={{marginTop: 14, fontFamily: MONO, fontSize: 13, color: C.green, fontWeight: 700}}>plan: Index Scan · cost 12</div>
          </div>
        </div>

        {/* Module 12 Completion Seal */}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 18px', border: `2px solid ${C.amber}`, borderRadius: 14, background: `${C.amber}0d`, opacity: clamp(completeP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <Check p={completeP} size={42} color={C.amber} />
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.amber, fontWeight: 700}}>Module 12 Completion Seal ✓</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>SARGable Queries & High-Performance Best Practices · Mastered</div>
            </div>
          </div>
          <div style={{fontFamily: MONO, fontSize: 24, color: C.green, fontWeight: 700, textShadow: `0 0 12px ${C.green}66`}}>
            4.2s → 0.003s
          </div>
        </div>
      </Win>

      <Caption text="Enterprise SARGable Refactor ──► 4.2s → 0.003s (1400× Speedup) · Module 12 Seal ✓" from={t(192)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
