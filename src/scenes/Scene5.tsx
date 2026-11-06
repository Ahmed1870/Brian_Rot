import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {ENTERPRISE_INDEXES} from '../data';

// SC05 (170-210s): Enterprise Multi-Pattern Indexing Dashboard
// Anchors: 171.0 enterprise | 175.0 multi-pattern | 180.0 B-Tree GIN GiST | 185.0 dashboard | 192.0 instant | 200.0 seal | 205.0 stable
const S = START.s5;
const t = (g: number) => sec(g - S);

const CARDS = [
  {type: 'B-Tree', target: 'unit_price', desc: 'price range queries', color: C.blue, query: 'WHERE unit_price BETWEEN 100 AND 500', speedup: '1000×', time: '0.001s'},
  {type: 'GIN', target: 'specs_jsonb', desc: 'JSONB containment', color: C.amber, query: "WHERE specs_jsonb @> '{\"tags\":[\"gaming\"]}'", speedup: '850×', time: '0.003s'},
  {type: 'GiST', target: 'delivery_point', desc: 'GIS spatial search', color: C.purple, query: 'WHERE delivery_point && query_area', speedup: '600×', time: '0.005s'},
];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const reportP = clamp(lin(f, t(180), 14));
  const dashboardP = clamp(lin(f, t(185), 16));
  // Performance gauge fill
  const gaugeProg = clamp(lin(f, t(186), sec(12)));
  const sealP = pop(f, t(200));
  const stableP = pop(f, t(205));

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="التطبيق المؤسسي | Enterprise Multi-Pattern Indexing Dashboard" from={sec(1)} to={sec(38)} color={C.green} />

      {/* Editor with 3 CREATE INDEX statements */}
      <Editor
        x={80}
        y={170}
        w={880}
        h={260}
        title="Enterprise · Multi-Pattern Indexes · manzooma_store_db"
        lines={[
          'CREATE INDEX idx_price ON products USING btree (unit_price);',
          'CREATE INDEX idx_specs ON products USING gin (specs_jsonb);',
          'CREATE INDEX idx_geo  ON deliveries USING gist (delivery_point);',
          '-- B-Tree: ranges · GIN: JSONB · GiST: spatial',
        ]}
        start={t(171.5)}
        cps={0.6}
        size={14}
        accent={C.green}
        hl={1}
        hlColor={C.amber}
      />

      {/* Executive report panel */}
      <Win x={1000} y={170} w={840} h={260} title="executive report · multi-pattern indexing" accent={C.green} opacity={reportP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          3 Index Strategies · 1 Table
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 46, right: 24, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>B-Tree range</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>GIN JSONB</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>GiST spatial</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>3 indexes</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, top: 110, padding: '12px 14px', border: `1px solid ${C.border}`, borderRadius: 8, background: C.deep, fontFamily: MONO, fontSize: 13, color: C.text}}>
          <span style={{color: '#64748B'}}>strategy:</span> each query pattern gets its own optimal index type — no single index fits all workloads.
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.text, fontWeight: 700}}>
            instant dashboard ✓
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: clamp(sealP), transform: `scale(${0.85 + 0.15 * clamp(sealP)})`}}>
            <Check p={sealP} size={40} color={C.green} />
            <div style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Seal ✓</div>
          </div>
        </div>
      </Win>

      {/* Dashboard — 3 index type performance cards */}
      <Win x={80} y={450} w={1760} h={440} title="performance dashboard · multi-pattern index gains" accent={C.green} opacity={dashboardP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          execution acceleration by index type
        </div>

        {/* 3 cards side by side */}
        <div style={{position: 'absolute', left: 24, right: 24, top: 56, display: 'flex', gap: 18}}>
          {CARDS.map((card, i) => {
            const visible = clamp(pop(f, t(186 + i * 0.6)));
            const fillW = clamp(gaugeProg * (1 - i * 0.05));
            return (
              <div key={i} dir="ltr" style={{flex: 1, padding: '18px', border: `2px solid ${card.color}`, borderRadius: 14, background: `${card.color}0d`, opacity: visible, transform: `translateY(${(1 - visible) * 20}px)`, boxShadow: `0 0 24px ${card.color}44`}}>
                {/* Header */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                  <span style={{fontFamily: MONO, fontSize: 20, color: card.color, fontWeight: 700}}>{card.type}</span>
                  <Check p={1} size={28} color={card.color} />
                </div>
                {/* Target column */}
                <div style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 4}}>target: <span style={{color: C.text}}>{card.target}</span></div>
                <div style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 12}}>{card.desc}</div>
                {/* Sample query */}
                <div style={{padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.deep, fontFamily: MONO, fontSize: 11, color: C.text, minHeight: 50, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                  {card.query}
                </div>
                {/* Speedup gauge */}
                <div style={{marginTop: 14}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 12, color: C.muted, marginBottom: 4}}>
                    <span>speedup</span>
                    <span style={{color: card.color, fontWeight: 700}}>{card.speedup}</span>
                  </div>
                  <div style={{height: 14, borderRadius: 7, background: C.border, overflow: 'hidden'}}>
                    <div style={{height: '100%', width: `${fillW * 100}%`, background: `linear-gradient(90deg, ${card.color}, ${C.green})`, borderRadius: 7}} />
                  </div>
                </div>
                {/* Time */}
                <div style={{marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>avg time:</span>
                  <span style={{fontFamily: MONO, fontSize: 24, color: C.green, fontWeight: 700, textShadow: `0 0 12px ${C.green}66`}}>{card.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom KPIs */}
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 12, height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 20, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>3 indexes · 3 patterns</span>
          <span style={{color: C.green, opacity: clamp(stableP)}}>{stableP > 0 ? '✓ production stable' : 'loading...'}</span>
          <span style={{color: C.amber}}>load time: &lt; 0.01s</span>
        </div>
      </Win>

      <Caption text="Enterprise Multi-Pattern Indexing ──► B-Tree + GIN + GiST (1000× / 850× / 600× Speedup)" from={t(180)} to={t(195)} tone="ok" />
      <Caption text="Production Strategy ──► Match Each Query Pattern To Its Optimal Index Type" from={t(197)} to={sec(38.5)} tone="ok" />
    </Stage>
  );
};
