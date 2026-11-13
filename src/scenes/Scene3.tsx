// SC03 — Binary Search (Mode 2) & LET Formula Caching (01:25-02:10).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';
import {LET_BEFORE, LET_AFTER} from '../data';

const SC = {from: 2550, dur: 1350};

export const Scene3: React.FC = () => {
  const local = useCurrentFrame();

  // Linear search reveal (0-360)
  const linearP = interpolate(local, [0, 240], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Binary search reveal (240-720)
  const binaryP = interpolate(local, [240, 480], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // LET before/after (720-1080)
  const letP = interpolate(local, [720, 900], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Final seal
  const sealP = interpolate(local, [1080, 1200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Animated binary halving
  const stepIdx = Math.min(5, Math.floor((local - 240) / 80));
  const currentRange = ['50,000', '25,000', '12,500', '6,250', '3,125', '16'][stepIdx];

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Logarithmic Binary Search ──► XLOOKUP/XMATCH (Search Mode = 2): 50,000 Steps → 16 Steps!" from={60} to={630} color={C.purple} />

      {/* LEFT: Linear vs Binary search visualization */}
      <div style={{position: 'absolute', left: 80, top: 180, width: 1080, height: 660}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>{'Linear vs Binary Search'}</div>

        {/* Linear (bad) */}
        <div style={{background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, padding: 18, marginBottom: 14, opacity: linearP, boxShadow: `0 0 20px ${C.red}22`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12}}>
            <div style={{padding: '4px 12px', background: C.red, color: '#fff', borderRadius: 4, fontFamily: MONO, fontSize: 12, fontWeight: 700}}>{'LINEAR · O(N)'}</div>
            <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.red}}>{'50,000 خطوة بحث'}</div>
          </div>
          <div style={{display: 'flex', gap: 2, height: 40}}>
            {Array.from({length: 50}).map((_, i) => {
              const scanned = (linearP * 50) > i;
              return <div key={i} style={{flex: 1, background: scanned ? C.red : C.deep, opacity: scanned ? 0.6 : 0.2, borderRadius: 2}} />;
            })}
          </div>
          <div style={{fontFamily: MONO, fontSize: 13, color: C.red, marginTop: 8}}>{'XLOOKUP(A, B, C) — default search_mode = 1'}</div>
        </div>

        {/* Binary (good) */}
        <div style={{background: C.card, border: `2px solid ${C.purple}`, borderRadius: 12, padding: 18, opacity: binaryP, boxShadow: `0 0 30px ${C.purple}33`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12}}>
            <div style={{padding: '4px 12px', background: C.purple, color: '#fff', borderRadius: 4, fontFamily: MONO, fontSize: 12, fontWeight: 700}}>{'BINARY · O(log₂ N)'}</div>
            <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.purple}}>{'16 خطوة فقط'}</div>
            <div style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 14, color: C.purple, fontWeight: 700}}>{'range: ' + currentRange}</div>
          </div>

          {/* Halving visualization */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
            {[
              {label: 'step 1', range: '1 → 50,000', cut: 50},
              {label: 'step 2', range: '1 → 25,000', cut: 25},
              {label: 'step 3', range: '1 → 12,500', cut: 12.5},
              {label: 'step 4', range: '1 → 6,250', cut: 6.25},
              {label: 'step 5', range: '1 → 3,125', cut: 3.1},
              {label: 'step 16', range: 'found ✓', cut: 0.5},
            ].map((s, i) => {
              const p = interpolate(local, [240 + i * 80, 320 + i * 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              const isCurrent = i === stepIdx;
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, opacity: p}}>
                  <div style={{width: 70, fontFamily: MONO, fontSize: 12, color: isCurrent ? C.purple : C.muted, fontWeight: 700}}>{s.label}</div>
                  <div style={{flex: 1, height: 16, background: C.deep, borderRadius: 4, overflow: 'hidden', position: 'relative'}}>
                    <div style={{width: `${s.cut}%`, height: '100%', background: isCurrent ? C.purple : `${C.purple}88`, transition: 'width 0.3s'}} />
                    <div style={{position: 'absolute', left: '50%', top: -2, bottom: -2, width: 2, background: C.amber, opacity: isCurrent ? 1 : 0.3}} />
                  </div>
                  <div style={{width: 100, fontFamily: MONO, fontSize: 11, color: C.muted, textAlign: 'right'}}>{s.range}</div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop: 12, padding: 12, background: C.deep, border: `1px solid ${C.purple}`, borderRadius: 6, fontFamily: MONO, fontSize: 14, color: C.purple}}>
            {'=XLOOKUP(A, B, C, , , 2)'}<span style={{color: C.muted, marginLeft: 12}}>{'// search_mode = 2 (binary ascending)'}</span>
          </div>
        </div>
      </div>

      {/* RIGHT: LET before/after */}
      <div style={{position: 'absolute', right: 80, top: 180, width: 600, height: 660, opacity: letP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>{'LET() Formula Caching'}</div>

        {/* BEFORE */}
        <div style={{background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, padding: 18, marginBottom: 14}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10}}>
            <div style={{padding: '3px 10px', background: C.red, color: '#fff', borderRadius: 4, fontFamily: MONO, fontSize: 11, fontWeight: 700}}>{'BEFORE'}</div>
            <span style={{fontFamily: FONT, fontSize: 13, color: C.red}}>{'XLOOKUP يتكرر 2 مرة'}</span>
          </div>
          <div style={{padding: 14, background: C.deep, borderRadius: 8, fontFamily: MONO, fontSize: 14, color: C.red, wordBreak: 'break-all'}}>
            {LET_BEFORE}
          </div>
          <div style={{marginTop: 8, fontFamily: FONT, fontSize: 12, color: C.muted}}>{'50,000 صف × 2 حساب = 100K عملية'}</div>
        </div>

        {/* Arrow */}
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: 14}}>
          <svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 4 V32 M8 22 L20 34 L32 22" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>

        {/* AFTER */}
        <div style={{background: C.card, border: `2px solid ${C.green}`, borderRadius: 12, padding: 18, boxShadow: `0 0 25px ${C.green}33`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10}}>
            <div style={{padding: '3px 10px', background: C.green, color: '#0B1222', borderRadius: 4, fontFamily: MONO, fontSize: 11, fontWeight: 700}}>{'AFTER · LET()'}</div>
            <span style={{fontFamily: FONT, fontSize: 13, color: C.green}}>{'حساب واحد مخزّن'}</span>
          </div>
          <div style={{padding: 14, background: C.deep, borderRadius: 8, fontFamily: MONO, fontSize: 14, color: C.green, wordBreak: 'break-all'}}>
            {LET_AFTER}
          </div>
          <div style={{marginTop: 8, fontFamily: FONT, fontSize: 12, color: C.muted}}>{'50,000 صف × 1 حساب = 50K عملية'}</div>
        </div>

        {/* Offload to Pivot/Power Query */}
        <div style={{marginTop: 14, display: 'flex', gap: 10}}>
          <div style={{flex: 1, padding: 12, background: C.deep, border: `1px solid ${C.amber}`, borderRadius: 8, textAlign: 'center'}}>
            <div style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.amber}}>{'PivotTables'}</div>
            <div style={{fontFamily: FONT, fontSize: 11, color: C.muted, marginTop: 4}}>{'تجميعات ضخمة'}</div>
          </div>
          <div style={{flex: 1, padding: 12, background: C.deep, border: `1px solid ${C.amber}`, borderRadius: 8, textAlign: 'center'}}>
            <div style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.amber}}>{'Power Query'}</div>
            <div style={{fontFamily: FONT, fontSize: 11, color: C.muted, marginTop: 4}}>{'تحويلات معقدة'}</div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.purple}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.purple}33`}}>
          <Check size={40} p={sealP} color={C.purple} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.purple}}>{'Formula Caching & Offloading ──► LET() + PivotTables + Power Query'}</Mix>
        </div>
      </div>

      <Caption text="Logarithmic Binary Search ──► XLOOKUP/XMATCH (Search Mode = 2): 50,000 Steps → 16 Steps!" from={60} to={630} tone="normal" />
      <Caption text="Formula Caching & Offloading ──► Cache Repeated Logic via LET() & Offload to Pivot / Power Query" from={750} to={1320} tone="normal" />
    </Stage>
  );
};
