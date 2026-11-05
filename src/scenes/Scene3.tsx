import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';

// SC03 (85-130s): Surgical Indexing — Partial & Composite Indexes
// Anchors: 86.0 partial | 90.0 WHERE completed | 95.0 surgical | 100.0 index scan | 110.0 RAM | 118.0 fast | 125.0 seal
const S = START.s3;
const t = (g: number) => sec(g - S);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86.5), 14));
  const compareP = clamp(lin(f, t(95), 16));
  const scanP = clamp(lin(f, t(100), 16));
  const sealP = pop(f, t(118));

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="الفهرسة الجراحية | Partial & Composite Indexes" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* SQL editor at top */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={150}
          title="PostgreSQL · Partial Index on Materialized View"
          lines={[
            "CREATE INDEX idx_mv_sales_completed",
            "  ON mv_regional_sales (store_id, sales_amount)",
            "  WHERE status = 'completed';",
          ]}
          start={t(86.5)}
          cps={0.8}
          size={18}
          accent={C.purple}
          hl={2}
          hlColor={C.purple}
        />
      </div>

      {/* LEFT: Full index vs Partial index comparison */}
      <Win x={80} y={350} w={860} h={560} title="full index vs partial index · memory footprint" accent={C.purple} opacity={compareP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          surgical focus reduces RAM footprint
        </div>

        {/* Full index block (large) */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 50, padding: '16px 18px', border: `2px solid ${C.muted}`, borderRadius: 12, background: `${C.muted}08`, opacity: 0.6}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, fontWeight: 700, marginBottom: 8}}>Full Index (all rows)</div>
          <div style={{height: 40, borderRadius: 8, background: `${C.muted}22`, border: `1px solid ${C.muted}`, display: 'flex', alignItems: 'center', padding: '0 12px'}}>
            <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>100% of data indexed · heavy RAM</span>
          </div>
        </div>

        {/* Partial index block (smaller, focused) */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 180, padding: '16px 18px', border: `3px solid ${C.purple}`, borderRadius: 12, background: `${C.purple}0d`, boxShadow: `0 0 24px ${C.purple}44`}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.purple, fontWeight: 700, marginBottom: 8}}>Partial Index (completed only)</div>
          <div style={{height: 40, borderRadius: 8, background: `${C.purple}22`, border: `1px solid ${C.purple}`, display: 'flex', alignItems: 'center', padding: '0 12px', width: '40%'}}>
            <span style={{fontFamily: MONO, fontSize: 14, color: C.purple}}>~40% indexed · lighter RAM</span>
          </div>
        </div>

        {/* Benefits list */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 320, display: 'flex', flexDirection: 'column', gap: 10}}>
          {[
            {label: 'smaller storage footprint', color: C.green},
            {label: 'faster index build', color: C.blue},
            {label: 'sub-millisecond Index Scan', color: C.green},
          ].map((item, i) => {
            const visible = clamp(pop(f, t(100 + i * 1.2)));
            return (
              <div key={i} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', border: `2px solid ${item.color}`, borderRadius: 8, background: `${item.color}0d`, opacity: visible}}>
                <Check p={visible} size={28} color={item.color} />
                <span style={{fontFamily: MONO, fontSize: 18, color: item.color, fontWeight: 700}}>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 16, color: C.purple, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          WHERE status = 'completed' · surgical focus
        </div>
      </Win>

      {/* RIGHT: Scan type comparison */}
      <Win x={980} y={350} w={860} h={530} title="sequential scan vs index scan · performance" accent={C.green} opacity={scanP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          partial index converts Seq Scan → Index Scan
        </div>

        {/* Seq Scan (before) */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 50, padding: '16px 18px', border: `2px solid ${C.red}`, borderRadius: 12, background: `${C.red}0d`, opacity: 0.7}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.red, fontWeight: 700, marginBottom: 8}}>BEFORE: Sequential Scan</div>
          <div style={{display: 'flex', gap: 4, flexWrap: 'wrap'}}>
            {Array.from({length: 20}).map((_, i) => (
              <div key={i} style={{width: 30, height: 20, borderRadius: 4, background: `${C.red}33`, border: `1px solid ${C.red}`, opacity: 0.5}} />
            ))}
          </div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginTop: 8}}>scans ALL rows · slow · heavy I/O</div>
        </div>

        {/* Arrow */}
        <div style={{position: 'absolute', left: '50%', top: 200, transform: 'translateX(-50%)', fontFamily: MONO, fontSize: 28, color: C.green, fontWeight: 700}}>▼</div>

        {/* Index Scan (after) */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 240, padding: '16px 18px', border: `3px solid ${C.green}`, borderRadius: 12, background: `${C.green}0d`, boxShadow: `0 0 24px ${C.green}44`}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700, marginBottom: 8}}>AFTER: Index Scan ✓</div>
          <div style={{display: 'flex', gap: 4}}>
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} style={{width: 30, height: 20, borderRadius: 4, background: `${C.green}44`, border: `1px solid ${C.green}`}} />
            ))}
          </div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginTop: 8}}>scans only matching rows · sub-ms · minimal I/O</div>
        </div>

        {/* Seal */}
        <div style={{position: 'absolute', left: 18, right: 18, bottom: 60, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`, opacity: clamp(sealP)}}>
          <Check p={sealP} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Surgical Indexing ✓ · RAM optimized</div>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          Seq Scan → Index Scan · 0.002s
        </div>
      </Win>

      <Caption text="CREATE INDEX ON mv_regional_sales (...) WHERE status = 'completed'" from={t(90)} to={t(108)} />
      <Caption text="Surgical Indexing ──► Reduces RAM Footprint & Converts Scans to Index Scan" from={t(110)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
