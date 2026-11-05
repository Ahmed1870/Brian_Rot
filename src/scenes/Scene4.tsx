import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, PipeNode, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';

// SC04 (130-170s): PostgreSQL 16 — pg_class Catalog & work_mem Diff Engine
// Anchors: 131.0 engine | 136.0 pg_class | 140.0 relkind m | 145.0 heap | 150.0 work_mem | 155.0 MERGE | 160.0 diff | 165.0 background
const S = START.s4;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const engineP = clamp(lin(f, t(131.5), 16));
  const catalogP = clamp(lin(f, t(136), 16));
  const diffP = clamp(lin(f, t(150), 16));
  const sealP = pop(f, t(160));

  // Diff computation animation
  const diffProg = clamp(lin(f, t(151), sec(14)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="كواليس المحرك | pg_class Catalog & work_mem Diff Engine" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* EXPLAIN editor at top */}
      <div style={{opacity: engineP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={120}
          title="EXPLAIN · MatView Internal Structure"
          lines={[
            "SELECT relname, relkind FROM pg_class WHERE relname = 'mv_sales';",
            "-- result: relkind = 'm' (materialized view · stored as Heap Table)",
          ]}
          start={t(131.5)}
          cps={0.8}
          size={16}
          accent={C.amber}
          hl={1}
          hlColor={C.amber}
        />
      </div>

      {/* LEFT: pg_class catalog node (amber) */}
      <PipeNode x={80} y={320} w={860} h={460} label="pg_class System Catalog" sublabel="relkind = 'm' · Heap Table storage" color={C.amber} p={catalogP} glow={f >= t(136) && f < t(150)}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
          materialized view cataloged as physical relation
        </div>

        {/* Catalog entry visualization */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 50}}>
          <div dir="ltr" style={{padding: '14px 16px', border: `2px solid ${C.amber}`, borderRadius: 10, background: C.deep, fontFamily: MONO, fontSize: 16}}>
            <div style={{color: '#64748B', fontSize: 12, marginBottom: 6}}>pg_class entry</div>
            <div style={{display: 'flex', gap: 20, flexWrap: 'wrap'}}>
              <div><span style={{color: C.muted}}>relname:</span> <span style={{color: C.text, fontWeight: 700}}>mv_sales</span></div>
              <div><span style={{color: C.muted}}>relkind:</span> <span style={{color: C.amber, fontWeight: 700}}>'m'</span></div>
              <div><span style={{color: C.muted}}>relkind desc:</span> <span style={{color: C.green, fontWeight: 700}}>materialized view</span></div>
            </div>
          </div>

          {/* Storage type comparison */}
          <div style={{marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10}}>
            {[
              {kind: 'r', desc: 'ordinary table', active: false},
              {kind: 'v', desc: 'view (virtual)', active: false},
              {kind: 'm', desc: 'materialized view (Heap Table)', active: true},
              {kind: 'i', desc: 'index', active: false},
            ].map((entry, i) => {
              const visible = clamp(pop(f, t(138 + i * 0.8)));
              return (
                <div key={i} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', border: `2px solid ${entry.active ? C.amber : C.border}`, borderRadius: 8, background: entry.active ? `${C.amber}0d` : 'transparent', opacity: visible}}>
                  <span style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: entry.active ? C.amber : C.muted, width: 40}}>'{entry.kind}'</span>
                  <span style={{fontFamily: MONO, fontSize: 16, color: entry.active ? C.text : C.muted, flex: 1}}>{entry.desc}</span>
                  {entry.active ? <span style={{color: C.amber, fontSize: 14, fontWeight: 700}}>◄ MatView</span> : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>pg_class catalog</span>
          <span>Heap Table on disk</span>
        </div>
      </PipeNode>

      {/* RIGHT: work_mem Diff Engine (blue) */}
      <PipeNode x={980} y={320} w={860} h={460} label="work_mem · Diff & MERGE Engine" sublabel="concurrent refresh · in-memory differential" color={C.blue} p={diffP} glow={f >= t(150)}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          computes diff between old & new data in RAM
        </div>

        {/* Diff visualization */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 50}}>
          {/* Two data versions */}
          <div style={{display: 'flex', gap: 14, marginBottom: 16}}>
            <div style={{flex: 1, padding: '10px 14px', border: `2px solid ${C.border}`, borderRadius: 8, background: C.deep}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginBottom: 6}}>old version</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.text, opacity: 0.5}}>
                store 1: $1.25M<br/>store 2: $0.98M<br/>store 3: $1.62M
              </div>
            </div>
            <div style={{flex: 1, padding: '10px 14px', border: `2px solid ${C.blue}`, borderRadius: 8, background: `${C.blue}0d`}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.blue, marginBottom: 6}}>new version</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.text}}>
                store 1: $1.48M<br/>store 2: $1.12M<br/>store 3: $1.95M
              </div>
            </div>
          </div>

          {/* MERGE arrow */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 16}}>
            <div style={{fontFamily: MONO, fontSize: 20, color: C.blue, fontWeight: 700}}>MERGE</div>
            <svg width={60} height={30}>
              <line x1={0} y1={15} x2={50} y2={15} stroke={C.blue} strokeWidth={3} strokeDasharray="5 3" />
              <polygon points="45,9 45,21 57,15" fill={C.blue} />
            </svg>
          </div>

          {/* Diff progress */}
          <div style={{marginBottom: 16}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginBottom: 4}}>diff computation progress</div>
            <div style={{height: 20, borderRadius: 10, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${diffProg * 100}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 10}} />
            </div>
          </div>

          {/* Result */}
          {diffProg > 0.5 ? (
            <div style={{padding: '10px 14px', border: `2px solid ${C.green}`, borderRadius: 8, background: `${C.green}0d`, opacity: clamp(pop(f, t(158)))}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700}}>✓ differential applied in background</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 4}}>reads continue uninterrupted</div>
            </div>
          ) : null}
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 14, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 16, color: C.blue, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border}}>
          <span>work_mem buffer</span>
          <span>{Math.round(diffProg * 100)}% merged</span>
        </div>
      </PipeNode>

      {/* Bottom seal */}
      <div style={{position: 'absolute', left: 80, top: 810, width: 1760, opacity: clamp(sealP), display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 28px', border: `2px solid ${C.green}`, borderRadius: 18, background: `${C.green}0d`}}>
          <Check p={sealP} size={40} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>
            Zero Read Interruption · Background MERGE
          </div>
        </div>
      </div>

      <Caption text="PostgreSQL System Catalog ──► Cataloged in pg_class (relkind = 'm')" from={t(136)} to={t(150)} />
      <Caption text="In-Memory Diff Engine ──► Computes Differential MERGE in work_mem" from={t(152)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
