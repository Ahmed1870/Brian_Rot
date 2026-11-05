import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {PIPELINE_LAYERS} from '../data';

// SC01 (0-40s): Layered Analytics Pipeline & Pre-Aggregation
// Anchors: 1.0 welcome | 5.0 materialized | 9.0 pre-aggregation | 14.0 layers | 20.0 pipeline | 28.0 bottleneck | 35.0 seal
const S = START.s1;
const t = (g: number) => sec(g - S);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(2), 14));
  const pipelineP = clamp(lin(f, t(4), 14));
  const layerProgress = clamp(lin(f, t(8), sec(20)));
  const sealP = pop(f, t(28));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="استراتيجيات تسريع التقارير | Analytics Pipeline Acceleration" from={sec(2)} to={sec(18)} />

      {/* SQL editor on the left */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={210}
          title="Query Editor"
          lines={[
            'CREATE MATERIALIZED VIEW mv_sales_summary AS',
            '  SELECT s.store_id, p.category,',
            '         SUM(s.qty * p.price) AS revenue',
            '  FROM sales s',
            '  JOIN products p ON s.product_id = p.id',
            '  GROUP BY s.store_id, p.category;',
          ]}
          start={t(2)}
          cps={0.85}
          size={16}
          accent={C.blue}
          hl={0}
          hlColor={C.blue}
        />
      </div>

      {/* Concept callout */}
      <div style={{position: 'absolute', left: 80, top: 410, width: 820, opacity: clamp(lin(f, t(9), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginBottom: 10}}>◆ pre-aggregation</div>
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          <Chip color={C.blue}>Layered Pipeline</Chip>
          <Chip color={C.green}>Pre-Computed</Chip>
          <Chip color={C.amber}>10M+ rows → instant</Chip>
        </div>
      </div>

      {/* Seal */}
      <div style={{position: 'absolute', left: 80, top: 520, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `2px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`}}>
          <Check p={sealP} size={44} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Pre-Aggregated Pipeline ✓</div>
            <Mix style={{fontSize: 18, color: C.muted}}>إلغاء اختناقات JOIN للبيانات الضخمة</Mix>
          </div>
        </div>
      </div>

      {/* Pipeline visualization on the right */}
      <Win x={940} y={180} w={900} h={720} title="layered analytics pipeline · pre-aggregation" accent={C.blue} opacity={pipelineP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          multi-million row JOINs → pre-aggregated MatView
        </div>

        {/* Pipeline layers — 3 stacked blocks */}
        <div style={{position: 'absolute', left: 60, right: 60, top: 50, display: 'flex', flexDirection: 'column', gap: 24}}>
          {PIPELINE_LAYERS.map((layer, i) => {
            const visible = layerProgress > i / 3;
            const isActive = layerProgress > i / 3 && layerProgress < (i + 1) / 3;
            return (
              <div key={i} style={{
                opacity: visible ? 1 : 0.3,
                transform: visible ? 'translateY(0)' : 'translateY(-30px)',
                padding: '20px 24px',
                borderRadius: 16,
                border: `3px solid ${layer.color}`,
                background: `${layer.color}0d`,
                boxShadow: isActive ? `0 0 28px ${layer.color}88` : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}>
                <div style={{fontFamily: MONO, fontSize: 36, fontWeight: 700, color: layer.color, width: 60}}>{layer.layer}</div>
                <div style={{flex: 1}}>
                  <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: layer.color}}>{layer.label}</div>
                  <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginTop: 4}}>{layer.desc}</div>
                </div>
                {visible ? <Check p={1} size={36} color={layer.color} /> : null}
              </div>
            );
          })}

          {/* Arrow between layers */}
          {layerProgress > 0 && layerProgress < 1 ? (
            <div style={{position: 'absolute', left: '50%', top: `${layerProgress * 280}px`, transform: 'translateX(-50%)', fontFamily: MONO, fontSize: 24, color: C.blue, fontWeight: 700}}>
              ▼
            </div>
          ) : null}
        </div>

        {/* Bottom summary */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>Pre-Aggregation Layer</span>
          <span>{layerProgress >= 1 ? '✓ pipeline ready' : 'condensing...'}</span>
        </div>
      </Win>

      <Caption text="Pre-Aggregation Layer ──► Eliminates Multi-Million Row JOIN Bottlenecks" from={t(22)} to={sec(38)} />
    </Stage>
  );
};
